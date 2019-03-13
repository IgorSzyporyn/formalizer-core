'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/formalizer-core.cjs.production.js')
} else {
  module.exports = require('./dist/formalizer-core.cjs.development.js')
}
