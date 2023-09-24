import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/node/cli.ts', './src/node/index.ts'],
  clean: true,
  bundle: true,
  splitting: true,
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  shims: true,
})
