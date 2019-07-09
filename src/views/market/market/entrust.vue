<template>
    <section class="entrust-container">
        <div class="navbar">
          <div class="navs">
            <span v-tap="{methods:()=>{active='current'}}" :class="{active:active==='current'}">{{$t('trade_record.current_entrust')}}<!--当前委托--></span>
            <span v-tap="{methods:()=>{active='history'}}" :class="{active:active==='history'}">{{$t('trade_record.history_entrust')}}<!--历史委托--></span>
          </div>
          <div class="hideOther" v-if="active==='current'">
            <label class="mt30 checkbox" for="hideOther">
              <input id="hideOther" type="checkbox" name="hideOther" v-model="hideOtherTrust">
              <i type="checkbox"></i>
            </label>
            <label for="hideOther" class="ml10">{{$t('exchange.exchange_hide_trade_pair')}}<!--隐藏其他交易对--></label>
          </div>
          <div class="hideOther" v-else>
            <label class="mt30 checkbox" for="hideOther">
              <input id="hideOther" type="checkbox" name="hideOther" v-model="hideOtherHistoryTrust">
              <i type="checkbox"></i>
            </label>
            <label for="hideOther" class="ml10">{{$t('exchange.exchange_hide_trade_pair')}}<!--隐藏其他交易对--></label>
          </div>
        </div>
        <mt-tab-container v-model="active" :swipeable="true">
          <mt-tab-container-item id="current">
            <ul class="trust-list" v-if="ncdatas">
              <li v-for="(item, index) in ncdatas" :key="index">
                <div class="title">
                  <span :class="[item.direction==1?'buy':'sell']">{{item.direction==1 ? $t('exchange.exchange_buy') : $t('exchange.exchange_sell')}}</span>
                  <span class="time">{{new Date(Number(item.createdAt)).format()}}</span>
                  <span class="cancel" @click="cancelOrder(item.orderBookId, index)">{{$t('exchange.exchange_revoked')}}<!--撤销--></span>
                </div>
                <div class="data">
                  <div class="data-title">
                    <span>{{$t('exchange.exchange_price')}}<!--价格-->({{item.baseSymbol}})</span>
                    <span>{{$t('exchange.exchange_problem')}}<!--总量-->({{item.currencySymbol}})</span>
                    <span>{{$t('exchange.exchange_Transaction_volume')}}<!--成交量-->({{item.currencySymbol}})</span>
                  </div>
                  <div class="data-info">
                    <span>{{getPrice(item.price)|number}}</span>
                    <span>{{toFixed(item.totalAmount)|number}}</span>
                    <span>{{toFixed(item.finishedAmount)|number}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </mt-tab-container-item>
          <mt-tab-container-item id="history">
            <ul class="trust-list" v-if="nhdatas">
              <li v-for="(item, index) in nhdatas" :key="index">
                <div class="title">
                  <span :class="[item.direction==1?'buy':'sell']">{{getType(item.direction)}}</span>
                  <span class="time">{{new Date(Number(item.createdAt)).format()}}</span>
                  <span class="cancel">{{getStatue(item)}}</span>
                </div>
                <div class="data">
                  <div class="data-title">
                    <span>{{$t('exchange.exchange_Transaction_price')}}<!--成交均价-->({{item.baseSymbol}}) </span>
                    <span>{{$t('exchange.exchange_Transaction_volume')}}<!--成交量-->({{item.currencySymbol}})</span>
                    <span>{{$t('exchange.exchange_Transaction_amount')}}<!--成交金额-->({{item.currencySymbol}})</span>
                  </div>
                  <div class="data-info">
                    <span>{{getPrice(item.price)|number}}</span>
                    <span>{{toFixed(item.finishedAmount)|number}}<em>({{getFinishedPercent(item)}}%)</em></span>
                    <span>{{toFixed(item.dealCurrency)|number}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </mt-tab-container-item>
        </mt-tab-container>

      </section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MessageBox } from 'mint-ui'

import numUtils from '@/assets/js/numberUtils'
import market from '@/api/market'
import cpSwitch from '@/components/switch'
export default {
  props: {
    fixedNumber: {
      type: Number,
      default: 8
    },
    baseSymbol: {
      type: String,
      default: ''
    },
    currentSymbol: {
      type: String,
      default: ''
    },
    symbol: {
      type: String,
      default: ''
    },
    mul: {
      type: Function
    },
    changeEntrustData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
      cpSwitch
  },
  data () {
    return {
      isShow: false,
      active: 'current',
      cdatas: [],
      hdatas: [],
      hideOtherTrust: false,
      hideOtherHistoryTrust: false,
      hideHistoryTrustCanceled: false
    }
  },
  computed: {
    ...mapGetters(['getApiToken']),
    ncdatas () {
      let newDatas = []
      this.cdatas.forEach((item) => {
        let ms = item.market.match(/(.*)(BTC|ETH|BARK|USDT|AE|ATN|EOS|CYL|CDCC|STO|SATO|SAT|USDS|LTC|XRP)$/)
        item.currencySymbol = ms[1]
        item.baseSymbol = ms[2]
        newDatas.push(item)
      })
      return newDatas.filter((item) => {
        if (this.hideOtherTrust && this.symbol !== item.market) {
          return false
        } else {
          return true
        }
      })
    },
    nhdatas () {
      let newDatas = []
      this.hdatas.forEach((item) => {
        let ms = item.market.match(/(.*)(BTC|ETH|BARK|USDT|AE|ATN|EOS|CYL|CDCC|STO|SATO|SAT|USDS|LTC|XRP)$/)
        item.currencySymbol = ms && ms[1]
        item.baseSymbol = ms && ms[2]
        newDatas.push(item)
      })
      return newDatas.filter((item) => {
        if (this.hideOtherHistoryTrust && this.symbol !== item.market) {
          return false
        } else {
          let state = Number(item.state)
          if (this.hideHistoryTrustCanceled) {
            return state !== 0 || numUtils.BN(item.finishedAmount).gt(0)
          } else {
            return true
          }
        }
      })
    }
  },
  watch: {
    getApiToken () {
      this.changeLogin()
    },
    symbol () {
      this.changeLogin()
    },
    changeEntrustData (obj) {
      this.cdatas = obj.current
      this.hdatas = obj.history
    },
    cdatas () {
      this.setEntrustPrices(this.cdatas)
    },
    isShow () {
      this.$nextTick(() => {
        this.tiggerEvents({
          name: 'klineEvent',
          params: {type: 'resize', value: this.isShow}
        })
      })
    }
  },
  created () {
    this.$nextTick(() => {
      this.addEvents({
        name: 'extrustEvent',
        fun: this.extrustEvent
      })
    })
    this.changeLogin()
  },
  beforeDestroy () {
    this.removeEvents('extrustEvent')
  },
  methods: {
    ...mapActions(['setEntrustPrices', 'addEvents', 'removeEvents', 'tiggerEvents']),
    formatMarket (market) {
      let m = market.match(/(.*)(BTC|ETH|ATN|USDT)$/)
      if (m) {
        return m[1] + '/' + m[2]
      } else {
        return market
      }
    },
    extrustEvent (res) {
      if (res && res.type === 'current') {
        // 当前委托
        this.cdatas = res.data
      } else if (res && res.type === 'history') {
        // 历史委托
        this.hdatas = res.data
      }
    },
    switchTab (tab, isShow) {
      this.isShow = !isShow
      this.active = tab
    },
    getFinishedPercent (item) {
      return numUtils.div(item.finishedAmount, item.totalAmount).mul(100).toFixed(2)
    },
    changeLogin () {
      if (this.getApiToken) {
        // 根据symbol获取当前委托
        market.getCurrentEntrustBySymbol(0, this.symbol, (res) => {
          this.cdatas = res
        })
        // 历史成交
        market.getHistoryDeal(1, this.symbol, (res) => {
          this.hdatas = res
        })
      } else {
        this.cdatas = []
        this.hdatas = []
      }
    },
    getType (type) {
      if (numUtils.BN(type).equals(numUtils.BN(1))) {
        return this.$t('exchange.exchange_buys') // 买
      } else if (numUtils.BN(type).equals(numUtils.BN(2))) {
        return this.$t('exchange.exchange_sells') // 卖
      }
    },
    getPrice (price) {
      if (numUtils.BN(price).equals(numUtils.BN(-1))) {
        return this.$t('exchange.exchange_market_price') // 市价
      }
      return this.toFixed(price)
    },
    getStatue (item) {
      let state = Number(item.state)
      if (state === 0) {
        if (numUtils.BN(item.finishedAmount).gt(0)) {
          return this.$t('exchange.exchange_partial_transaction') // 部分成交
        }
        return this.$t('exchange.exchange_cancelled') // 已撤销
      } else if (state === 2) {
        return this.$t('exchange.exchange_partial_transaction') // 部分成交
      } else if (state === 3 || state === 4) {
        return this.$t('exchange.exchange_complete_transaction') // 完全成交
      } else {
        return '--'
      }
    },
    minus (v1, v2) {
      return numUtils.minus(v1, v2).toFixed(this.fixedNumber)
    },
    div (v1, v2) {
      return numUtils.div(v1, v2).toFixed(2)
    },
    cancelOrder (orderBookId, index) {
      if (this.cdatas.length === 0) {
        return
      }
      if (!this.getApiToken) {
        return
      }
      if (orderBookId === 'all') {
        MessageBox.confirm(this.$t('trade_record.trade_record_repeal')+'?').then(action => {
          market.cancelAll(() => {
            this.cdatas = []
            Tip({type: 'success', message: this.$t('account.user_center_Successful')}) // 操作成功
          }, (msg) => {
            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
          })
        }, (cacel) =>{})
      } else {
        market.cancelOrder(orderBookId, () => {
          this.cdatas.splice(index, 1)
          Tip({type: 'success', message: this.$t('account.user_center_Successful')})
        }, (msg) => {
          Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
        })
      }
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed, 1)
    }
  }
}
</script>

