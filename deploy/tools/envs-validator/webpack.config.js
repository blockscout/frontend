const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: path.resolve(__dirname) + '/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    plugins: [ new TsconfigPathsPlugin({ configFile: './tsconfig.json' }) ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname),
  },
};
