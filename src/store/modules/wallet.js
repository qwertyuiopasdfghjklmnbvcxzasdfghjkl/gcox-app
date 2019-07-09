import JsCookies from 'js-cookie'
import numUtils from '@/assets/js/numberUtils'

const state = {
  btcValuation: 0,
  USDCNY: {},
  networkSignal: 0,
  btcValues: {},
  userWallets: [],
}
const getters = {
  getBTCValuation (state) {
    return state.btcValuation
  },
  getUSDCNY (state) {
    if (state.lang === 'en') {
      return state.USDCNY && state.USDCNY.USD
    } else {
      return state.USDCNY && state.USDCNY.CNY
    }
  },
  getCoinSign (state) {
    return state.lang === 'en' ? '$' : '¥'
  },
  getNetworkSignal (state) {
    return state.networkSignal
  },
  getBtcValues (state) {
    return state.btcValues
  },
  getUserWallets (state) {
    return state.userWallets
  },
  getUsdRate (state) {
    if (state.USDCNY && state.USDCNY.USD && state.USDCNY.CNY) {
      return numUtils.div(state.USDCNY.USD, state.USDCNY.CNY).toFixed(2)
    } else {
      return 0
    }
  },
}

const mutations = {
  updateBTCValuation (state, btcValuation) {
    state.btcValuation = btcValuation
  },
  updateUSDCNY (state, USDCNY) {
    state.USDCNY = USDCNY
  },
  updateNetworkSignal (state, signal) {
    state.networkSignal = signal
  },
  updateBtcValues (state, btcValues) {
    state.btcValues = btcValues
  },
  updateUserWallets (state, userWallets) {
    state.userWallets = userWallets
  },
}

const actions = {
  setBTCValuation (context, btcValuation) {
    context.commit('updateBTCValuation', btcValuation)
  },
  setUSDCNY (context, USDCNY) {
    context.commit('updateUSDCNY', USDCNY)
  },
  setNetworkSignal (context, signal) {
    context.commit('updateNetworkSignal', signal)
  },
  setBtcValues (context, data) {
    let btcValues = {}
    data.forEach((item) => {
      if (item.baseSymbol === 'BTC') {
        btcValues[item.currencySymbol] = item.lastPrice
      }
    })
    context.commit('updateBtcValues', btcValues)
  },
  setUserWallets (context, userWallets) {
    context.commit('updateUserWallets', userWallets)
  },
}

export default {
  getters,
  state,
  mutations,
  actions
}
