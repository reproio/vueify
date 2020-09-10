const chalk = require('chalk')
const vueCompiler = require('vue-template-compiler')
const { transform } = require('@babel/core')

module.exports = function compileTemplate (template, compiler) {
  var compiled = vueCompiler.compile(template)
  if (compiled.errors.length) {
    compiled.errors.forEach(function (msg) {
      console.error('\n' + chalk.red(msg) + '\n')
    })
    throw new Error('Vue template compilation failed')
  } else {
    return {
      render: toFunction(compiled.render),
      staticRenderFns: '[' + compiled.staticRenderFns.map(toFunction).join(',') + ']'
    }
  }
}

function toFunction (code) {
  return transform(`function render() {${code}}`, {
    parserOpts: { sourceType: "script" },
    plugins: ["@babel/plugin-transform-modules-commonjs"]
  }).code;
}