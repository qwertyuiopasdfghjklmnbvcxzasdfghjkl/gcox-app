<template>
    <div class="left">
        <div class="acBtns">
            <button type="button" class="buy" :class="{active:isBuy}" @click="switchTradeType('buy')">{{$t('exchange.exchange_buy')}}<!--买入--></button>
            <button type="button" class="sell" :class="{active:!isBuy}" @click="switchTradeType('sell')">{{$t('exchange.exchange_sell')}}<!--卖出--></button>
        </div>
        <div class="trust-type-choice">
            <span @click="toggleChoice">{{$t(entrustType=='market'?'exchange.exchange_market':'exchange.exchange_limit')}}</span>
            <transition enter-active-class="animated short fadeIn" leave-active-class="animated short fadeOut">
                <ul class="choices" v-show="isTrustChioce">
                    <li @click="toggleChoice('limit')" :class="{active:entrustType==='limit'}">{{$t('exchange.exchange_limit')}}<!--限价委托--></li>
                    <li @click="toggleChoice('market')" :class="{active:entrustType==='market'}">{{$t('exchange.exchange_market')}}<!--市价委托--></li>
                </ul>
            </transition>
        </div>
        <cp-adjust v-model="formData.price" v-if="!isMarket" :accuracy="accuracy.fixedNumber" class="mt30"></cp-adjust>
        <p class="price-placeholder mt30" v-if="isMarket">{{$t('exchange.exchange_market_price')}}</p>
        <p class="c_light mt15">
          ≈ <valuation :lastPrice="formData.price" :baseSymbol="baseSymbol"/>
        </p>
        <div class="amount mt30">
          <numberbox v-model="formData.amount" :accuracy="accuracy.quantityAccu" :placeholder="$t('exchange.exchange_amount')" v-focus></numberbox>
          <span>{{isBuy ? baseSymbol : currentSymbol}}</span>
        </div>
        <p class="blance-tip">{{$t('exchange.exchange_balance')}}：<!--余额--> {{Number(toFixed(isBuy ? toBalance.availableBalance : fromBalance.availableBalance)).toString().toMoney()}}</p>
        <div class="range-percent mt30">
            <p>{{percent}}%</p>
            <mt-range v-model="percent" :bar-height="2">
                <div slot="start" class="dots d1" :class="{d2:percent>=25,d3:percent>=50,d4:percent>=75,d5:percent>=100}">
                    <span @click="percent=0"></span>
                    <span @click="percent=25"></span>
                    <span @click="percent=50"></span>
                    <span @click="percent=75"></span>
                    <span @click="percent=100"></span>
                </div>
            </mt-range>
        </div>
        <div class="space-area"></div>
        <div class="ac-area">
            <div class="total-input" v-if="!isMarket">
                <span class="c_light">{{$t('exchange.exchange_total')}}<!--金额--></span>
                <span>{{toFixed(formData.total, accuracy.amountAccu)|number}} {{baseSymbol}}</span>
            </div>
            <button type="button" class="mt20" :class="[isBuy ? 'buyBtn' : 'sellBtn', lockExtrust ? 'disabled' : '']" @click="buyOrSell">
                {{$t(isBuy?'exchange.exchange_buy':'exchange.exchange_sell')}} {{currentSymbol}}
            </button>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MessageBox } from 'mint-ui'
