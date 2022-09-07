module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    'removeDimensions',
    'prefixIds',
  ],
  js2svg: {
    indent: 2,
    pretty: true,
  },
};
