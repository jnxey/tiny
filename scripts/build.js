import alias from '@rollup/plugin-alias';
import typescript from '@rollup/plugin-typescript';

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
      entries: [{ find: '@', replacement: '../src' }]
    })
  ]
};
