import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/node/cli.ts'],
  bundle: true,
  splitting: true,
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  shims: true,
})
