import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/tiny.js',
    format: 'umd',
    name: 'Tiny'
  },
  plugins: [
    typescript({
      declaration: true,
      declarationDir: 'dist/types'
    }),
    alias({
      entries: [{ find: '@', replacement: '../src' }]
    })
  ]
};
