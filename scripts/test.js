import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';
import { resolve } from 'path';

const rootDir = process.cwd();

export default {
  input: 'test/index.test.ts',
  output: {
    file: 'lib/tiny.test.js',
    format: 'esm'
  },
  external: ['tiny.js'],
  plugins: [
    typescript(),
    alias({
      entries: [{ find: 'tiny-test', replacement: resolve(rootDir, 'lib/tiny.js') }]
    })
  ]
};
