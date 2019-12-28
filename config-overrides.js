const { override, disableEsLint, fixBabelImports, addDecoratorsLegacy } = require('customize-cra')

module.exports = override(
  addDecoratorsLegacy(),
  disableEsLint(),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css'
  })
)
