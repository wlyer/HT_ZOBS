var merge = require('webpack-merge');
var Host = require('./Host');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST:Host.Host
})
