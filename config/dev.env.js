'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://localhost/"',
  API_URL: '"http://localhost/api/v1/"',
  OAUTH_URL: '"http://localhost/oauth/"',
  BC_URL: '"https://srv.nkn.org:10443/api/v1/"'
})
