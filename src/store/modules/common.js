import JsCookies from 'js-cookie'
import numUtils from '@/assets/js/numberUtils'

let userInfo = null, quickLoginInfo = null
try {
  userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  quickLoginInfo = localStorage.getItem('quickLogin') && JSON.parse(localStorage.getItem('quickLogin'))
} catch (ex) {}

const state = {
  lang: window.localStorage.getItem('lang') || 'en', //语言包
  api_token: JsCookies.get('api_token'),
  userInfo: userInfo || {},
  quickLoginInfo: quickLoginInfo,
  version: '1.0.0'
}
const getters = {
  getLang (state){
    return state.lang
  },
  getApiToken (state) {
    return state.api_token
  },
  getUserInfo (state) {
    return state.userInfo
  },
  getQuickLoginInfo(state){
    return state.quickLoginInfo
  },
  getVersion (state) {
    return state.version
  },
}

const mutations = {
  updateLang (state, lang){
    state.lang = lang
  },
  updateApiToken (state, apiToken) {
    state.api_token = apiToken
  },
  updateUserInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  updateQuickLoginInfo(state, quickLoginInfo) {
    state.quickLoginInfo = quickLoginInfo
  },
  updateVersion (state, version) {
    state.version = version
  },
}

const actions = {
  setLang ({commit}, lang){
    window.localStorage.setItem('lang', lang)
    commit('updateLang',lang)
  },
  setApiToken (context, apiToken) {
    if (apiToken) {
      JsCookies.set('api_token', apiToken, { expires: 365*100 })
      localStorage.setItem('isFirstLogin', true)
    } else {
      window.localStorage.removeItem('userInfo')
      JsCookies.remove('api_token')
    }
    context.commit('updateApiToken', apiToken)
  },
  setUserInfo (context, userInfo) {
    if (userInfo) {
      window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
    } else {
      window.localStorage.removeItem('userInfo')
    }
    context.commit('updateUserInfo', userInfo)
  },
  setQuickLoginInfo (context, quickLoginInfo) {
    if (quickLoginInfo) {
      window.localStorage.setItem('quickLogin', JSON.stringify(quickLoginInfo))
    } else {
      window.localStorage.removeItem('quickLogin')
    }
    context.commit('updateQuickLoginInfo', quickLoginInfo)
  },
  setVersion ({commit}, version){
    commit('updateVersion',version)
  },
}

export default {
  getters,
  state,
  mutations,
  actions
}
