import Vue from 'vue'
import axios from 'axios'
// import '../theme/index.css'
import ElementUI from 'element-ui'
import './styles/element-variables.scss'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en'
import App from './App'
import router from './router'
import store from './store'
import '@/icons' // icon
import '@/permission' // 权限
import $ from 'jquery'
// import QRCode from 'qrcodejs2' // 二维码生成器

import GeminiScrollbar from 'vue-gemini-scrollbar'
Vue.use(GeminiScrollbar)

import Global from '@/views/Global'  // 引入全局变量
Vue.prototype.GLOBAL = Global //挂载到Vue实例上面
// 引入base64
var Base64 = require('js-base64').Base64

import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.use(ElementUI, { size: 'small' })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
