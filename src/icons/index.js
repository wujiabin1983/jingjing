import Vue from 'vue'
import IconSvg from '@/components/Icon-svg'// svg组件
import SvgIcon from '@/components/SvgIcon'// svg组件

// register globally
Vue.component('icon-svg', IconSvg)
Vue.component('svg-icon', SvgIcon)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
