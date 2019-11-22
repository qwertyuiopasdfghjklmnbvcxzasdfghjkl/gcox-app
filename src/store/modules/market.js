import JsCookies from 'js-cookie'
import numUtils from '@/assets/js/numberUtils'

const last24h = {open: '0', high: '0', bottom: '0', close: '0', vol: '0', rfvol: '0', percent: '0'}
const fixed = 8

const state = {
  initMarket: 'ETH_BTC', // 初始市场
  marketList: [], // 交易市场列表
  last24h: last24h,
  marketConfig: null,
  entrustPrices: [],
  entrustNewPrice: 0,
  events: {},
}
const getters = {
  getInitMarket (state) {
    return state.initMarket
  },
  getMarketList (state) {
    return state.marketList
  },
  getLast24h (state) {
    return state.last24h
  },
  getMarketConfig (state) {
    return state.marketConfig
  },
  getEntrustPrices (state) {
    return state.entrustPrices
  },
  getEntrustNewPrice (state) {
    return state.entrustNewPrice
  },
}

const mutations = {
  updateMarketList (state, marketList) {
    state.marketList = marketList
  },
  updateLast24h (state, last24h) {
    state.last24h = last24h
  },
  updateMarketConfig (state, marketConfig) {
    state.marketConfig = marketConfig
  },
  addEvents (state, ev) {
    if (state.events[ev.name]) {
      state.events[ev.name].push(ev.fun)
    } else {
      state.events[ev.name] = [ev.fun]
    }
  },
  removeEvents (state, name) {
    delete state.events[name]
  },
  tiggerEvents (state, obj) {
    if (state.events[obj.name]) {
      state.events[obj.name].forEach((callback) => {
        callback(obj.params)
      })
    }
  },
  updateEntrustPrices (state, datas) {
    state.entrustPrices = datas
  },
  updateEntrustNewPrice (state, price) {
    state.entrustNewPrice = price
  },
}

const actions = {
  setMarketList (context, marketList) {
    marketList = JSON.parse(JSON.stringify(marketList))
    marketList.sort((item1, item2) => {
      let m1 = `${item1.currencySymbol}/${item1.baseSymbol}`
      let m2 = `${item2.currencySymbol}/${item2.baseSymbol}`
      if (m1 === m2) {
        return 0
      }
      return m1 < m2 ? -1 : 1
    })
    context.commit('updateMarketList', marketList)
  },
  setLast24h (context, data) {
    if (!data) {
      context.commit('updateLast24h', last24h)
      return
    }
    data = data[0].constructor === Array ? data[0] : data
    let open = numUtils.BN(data[0]).toFixed(fixed)
    let high = numUtils.BN(data[1]).toFixed(fixed)
    let bottom = numUtils.BN(data[2]).toFixed(fixed)
    let close = numUtils.BN(data[3]).toFixed(fixed)
    let direction = Number(data[8])
    context.commit('updateLast24h', {
      open: open,
      high: high, // 24h最高价
      bottom: bottom, // 24h最低价
      close: close, //  最新价
      vol: numUtils.BN(data[4]).toFixed(fixed), // 24h成交量
      rfvol: numUtils.minus(close, open).toFixed(fixed), // 涨跌幅
      percent: !numUtils.BN(open).equals(0) ? numUtils.minus(close, open).div(open).mul(100).toFixed(2) : '0.00',
      direction: direction // 价格 1 买 绿色、2 卖 红色
    })
  },
  setMarketConfig (context, marketConfig) {
    context.commit('updateMarketConfig', marketConfig)
  },
  addEvents (context, ev) {
    context.commit('addEvents', ev)
  },
  removeEvents (context, name) {
    context.commit('removeEvents', name)
  },
  tiggerEvents (context, obj) {
    context.commit('tiggerEvents', obj)
  },
  setEntrustPrices (context, datas) {
    if (!datas) {
      context.commit('updateEntrustPrices', [])
      return
    }
    let temp = {}
    let newDatas = []
    for (let i = 0; i < datas.length; i++) {
      let d = datas[i]
      let price = numUtils.BN(String(d.price)).toFixed(fixed)
      let direction = String(d.direction)
      let key = price + '_' + direction
      if (!temp[key]) {
        temp[key] = true
        newDatas.push([price, direction])
      }
    }
    context.commit('updateEntrustPrices', newDatas)
  },
  setEntrustNewPrice (context, price) {
    context.commit('updateEntrustNewPrice', price)
  },
}

export default {
  getters,
  state,
  mutations,
  actions
}
