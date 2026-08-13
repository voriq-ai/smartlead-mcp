import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    server: 'src/server.ts',
  },
  format: ['esm'],
  target: 'node20',
  platform: 'node',
  dts: { entry: { server: 'src/server.ts' } },
  clean: true,
  // Source maps are intentionally disabled: they would embed original sources in
  // the published tarball with no benefit to consumers.
  sourcemap: false,
  splitting: true,
  treeshake: true,
  // The CLI shebang lives at the top of src/index.ts; esbuild preserves the
  // entry point's hashbang, so a global banner would also stamp the library
  // entry and shared chunks.
});