import regUtils from '@/assets/js/regex'
import utils from '@/assets/js/utils'
import numUtils from '@/assets/js/numberUtils'
import marketApi from '@/api/market'
import cpAdjust from '@/components/adjust'
import numberbox from '@/components/numberInput'
import valuation from '@/components/valuation'
export default {
  props: {
    accuracy: {
      type:Object
    },
    currentSymbol: {
      type: String,
      default: ''
    },
    baseSymbol: {
      type: String,
      default: ''
    },
    pTradeType: null
  },
  components: {
    cpAdjust,
    valuation,
    numberbox
  },
  data () {
    return {
      tradeType: 'buy',
      entrustType: 'limit',
      lockExtrust: false,
      changeInput: '',
      errorObj: {},
      percent: 0,
      updateValue: true,
      isTrustChioce: false,
      formData: {
        price: 0,
        amount: '',
        total: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getMarketConfig', 'getLast24h', 'getEntrustNewPrice', 'getUserWallets']),
    symbol () {
      return `${this.currentSymbol}${this.baseSymbol}`
    },
    isBuy () {
      return this.tradeType === 'buy'
    },
    isMarket () {
      return this.entrustType === 'market'
    },
    fromBalance () {
      for (let i = 0; i < this.getUserWallets.length; i++) {
        let item = this.getUserWallets[i]
        if (item.symbol === this.currentSymbol) {
          return item
        }
      }
      return {}
    },
    toBalance () {
      for (let i = 0; i < this.getUserWallets.length; i++) {
        let item = this.getUserWallets[i]
        if (item.symbol === this.baseSymbol) {
          return item
        }
      }
      return {}
    },
    marketPrice () {
      return this.$t('exchange.exchange_market_price') // 市价
    }
  },
  watch: {
    entrustType () {
      this.percent = 0
      this.formData.amount = ''
    },
    tradeType () {
      this.formData.amount = ''
    },
    'formData.price' (newVal, oldVal) {
      this.changeValue(newVal, oldVal, 'price')
    },
    'formData.amount' (newVal, oldVal) {
      this.changeValue(newVal, oldVal, 'amount')
    },
    'formData.total' (newVal, oldVal) {
      this.changeValue(newVal, oldVal, 'total')
    },
    getLast24h (newVal) {
      if (this.updateValue) {
        this.updateValue = false
        setTimeout(()=>{
          this.formData.price = this.toFixed(utils.removeEndZero(this.getLast24h.close))
        },200)
      }
    },
    symbol () {
      this.updateValue = true
    },
    percent (newVal) {
      this.switchPercent(newVal)
    },
    getEntrustNewPrice () {
      this.formData.price = this.toFixed(this.getEntrustNewPrice)
    }
  },
  created () {
    this.tradeType = this.pTradeType ? this.pTradeType : 'buy'
    this.$nextTick(() => {
      this.addEvents({
        name: 'businessEvent',
        fun: this.businessEvent
      })
    })
  },
  beforeDestroy () {
    this.removeEvents('businessEvent')
  },
  methods: {
    ...mapActions(['addEvents', 'removeEvents']),
    switchTradeType (type) {
        this.tradeType = type
        this.percent = 0
    },
    toggleChoice (e) {
        if (typeof e === 'string') {
            this.entrustType = e
        }
        this.isTrustChioce = !this.isTrustChioce
    },
    businessEvent (res) {
      if (res && res.type === 'price') {
        this.formData.price = res.value
      } else if (res && res.type === 'amount') {
        this.formData.amount = res.value
      } else if (res && res.type === 'total') {
        this.formData.total = res.value
      }
    },
    changeValue (newVal, oldVal, type) {
      if (numUtils.BN(newVal).equals(numUtils.BN(oldVal))) {
        this.changeInput = ''
        return
      }
      if (numUtils.BN(newVal).equals(numUtils.BN(0))) {
        if (this.changeInput) {
          return
        }
        this.changeInput = type
        if (type === 'amount' || type === 'price') {
          this.formData.total = ''
        }
        if (type === 'total' || type === 'price') {
          this.formData.amount = ''
        }
        this.$nextTick(() => {
          this.changeInput = ''
        })
        return
      }
      if (this.changeInput && this.changeInput !== type) {
        this.changeInput = ''
        return
      }
      this.changeInput = type
      if (type === 'total' && numUtils.BN(this.formData.price).gt(0)) {
        this.formData.amount = this.toFixed(numUtils.div(this.formData.total, this.formData.price))
      } else if (type === 'total' && numUtils.BN(this.formData.amount).gt(0)) {
        this.formData.price = this.toFixed(numUtils.div(this.formData.total, this.formData.amount))
      } else if (numUtils.BN(this.formData.price).gt(0) && numUtils.BN(this.formData.amount).gt(0)) {
        this.formData.total = this.toFixed(numUtils.mul(this.formData.price, this.formData.amount))
      } else if (numUtils.BN(this.formData.price).gt(0) && numUtils.BN(this.formData.total).gt(0)) {
        this.formData.amount = this.toFixed(numUtils.div(this.formData.total, this.formData.price))
      } else {
        this.changeInput = ''
      }
    },
    switchPercent (p) {
      p = p / 100
      let amount = numUtils.mul(this.tradeType === 'buy' ? this.toBalance.availableBalance : this.fromBalance.availableBalance, p).toFixed(this.fixedNumber)
      if (this.entrustType === 'market' && this.tradeType === 'buy') {
        this.formData.amount = Number(amount)?numUtils.div(amount, this.getLast24h.close).toFixed(this.fixedNumber, 1):''
        return
      }
      if (this.tradeType === 'buy') {
        this.formData.total = Number(amount)?amount:''
      } else {
        this.formData.amount = Number(amount)?amount:''
      }
    },
    buyOrSell () {
      this.errorObj = {}
      if (!this.getApiToken) {
        Tip({type: 'danger', message: this.$t(`exchange.exchange_Not_logged`)}) // 未登录
        return
      }
      let price = 0
      let msg = null
      let amount = this.formData.amount
      let balance = null
      let fromAccountId = null
      let toAccountId = null
      let direction = null// 1买 2卖
      if (this.entrustType === 'limit') { // 限价
        price = this.formData.price
        if (!price) {
          msg = this.$t('exchange.exchange_price_empty') // 价格不能为空
        } else if (numUtils.BN(price).equals(numUtils.BN(0))) {
          msg = this.$t('exchange.exchange_price_ont') // 价格不能为0
        } else if (!regUtils.intOrDecimal.test(price)) {
          msg = this.$t('exchange.exchange_price_decimal_int') // 价格只能为整数或小数
        }
        if (msg) {
          this.errorObj = {
            type: 'price',
            msg: msg
          }
          Tip({type: 'danger', message: msg})
          return
        }
      } else { // 市价
        price = -1
      }
      if (!amount) {
        msg = this.$t('exchange.exchange_number_empty') // 数量不能为空
      } else if (numUtils.BN(amount).equals(numUtils.BN(0))) {
        msg = this.$t('exchange.exchange_number_ont') // 数量不能为0
      } else if (!regUtils.intOrDecimal.test(amount)) {
        msg = this.$t('exchange.exchange_number_decimal_int') // 数量只能为整数或小数
      }
      if (msg) {
        this.errorObj = {
          type: 'amount',
          msg: msg
        }
        Tip({type: 'danger', message: msg})
        return
      }
      if (!this.getMarketConfig) {
        Tip({type: 'danger', message: `error_code.SYMBOL_INEXIST`})
        return
      }
      let minQuantity = numUtils.BN(this.getMarketConfig[this.symbol].minQuantity).toString()
      let minAmount = numUtils.BN(this.getMarketConfig[this.symbol].minAmount).toString()

      // 限价 最小金额控制
      if (this.entrustType === 'limit' && numUtils.BN(this.formData.total).lt(minAmount)) {
        // 最小金额必须大于等于{0}{1}
        Tip({type: 'danger', message: this.$t('public.min_total_greater_than').format(minAmount, this.baseSymbol)})
        return
      }

      // 限价\市价 最小数量控制
      // this.entrustType === 'market' &&
      if (numUtils.BN(this.formData.amount).lt(minQuantity)) {
        // 最小数量必须大于等于{0}{1}
        Tip({type: 'danger', message: this.$t('public.min_amount_greater_than').format(minQuantity, this.currentSymbol)})
        return
      }
      if (this.tradeType === 'buy') { // 买
        direction = 1 // 买
        balance = this.toBalance.availableBalance // 金额
        fromAccountId = this.toBalance.accountId // baseSymbol帐号id
        toAccountId = this.fromBalance.accountId // currentSymbol帐号id
        if (numUtils.BN(amount).mul(numUtils.BN((price === -1 ? this.getLast24h.close : price))).gt(numUtils.BN(balance)) || numUtils.BN(balance).isZero()) {
          Tip({type: 'danger', message: this.$t('exchange.exchange_Insufficient_balance')}) // 余额不足
          return
        }
      } else if (this.tradeType === 'sell') {
        direction = 2 // 卖
        balance = this.fromBalance.availableBalance // 金额
        fromAccountId = this.fromBalance.accountId // 帐号id
        toAccountId = this.toBalance.accountId // 帐号id
        if (numUtils.BN(amount).gt(numUtils.BN(balance)) || numUtils.BN(balance).isZero()) {
          Tip({type: 'danger', message: this.$t('exchange.exchange_Insufficient_balance')}) // 余额不足
          return
        }
      }
      let data = {
        price: price, // 表示价格‘-1’表示市价
        amount: amount, //
        fromAccountId: fromAccountId,
        toAccountId: toAccountId,
        market: this.symbol,
        // marketId: 2, // 市场id
        direction: direction // 1买 2卖
      }

      if (this.entrustType === 'limit' && this.tradeType === 'sell' && numUtils.BN(this.formData.price).lt(numUtils.mul(this.getLast24h.close, 0.95))) {
        // 您委托价格低于最新成交价5%，是否确认下单？
        MessageBox.confirm(this.$t('public.entrustment_price_lower_5')).then(() => {
          this.okCallback(data)
        }, () => {})
        return
      } else if (this.entrustType === 'limit' && this.tradeType === 'buy' && numUtils.BN(this.formData.price).gt(numUtils.mul(this.getLast24h.close, 1.05))) {
        // 您委托价格高于最新成交价5%，是否确认下单？
        MessageBox.confirm(this.$t('public.entrustment_price_higher_5')).then(() => {
          this.okCallback(data)
        }, () => {})
        return
      }
      this.okCallback(data)
    },
    okCallback (data) {
      if (this.lockExtrust) {
        return
      }
      this.lockExtrust = true
      marketApi.marketBuyorSell(data, (res) => {
        this.formData.amount = ''
        this.formData.total = ''
        this.lockExtrust = false
        Tip({type: 'success', message: this.$t('exchange.exchange_Commissioned_success')}) // 委托成功
      }, (msg) => {
        this.lockExtrust = false
        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
      })
    },
    changePriceValue (price) {
      if (this.entrustType === 'limit') {
        this.formData.price = this.toFixed(price)
      }
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.accuracy.fixedNumber : fixed, 1)
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
.c_light {color: @c_light;}
.left{width: 3.7rem;position: relative;display:flex;flex-direction:column;}
.left .acBtns{height: 0.75rem; display: flex;}
.left .acBtns button{
  flex: 1; height: 100%; font-size: 0.34rem;border: none;color: #91A4A3; background-color: @c_gray; border-radius:3px;
}
.left .acBtns button.sell {margin-left: 0.2rem;}
.left .acBtns button.buy.active{color:#fff;background:@c_buy;}
.left .acBtns button.sell.active{color:#fff;background:@c_sell;}
.left .trust-type-choice{margin-top:0.3rem;font-size: 0.3rem;position: relative; color: @c_light;}
.left .trust-type-choice > span:after{
  display: inline-block;content: '';margin-left: 0.15rem;border-top: 0.12rem  solid @c_light;
  border-left: 0.1rem solid transparent;border-right: 0.1rem solid transparent;  margin-bottom: 0.04rem;
}
.left .trust-type-choice .choices{
  position: absolute; top: 0.5rem;left: 0;width: 2.2rem;box-shadow: 0 1px 3px rgba(0,0,0,.2);
}
.left .trust-type-choice .choices li{
  line-height: 0.8rem; padding-left: 0.3rem;background-color: @c_gray;
}
.left .trust-type-choice .choices li:first-of-type{border-bottom: 1px solid @c_light;}
.left .trust-type-choice .choices li.active{background-color: @c_light; color:#fff; }
.left .price-placeholder {
  height: 0.8rem;background-color: @c_gray;
  line-height: 0.88rem;text-align: center;color: #91A4A3;font-size: 0.3rem;
}
.left .amount {
  border: 1px solid @c_board; height: 0.8rem; display: flex;
  input {border:none; background-color: transparent; padding-left: 0.2rem; padding-right: 0.2rem; width: 2.6rem; font-size: 0.3rem;}
  span {padding-right: 0.2rem; flex: 1; line-height: 0.8rem; text-align: right; color: @c_light;}
}
.left .blance-tip{color: @c_light;  margin-top: 0.15rem;}
.left .range-percent {position: relative; padding-bottom: 0.4rem;}
.left .range-percent p{
  text-align: center;color: @c_light; margin-bottom: 0.15rem;
}
.left .range-percent .dots{
  position: absolute;left: 0;right: 0;top: 10px;display: flex;justify-content:space-between;
}
.left .range-percent .dots span{
  z-index: 1;width: 10px;height: 10px;background-color: @c_board;border-radius: 100%;
}
.left .range-percent /deep/ .mt-range-runway{border-top-color: @c_board;}
.left .range-percent /deep/ .mt-range-thumb{border:3px solid #fff;background-color: @c_buy;z-index:2; top: 50%; transform: translateY(-50%);box-shadow: 0 1px 3px rgba(0,0,0,.2);}
.left .range-percent /deep/ .mt-range-progress{background-color:@c_buy;}
.left .range-percent .dots.d1 span:nth-of-type(1),
.left .range-percent .dots.d2 span:nth-of-type(2),
.left .range-percent .dots.d3 span:nth-of-type(3),
.left .range-percent .dots.d4 span:nth-of-type(4),
.left .range-percent .dots.d5 span:nth-of-type(5){background-color: @c_buy;}
.left .space-area{display:flex;flex:1;}
.left .ac-area{margin-bottom:0.3rem;}
.left .buyBtn,.left .sellBtn{width: 100%;height: 0.8rem;color: #fff;border: none;font-size: 0.34rem; border-radius:3px;}
.left .buyBtn{background:@c_buy;}
.left .sellBtn{background:@c_sell;}
.left .ac-area button.disabled{background-color: #999 !important;}
.left .total-input{display: flex; justify-content: space-between;}
</style>
