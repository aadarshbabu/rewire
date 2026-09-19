import * as esbuild from 'esbuild';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiRoot = path.resolve(__dirname, '..');
const artifactsDir = process.env.ARTIFACTS_DIR || path.join(apiRoot, 'dist-lambda');

console.log(`[build-lambda] Packaging AI Worker Lambda into: ${artifactsDir}`);

// Ensure destination directories exist
fs.mkdirSync(path.join(artifactsDir, 'dist'), { recursive: true });

// Bundle compiled dist/lambda.js into a standalone bundle
await esbuild.build({
  entryPoints: [path.join(apiRoot, 'dist/lambda.js')],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'cjs',
  outfile: path.join(artifactsDir, 'dist/lambda.js'),
  external: [
    'pg-native',
    'class-transformer',
    'class-validator',
    '@nestjs/websockets',
    '@nestjs/microservices',
    '@fastify/*',
  ],
  sourcemap: true,
  logLevel: 'info',
});

// Also provide top-level lambda.js symlink/copy so both lambda.handler and dist/lambda.handler work
fs.copyFileSync(
  path.join(artifactsDir, 'dist/lambda.js'),
  path.join(artifactsDir, 'lambda.js')
);
if (fs.existsSync(path.join(artifactsDir, 'dist/lambda.js.map'))) {
  fs.copyFileSync(
    path.join(artifactsDir, 'dist/lambda.js.map'),
    path.join(artifactsDir, 'lambda.js.map')
  );
}

// Minimal package.json for Node.js CommonJS runtime in Lambda
fs.writeFileSync(
  path.join(artifactsDir, 'package.json'),
  JSON.stringify({ name: 'ai-worker-lambda', type: 'commonjs' }, null, 2)
);

// Copy Prisma query compiler wasm if found in workspace
const findPrismaWasm = () => {
  const possiblePaths = [
    path.join(apiRoot, '../../node_modules/.pnpm'),
    path.join(apiRoot, 'node_modules/.pnpm'),
  ];
  for (const basePath of possiblePaths) {
    if (fs.existsSync(basePath)) {
      const pnpmDirs = fs.readdirSync(basePath);
      for (const dir of pnpmDirs) {
        if (dir.startsWith('@prisma+client@')) {
          const clientPath = path.join(basePath, dir, 'node_modules/.prisma/client/query_compiler_fast_bg.wasm');
          if (fs.existsSync(clientPath)) {
            return clientPath;
          }
        }
      }
    }
  }
  return null;
};

const wasmPath = findPrismaWasm();
if (wasmPath) {
  console.log(`[build-lambda] Found Prisma WASM: ${wasmPath}`);
  fs.copyFileSync(wasmPath, path.join(artifactsDir, 'query_compiler_fast_bg.wasm'));
  fs.copyFileSync(wasmPath, path.join(artifactsDir, 'dist/query_compiler_fast_bg.wasm'));
}

console.log(`[build-lambda] Successfully bundled Lambda artifact!`);
