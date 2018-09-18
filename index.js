module.exports = (api, projectOptions) => {
  api.chainWebpack(webpackConfig => {
    // modify webpack config with webpack-chain
  })

  api.configureWebpack(webpackConfig => {
    // modify webpack config
    // or return object to be merged with webpack-merge
  })

  api.registerCommand('vuexmodule', args => {
    // register `vue-cli-service test`
  })
}
