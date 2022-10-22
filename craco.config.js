const CracoLessPlugin = require('craco-less')

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#D2001A', '@ink-color': '#D2001A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
}
