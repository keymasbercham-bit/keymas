/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Card, Button, Badge } from "../components/UI";
import { User, QrCode, Scan, XCircle, CheckCircle2, UserCircle2 } from "lucide-react";

export default function AdminScanner() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, onScanError);

    function onScanSuccess(decodedText: string) {
      try {
        const data = JSON.parse(decodedText);
        setScanResult(data);
        scanner.clear();
      } catch (e) {
        setError("Invalid QR Code format. Please scan a valid KeyMas QR.");
      }
    }

    function onScanError(err: string) {
      // console.warn(`Code scan error = ${err}`);
    }

    return () => {
      scanner.clear().catch(e => console.error("Error clearing scanner", e));
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">QR Counter Scanner</h1>
        <Badge status={scanResult ? "inprogress" : "available"}>
          {scanResult ? "USER DETECTED" : "READY TO SCAN"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-4 bg-black overflow-hidden aspect-square flex flex-col items-center justify-center relative">
          <div id="reader" className="w-full"></div>
          {!scanResult && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 pointer-events-none">
              <Scan className="w-12 h-12 mb-2 animate-pulse" />
              <p className="text-sm font-medium">Position user QR within the frame</p>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              <UserCircle2 className="w-5 h-5 text-primary" />
              Scanned User Info
            </h3>

            {scanResult ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-lg font-bold text-gray-900">{scanResult.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Student ID</p>
                    <p className="font-mono font-bold text-gray-700">{scanResult.id}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Department</p>
                    <p className="font-bold text-gray-700">{scanResult.dept}</p>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button className="flex-1 gap-2" size="lg">
                    <CheckCircle2 className="w-5 h-5" />
                    Assign Room
                  </Button>
                  <Button variant="outline" onClick={() => { setScanResult(null); window.location.reload(); }}>
                    Clear
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400">
                <QrCode className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Waiting for successful scan...</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-2 text-sm">
                <XCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-primary text-white">
            <h4 className="font-bold mb-2">Counter Instructions</h4>
            <ul className="text-sm space-y-2 opacity-90">
              <li>• Ensure user QR is clearly visible on their device.</li>
              <li>• Once scanned, verify the user details match their ID card.</li>
              <li>• Select an available room from the next screen.</li>
              <li>• Confirm duration and key collection.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
