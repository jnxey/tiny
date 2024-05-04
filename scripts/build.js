import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'Tiny'
  },
  plugins: [
    typescript(),
    alias({
      entries: [{ find: '@', replacement: '../src' }]
    })
  ]
};
