import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: ['./src/node/cli.ts', './src/node/index.ts', './src/node/dev.ts'],
  clean: true,
  bundle: true,
  splitting: true,
  minify: process.env.NODE_ENV === 'production',
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  shims: true,
})
