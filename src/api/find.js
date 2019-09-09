/**
 * 发现API接口
 */
import api from '@/api'

let domain = ''
let find = {}

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

// banaer
const getBanner = function (data, success, error) {
  api.get(`${domain}api/v2/individual/promotionActivity`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.getBanner = getBanner

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

// 公告
const getCmsList = function (data, success, error) {
  api.post(`${domain}/api/v1/cms/list`, data, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.getCmsList = getCmsList

// 获取cms详情
const getCmsDetail = function (id, success, error) {
  api.get(`${domain}/api/v1/cms/detail/${id}`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
find.getCmsDetail = getCmsDetail

export default find
