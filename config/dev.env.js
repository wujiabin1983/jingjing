var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"'
  // BASE_API: '"http://localhost:8889/zealand"', //修改为'"https://api-prod"'就行了
  // APP_ORIGIN: '"http://localhost:9528"' //为公司打个广告 pc站为vue+ssr
})
