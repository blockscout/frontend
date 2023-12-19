module.exports = {
  plugins: [
    // TODO @tom2drum pick up plugins from default preset
    // {
    //   name: 'preset-default',
    //   params: {
    //     overrides: {
    //       removeViewBox: false,
    //       cleanupIds: false,
    //       removeUselessDefs: false,
    //       collapseGroups: false,
    //     },
    //   },
    // },
    'removeDimensions',
  ],
  js2svg: {
    indent: 2,
    pretty: true,
  },
};
