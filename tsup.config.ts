import { defineConfig } from 'tsup';
import { readFileSync, writeFileSync, copyFileSync } from 'fs';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  sourcemap: true,
  minify: true,
  banner: {
    js: '"use client";',
  },
  onSuccess: async () => {
    const css = readFileSync('src/styles.css', 'utf-8');
    const minified = css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{}:;,])\s*/g, '$1')
      .trim();
    writeFileSync('dist/styles.css', minified);
  },
});
