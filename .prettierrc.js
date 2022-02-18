const fabric = require('@umijs/fabric')

module.exports = {
  ...fabric.prettier,
  singleQuote: true,
  bracketSpacing: true,
  semi: false,
  arrowParens: 'avoid',
  printWidth: 140,
  trailingComma: 'none'
}
