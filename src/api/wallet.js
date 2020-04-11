/**
 * 钱包API接口
 */
import api from '@/api'

let domain = ''
let wallet = {}

// 获取对应币种钱包
const getWalletByCoin = function (data, success, error) {
  api.get(`${domain}api/v2/account/show`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.getWalletByCoin = getWalletByCoin

// 我的资产
const myAssets = function (data, success, error) {
  api.get(`${domain}api/v2/account/listAccounts`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.data, res.msg) // res.data: 1 表示账户被冻结
    }
  }, error)
}
wallet.myAssets = myAssets

// 查询钱包地址
const listWithdraws = function (symbol, success, error) {
  api.get(`${domain}api/v2/account/showWithdraw`,{symbol:'symbol'}, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.listWithdraws = listWithdraws

// 钱包提现
const walletWithdraw = function (data, success, error) {
  api.post(`${domain}api/v2/account/withdraw`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.msg)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.walletWithdraw = walletWithdraw

// 充值/提现记录 direction: 1 充值、2 提现
const listDepositHistory = function (data, success, error) {
  api.post(`${domain}/api/v2/account/showHistory`, data, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.listDepositHistory = listDepositHistory

// 充值记录 data{symbol: 币种, pageSize: 每页展示数量, page: 页码}
const depositHistory = function (data, success, error) {
  api.post(`${domain}/api/v2/account/showDepositHistory`, data, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.depositHistory = depositHistory

// 提现记录 data{symbol: 币种, pageSize: 每页展示数量, page: 页码}
const withdrawalHistory = function (data, success, error) {
  api.post(`${domain}/api/v2/account/showWithdrawApplyHistory`, data, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.withdrawalHistory = withdrawalHistory

// 查询EOS钱包地址
const getEosAddress = function (success, error) {
  api.get(`${domain}api/v2/account2/eos_main`, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.getEosAddress = getEosAddress


//拉取最新版本
const getLatestVersion  = function (success, error) {
  api.get(`${domain}/api/v2/trade/sys_params`, (res) => {
    if (res.rst === 1) {
      success && success(res.data.reduce(function(obj,item){obj[item.code]=item.value;return obj;}))
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.getLatestVersion  = getLatestVersion

// 获取交易记录 data{symbol: 币种, pageSize: 每页展示数量, page: 页码}
const getTransList = function (data, success, error) {
  api.post(`${domain}/api/v1/trans/queryList`, data, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.getTransList = getTransList

// 提现地址列表 /api/v2/account2/gcox/withdraw/address
const addressList = function (data, success, error) {
  api.post(`${domain}api/v2/account2/gcox/withdraw/address/list`, data, (res) => {
    if (res.rst === 1) {
      success && success(res.data)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.addressList = addressList

// 新增提现地址
const addAddress = function (data, success, error) {
  api.post(`${domain}api/v2/account2/gcox/withdraw/address/add`, data, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.addAddress = addAddress

// 删除提现地址
const deleteAddress = function (withdrawId, success, error) {
  api.delete(`${domain}api/v2/account2/gcox/withdraw/address/delete/${withdrawId}`, (res) => {
    if (res.rst === 1) {
      success && success(res)
    } else {
      error && error(res.msg)
    }
  }, error)
}
wallet.deleteAddress = deleteAddress

export default wallet
