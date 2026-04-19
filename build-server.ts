/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as esbuild from "esbuild";

async function build() {
  await esbuild.build({
    entryPoints: ["server.ts"],
    bundle: true,
    platform: "node",
    format: "cjs",
    outfile: "dist/server.cjs",
    external: ["vite", "path", "fs", "url", "express"], // Vite is handled separately
  });
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
