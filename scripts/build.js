import alias from '@rollup/plugin-alias';
import typescript from '@rollup/plugin-typescript';
import { resolve } from 'path';

const rootDir = process.cwd();

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/tiny.js',
    format: 'es',
    name: 'Tiny'
  },
  plugins: [
    typescript(),
    alias({
      entries: [{ find: '@', replacement: resolve(rootDir, 'src') }]
    })
  ]
};