<style lang="less" scoped>
@c_gray:#F4F5FA;
@c_buy:#24C898;
@c_sell:#F65B69;
@c_light:#91A4A3;
@c_board:#B9D0CF;

.entrust-container {
    .navbar {
      display: flex;
      justify-content: space-between;
      height: 1rem;
      line-height: 1rem;
      color: @c_board;
      .navs span {
        margin-right: 0.3rem;
        &.active {
          font-size: 0.32rem;
          color: #536866;
        }
      }
    }
  }
  /deep/ .mint-tab-container {
    margin-left: -0.3rem;
    margin-right: -0.3rem;
  }
  .trust-list {
    li {
      padding: 0.25rem 0.3rem;
      border-top: 1px solid #DBE7E6;
      .title {
        position: relative;
        .buy {
          color: @c_buy;
        }
        .sell {
          color: @c_sell;
        }
        .time {
          color: @c_board;
          font-size: 0.24rem;
          transform: scale(0.916);
          margin-left: 0.1rem;
        }
        .cancel {
          position: absolute;
          right: 0;
          font-size: 0.26rem;
          color:#247BDE;
          background-color: @c_gray;
          padding: 0.06rem 0.12rem;
          border-radius: 3px;
        }
      }
      .data {
        margin-top: 0.2rem;
        .data-title {
          display: flex;
          span {
            flex: 1;
            min-width: 0;
            color: @c_board;
            font-size: 0.24rem;
            &:last-of-type {
              text-align: right;
            }
          }
        }
        .data-info {
          margin-top: 0.2rem;
          font-size: 0.3rem;
          display: flex;
          span {
            flex: 1;
            min-width: 0;
            &:last-of-type {
              text-align: right;
            }
            em {
              color: @c_board;
              font-size: 0.24rem;
              transform: scale(0.916);
              font-style: normal;
            }
          }
        }
      }
    }
  }

.hideOther {
  label {display: inline-block;}
  .checkbox {
    width: .28rem;
    height: .28rem;
    vertical-align: top;
    input {
      display: none;
      &:checked {
        + i {
          background-color: @c_buy;
          border-color:@c_buy;
          &::before {
            border-color: #fff;
          }
        }
      }
    }
    i {
      position: relative;
      display: block;
      width: .28rem;
      height: .28rem;
      border: 2px solid @c_board;
      border-radius: 2px;
      margin-top: 0.04rem;
      overflow: hidden;
      &::before {
        content: "";
        position: absolute;
        top: -0.05rem;
        left: 0.05rem;
        width: .12rem;
        height: .22rem;
        border-width: 0 2px 2px 0;
        border-style: solid;
        border-color: transparent;
        border-radius: 2px;
        transform: rotate(45deg);
      }
    }
  }
}
</style>
