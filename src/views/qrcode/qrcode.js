import Vue from 'vue'
import store from '@/store'
// import router from '@/router'
import qrcode from './qrcode.vue'
Vue.config.productionTip = false

new Vue({
  el: '#qrcode',
  store,
//   router,
  template: '<App/>',
  render: h => h(qrcode)
})