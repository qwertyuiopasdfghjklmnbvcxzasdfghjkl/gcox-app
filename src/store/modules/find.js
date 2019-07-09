const state = {
  adsense:[],
}
const getters = {
  getAdsense (state){
    return state.adsense
  },
}

const mutations = {
  updateAdsense (state, adsense){
    state.adsense = adsense
  },
}

const actions = {
  setAdsense ({commit}, adsense){
    commit('updateAdsense',adsense)
  },
}

export default {
  getters,
  state,
  mutations,
  actions
}
