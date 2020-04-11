import Vue from 'vue'
import Router from 'vue-router'
import Find from '@/views/find'
import modules from './modules'
import Maintain from '../views/maintain'

Vue.use(Router)

let home = [{path: '/', name: 'find', component: Find, meta: {nav: true}}] //首页
let nomatched = [{path: '*', redirect:'/'}] // 未知页面转向首页
let maintain = [{path: 'maintain', name: 'maintain', component: Maintain}] // 维护页面
let routes = home.concat(modules,maintain,nomatched)
export default new Router({
  routes:routes
})
