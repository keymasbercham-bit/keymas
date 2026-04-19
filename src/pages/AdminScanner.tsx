/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Card, Button, Badge } from "../components/UI";
import { QrCode, Scan, XCircle, CheckCircle2, Fingerprint, Radio, Camera, CameraOff, Keyboard } from "lucide-react";

export default function AdminScanner() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2) { // SCANNING
          await scannerRef.current.stop();
        }
      } catch (e) {
        // Ignore stop errors
      }
      scannerRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startScanner = useCallback(async () => {
    setError(null);
    
    // Clean up any existing scanner
    await stopScanner();

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.id && data.name) {
              setScanResult(data);
              scanner.stop().catch(() => {});
              setCameraActive(false);
            } else {
              setError("Invalid QR data format.");
            }
          } catch {
            setError("Invalid QR Code. Please scan a valid KeyMas QR.");
          }
        },
        () => {
          // QR code not detected - no action needed
        }
      );

      setCameraActive(true);
    } catch (err: any) {
      console.error("Scanner error:", err);
      if (err?.toString().includes("NotAllowedError") || err?.toString().includes("Permission")) {
        setError("Camera permission denied. Please allow camera access or use manual entry.");
      } else if (err?.toString().includes("NotFoundError")) {
        setError("No camera found on this device. Use manual entry instead.");
      } else {
        setError("Could not start camera. Try manual entry instead.");
      }
      setCameraActive(false);
    }
  }, [stopScanner]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data = JSON.parse(manualInput);
      if (data.id && data.name) {
        setScanResult(data);
        setManualInput("");
      } else {
        setError("Invalid data. Expected JSON with 'id' and 'name' fields.");
      }
    } catch {
      // Try treating it as a plain ID
      if (manualInput.trim()) {
        setScanResult({
          id: manualInput.trim(),
          name: "Manual Entry",
          dept: "—"
        });
        setManualInput("");
      } else {
        setError("Please enter a valid QR data string or user ID.");
      }
    }
  };

  const handleReset = async () => {
    setScanResult(null);
    setError(null);
    setManualInput("");
    await stopScanner();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">QR Counter Scanner</h1>
          <p className="text-sm text-slate-500 mt-1">Scan user QR codes for key verification</p>
        </div>
        <Badge status={scanResult ? "inprogress" : "available"}>
          <span className="relative flex items-center gap-1.5">
            {!scanResult && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            {scanResult ? "USER DETECTED" : "READY"}
          </span>
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner / Camera Panel */}
        <div className="space-y-4">
          <Card className="overflow-hidden relative">
            <div className="bg-slate-900 rounded-xl overflow-hidden aspect-square flex flex-col items-center justify-center relative">
              {/* QR Reader container - always present but hidden when not active */}
              <div 
                id="qr-reader" 
                ref={containerRef}
                className={`w-full h-full ${cameraActive ? 'block' : 'hidden'}`}
                style={{ minHeight: '300px' }}
              />
              
              {/* Idle state */}
              {!cameraActive && !scanResult && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 p-6">
                  <div className="relative mb-6">
                    <Scan className="w-16 h-16" />
                  </div>
                  <p className="text-sm font-medium mb-6 text-center">Click below to activate the camera</p>
                  <Button 
                    onClick={startScanner} 
                    className="gap-2"
                    size="lg"
                  >
                    <Camera className="w-5 h-5" />
                    Start Camera
                  </Button>
                </div>
              )}

              {/* Success state */}
              {scanResult && !cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-16 h-16 mb-3" />
                  <p className="text-lg font-bold">Scan Successful</p>
                </div>
              )}

              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary/40 rounded-tl-md pointer-events-none" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary/40 rounded-tr-md pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary/40 rounded-bl-md pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary/40 rounded-br-md pointer-events-none" />
            </div>
          </Card>

          {/* Camera Controls */}
          <div className="flex gap-2">
            {cameraActive ? (
              <Button variant="danger" onClick={stopScanner} className="flex-1 gap-2" size="sm">
                <CameraOff className="w-3.5 h-3.5" />
                Stop Camera
              </Button>
            ) : !scanResult ? (
              <>
                <Button onClick={startScanner} className="flex-1 gap-2" size="sm">
                  <Camera className="w-3.5 h-3.5" />
                  Start Camera
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setManualMode(!manualMode)} 
                  className="gap-2" 
                  size="sm"
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  Manual
                </Button>
              </>
            ) : null}
          </div>

          {/* Manual Input */}
          {manualMode && !scanResult && (
            <Card className="p-4 animate-fade-in-up">
              <form onSubmit={handleManualSubmit} className="space-y-3">
                <label className="label-micro block">Enter QR Data or User ID</label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder='User ID or {"id":"...","name":"...","dept":"..."}'
                  className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200/80 rounded-xl outline-none text-sm font-mono transition-all duration-200"
                  autoFocus
                />
                <Button type="submit" size="sm" className="w-full">
                  Submit
                </Button>
              </form>
            </Card>
          )}
        </div>

        {/* Result Panel */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <Fingerprint className="w-4 h-4 text-primary" />
              </div>
              Scanned User Info
            </h3>

            {scanResult ? (
              <div className="space-y-4 animate-fade-in-up">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100/60">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-lg font-bold text-slate-900">{scanResult.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-100/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Student ID</p>
                    <p className="font-mono font-bold text-slate-700">{scanResult.id}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-100/80">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Department</p>
                    <p className="font-bold text-slate-700">{scanResult.dept || "—"}</p>
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <Button className="flex-1 gap-2" size="lg">
                    <CheckCircle2 className="w-5 h-5" />
                    Assign Room
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Clear
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-14 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-sm text-slate-400 font-medium">Waiting for scan...</p>
                <p className="text-[10px] text-slate-300 mt-1">Start camera or use manual entry</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-rose-50 text-rose-600 rounded-xl flex items-start gap-2 text-sm border border-rose-100 animate-fade-in">
                <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p>{error}</p>
                  {!manualMode && (
                    <button 
                      onClick={() => setManualMode(true)} 
                      className="text-xs font-bold underline mt-1 cursor-pointer"
                    >
                      Switch to manual entry
                    </button>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Instructions */}
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-[0.97]" />
            <div className="relative p-6 text-white">
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <Radio className="w-4 h-4" />
                Counter Instructions
              </h4>
              <ul className="text-sm space-y-2.5 opacity-90">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                  Click "Start Camera" and allow camera access.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  Point camera at the user's QR code on their phone.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                  Verify user details match their physical ID card.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                  Click "Assign Room" to proceed with key handover.
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
