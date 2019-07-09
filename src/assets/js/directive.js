//自定义Vue指令集合

import Vue from 'vue'


// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})
// 注册一个全局自定义指令 `v-selected`
Vue.directive('selected', {
  inserted: function (el) {
    el.select()
  }
})

