import { getBabelOutputPlugin } from '@rollup/plugin-babel';

export default {
  input: 'test/index.test.js',
  output: {
    file: 'lib/tiny.test.js',
    format: 'esm'
  },
  plugins: [
    getBabelOutputPlugin({
      plugins: [
        ['@babel/plugin-proposal-decorators', { version: 'legacy' }],
        ['@babel/plugin-transform-class-properties', { loose: true }]
      ]
    })
  ]
};
