import alias from '@rollup/plugin-alias';
import { dts } from 'rollup-plugin-dts';
import { resolve } from 'path';

const rootDir = process.cwd();

console.log(rootDir, '-----');

export default {
  input: 'types/index.d.ts',
  output: {
    file: 'lib/tiny.d.ts',
    format: 'es',
    name: 'Tiny'
  },
  plugins: [
    dts(),
    alias({
      entries: [{ find: '@', replacement: resolve(rootDir, 'types') }]
    })
  ]
};
