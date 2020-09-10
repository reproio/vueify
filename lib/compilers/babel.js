var fs = require('fs')
var path = require('path')
var json = require('json5')
var ensureRequire = require('../ensure-require')

var defaultBabelOptions = {
  plugins: ["@babel/plugin-transform-modules-commonjs"]
}

var babelRcPath = path.resolve(process.cwd(), '.babelrc')
var babelOptions = fs.existsSync(babelRcPath)
  ? getBabelRc() || defaultBabelOptions
  : defaultBabelOptions

function getBabelRc () {
  var rc
  try {
    rc = json.parse(fs.readFileSync(babelRcPath, 'utf-8'))
  } catch (e) {
    throw new Error('[vueify] Your .babelrc seems to be incorrectly formatted.')
  }
  return rc
}

module.exports = function (raw, cb, compiler, filePath) {
  try {
    var babel = require('@babel/core')
    var options = {
      comments: false,
      filename: filePath,
      sourceMaps: compiler.options.sourceMap,
      ...(compiler.options.babel || babelOptions)
    }
    var res = babel.transform(raw, options)
  } catch (err) {
    return cb(err)
  }
  cb(null, res)
}
