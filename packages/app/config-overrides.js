const { override, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(
  addWebpackAlias({
    '@legacy': path.resolve(__dirname, 'src'),
  })
)
