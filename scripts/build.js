import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';

export default {
  input: 'src/index.ts',
  output: {
    file: 'lib/tiny.js',
    format: 'es',
    name: 'Tiny'
  },
  plugins: [
    typescript({
      declaration: true,
      composite: true,
      declarationDir: 'lib/types'
    }),
    alias({
      entries: [{ find: '@', replacement: '../src' }]
    })
  ]
};
