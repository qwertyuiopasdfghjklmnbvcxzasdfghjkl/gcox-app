import Vue from 'vue'
import Cookies from 'js-cookie';
import App from './App.vue'
import router from './router/'
import store from './store/'
import axios from 'axios'
import VConsole   from 'vconsole'

import VueI18n from 'vue-i18n' //多语言处理模块
import vueTap from 'v-tap'
import Methods from './assets/js/methods'
import LangEn from './lang/en' //英文包
import LangZhCN from './lang/zh-CN' //简体中文包
import MaskLayer from '@/components/common/mask'
import TopBack from '@/components/common/top_back'
import numberKeyboard from '@/components/common/numberKeyboard'
import SubmitButton from '@/components/common/SubmitButton'

import VeeValidate from 'vee-validate' // 验证
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.min.css'
import '@/assets/js/vee-validate'

import {
  Indicator, Button, Tabbar, TabItem, Loadmore, InfiniteScroll, Popup,
    Picker, Range, Navbar, TabContainer, TabContainerItem, Switch
} from 'mint-ui'

import uiInpu from './components/uiInput'

require('./assets/js/cordovaUtils') //引入cordova工具集
require('./assets/js/directive') //引入全局自定义指令集
require('./assets/js/filter') //引入全局自定义过滤器
require('./assets/js/prototype') //引入全局自定义过滤器

Vue.use(VueI18n)
Vue.use(vueTap)
Vue.use(uiInpu)
Vue.use(VeeValidate, {events: null })
Vue.use(VueAwesomeSwiper)
Vue.component(Button.name, Button)
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(Loadmore.name, Loadmore)
Vue.component(Popup.name, Popup)
Vue.use(InfiniteScroll)
Vue.component(Picker.name, Picker)
Vue.component(Range.name, Range)
Vue.component(Navbar.name, Navbar)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Switch.name, Switch);

Vue.component(MaskLayer.name, MaskLayer)
Vue.component(TopBack.name, TopBack)
Vue.component(numberKeyboard.name, numberKeyboard)
Vue.component(SubmitButton.name, SubmitButton)

if(process.env.VUE_APP_CURRENTMODE!=='app'){
  // window.vConsole = new VConsole()
}

//全局引入提示函数
window.Tip = require('@/components/common/tip').default
//全局引入加载提示效果
window.Indicator = Indicator

//请求加入随机参数
let $ajax = axios.create({
  contentType: "application/json;charset=utf-8",
  params: {
    _r: new Date().getTime()
  }
})

Vue.prototype.$ajax = $ajax

let i18n = window.$i18n = new VueI18n({
  locale: store.state.common.lang,
  messages: {
    'en': LangEn,
    'zh-CN': LangZhCN,
  }
})

Vue.config.productionTip = false

//路由拦截
router.beforeEach((to, from, next) => {
  let login = to.meta.login
  if(to.name==='gameSupport' && to.params.name){
    window.gameDetail = to.params
  }
  if (login && !Cookies.get('api_token')) {  // 判断是否要求登录才能访问
      next({
          name: 'login',
          query:{curl:to.fullPath}
      });
  } else if (Cookies.get('api_token') &&  ['login','findPwd','resetpwd'].includes(to.name)) {  // 判断已经登录则不再访问列表中的页面
      next({
          name: 'find'
      });
  } else {
      //快速登录状态时，访问部分页面需要先绑定手机号
      let needBind = ['changePassword','changePaymentPassword','page-topup','page-withdrawal'].includes(to.name)
      if(needBind && window.vm && window.vm.$store.getters.getQuickLoginInfo){
        Tip({type:'error', message:vm.$t('public0.mobielBindTip'), delay:5000})
        next({
          name:'register',
          replace: true,
          query:{ac:'bind'}
        })
      } else {
        next()
      }
  }


});

window.vm = new Vue({
  i18n,
  methods:Methods,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

