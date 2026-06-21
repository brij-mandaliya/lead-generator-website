import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "/home/brij.mandliya/Documents/data document/BRIJ_MANDALIYA/Lead-Generator-Website/node_modules/.pnpm/esbuild@0.27.3/node_modules/esbuild/lib/main.js";

const artifactDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(artifactDir, "dist");

const pnpmStore = path.resolve(artifactDir, "../../node_modules/.pnpm/node_modules");

await esbuild({
  entryPoints: [path.resolve(artifactDir, "src/index.ts")],
  platform: "node",
  bundle: true,
  format: "esm",
  outdir: distDir,
  outExtension: { ".js": ".mjs" },
  logLevel: "info",
  nodePaths: [pnpmStore],
  external: [
    "*.node", "sharp", "better-sqlite3", "sqlite3", "canvas",
    "bcrypt", "argon2", "fsevents", "re2", "farmhash",
    "xxhash-addon", "bufferutil", "utf-8-validate", "ssh2",
    "cpu-features", "dtrace-provider", "isolated-vm",
    "lightningcss", "pg-native", "oracledb",
    "mongodb-client-encryption", "nodemailer", "handlebars",
    "knex", "typeorm", "protobufjs", "onnxruntime-node",
    "playwright", "puppeteer", "puppeteer-core", "electron",
  ],
  sourcemap: "linked",
  banner: {
    js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';
globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);`,
  },
});
