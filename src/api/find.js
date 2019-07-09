/**
 * 发现API接口
 */
import api from '@/api'

let domain = ''
let find = {}

// 获取游戏列表
const getGames = function (data, success, error) {
  api.get(`${domain}api/v1/peax/games`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.getGames = getGames

// 获取游戏分类
const getGameCategories = function (data, success, error) {
  api.get(`${domain}api/v1/peax/game/categories`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.getGameCategories = getGameCategories

// 获取推荐游戏
const getRecommendGames = function (data, success, error) {
  api.get(`${domain}api/v1/peax/recommend/games`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.getRecommendGames = getRecommendGames

// 获取广告位
const getAdsense = function (data, success, error) {
  api.get(`${domain}api/v1/peax/game/ads`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.getAdsense = getAdsense

// 获取游戏详情
const getGameDetail = function (data, success, error) {
  api.get(`${domain}api/v1/peax/game`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.getGameDetail = getGameDetail

// 游戏打分
const postGameScore = function (data, success, error) {
  api.post(`${domain}api/v1/peax/game/score`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.postGameScore = postGameScore

// 我的游戏
const getMyGames = function (data, success, error) {
  api.get(`${domain}api/v1/peax/user/games`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.getMyGames = getMyGames

// 收藏游戏
const postFavoriteGame = function (data, success, error) {
  api.post(`${domain}api/v1/peax/user/game`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.postFavoriteGame = postFavoriteGame

// 取消收藏游戏
const delFavoriteGame = function (data, success, error) {
  api.delete(`${domain}api/v1/peax/user/game`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.delFavoriteGame = delFavoriteGame


//获取游戏授权信息
const getGameAauthorizeUser = function (appid, success, error) {
  api.get(`${domain}api/v1/open/login/${appid}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.getGameAauthorizeUser = getGameAauthorizeUser

// 支付订单
const postPaymentOrder = function (appid, data, success, error) {
  api.post(`${domain}api/v1/open/pay/finishorder/${appid}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.postPaymentOrder = postPaymentOrder

// 查询订单
const queryPaymentOrder = function (appid, data, success, error) {
  api.post(`${domain}api/v1/open/pay/query/${appid}`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.queryPaymentOrder = queryPaymentOrder

export default find
