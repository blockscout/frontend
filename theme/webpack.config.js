const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const config = {
  mode: 'production',
  entry: path.resolve(__dirname) + '/theme.ts',
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
    path: path.resolve(__dirname) + '/dist',
    library: {
      type: 'commonjs',
    },
  },
  optimization: {
    minimize: false,
  },
};

module.exports = config;
