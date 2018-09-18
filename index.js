module.exports = (api, options) => {
  api.chainWebpack(webpackConfig => {}),
  api.configWebpack(webpackConfig => {}),
  api.registerCommand('vuexmodule', arg -> {})
}
