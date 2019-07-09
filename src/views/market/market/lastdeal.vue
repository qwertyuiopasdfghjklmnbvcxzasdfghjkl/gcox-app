<template>
    <div class="latest-deal">
        <div @click="switchLastDeal"><p>{{$t('exchange.exchange_trade_history')}}<!--最新成交--></p></div>
        <div class="header">
          <span>{{$t('exchange.exchange_number')}}：<!--编号--></span>
          <span>{{$t('exchange.exchange_price')}}<!--价格-->({{baseSymbol}})</span>
          <span>{{$t('exchange.exchange_amount')}}<!--数量-->({{currentSymbol}})</span>
        </div>
        <div>
            <ul class="deal-list">
                <li v-for="(item, index) in datas" :key="index" :class="{buy:item.direction==1}" @click="clickChangeValue(item)">
                    <span>{{index+1}}</span>
                    <span>{{toFixed(item.price)}}</span>
                    <span>{{toFixed(item.amount,accuracy.quantityAccu)}}</span>
                </li>
            </ul>
        </div>
        <div></div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import numUtils from '@/assets/js/numberUtils'
import market from '@/api/market'
export default {
  props: {
    value: null,
    accuracy: {
      type:Object
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
      type: String
    }
  },
  data () {
    return {
      showLoading: true,
      datas: []
    }
  },
  computed: {
    ...mapGetters(['getApiToken'])
  },
  watch: {
    getApiToken () {
      this.changeLogin()
    },
    symbol () {
      this.changeLogin()
    },
    datas () {
      if (this.datas.length) {
        this.tiggerEvents({
          name: 'depthEvent',
          params: {
            type: 'direction',
            value: this.datas[0].direction
          }
        })
      }
    }
  },
  created () {
    this.$nextTick(() => {
      this.addEvents({
        name: 'lastdealEvent',
        fun: this.lastdealEvent
      })
    })
    this.changeLogin()
  },
  beforeDestroy () {
    this.removeEvents('lastdealEvent')
  },
  methods: {
    ...mapActions(['setEntrustNewPrice', 'addEvents', 'removeEvents', 'tiggerEvents']),
    switchLastDeal () {
      this.$emit('input', !this.value)
    },
    lastdealEvent (res) {
      if (res && res.type === 'updateData') {
        this.datas = res.data
      }
    },
    clickChangeValue (item) {
      this.setEntrustNewPrice(item.price)
    },
    changeLogin () {
      this.showLoading = true
      // 最近交易记录
      market.getNearestTradeRecords(this.symbol, (res) => {
        this.showLoading = false
        this.datas = res
      }, (msg) => {
        console.log(msg)
        this.showLoading = false
      })
    },
    toFixed (price, fixed) {
      return numUtils.BN(price).toFixed(fixed || this.accuracy.fixedNumber)
    },
    formatDate (date) {
      return (new Date(Number(date))).format('HH:mm:ss')
    }
  }
}
</script>

<style lang="less" scoped>
.latest-deal{position: absolute;width: 100%;height: 100%;left: 0;top: 0;display: flex;flex-direction:column;}
.latest-deal .header{display:flex;}
.latest-deal .header>span{height:0.4rem;line-height:0.4rem;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;}
.latest-deal > div:nth-of-type(1){flex: 5;min-height: 0;position: relative;}
.latest-deal > div:nth-of-type(1) p{position: absolute;left: 0;right: 0;font-size: 0.28rem;}
.latest-deal > div:nth-of-type(1) p::after{
  content: '';position: absolute;right: 0;top: 0.1rem;border-top: 0.15rem  solid #fff;
  border-left: 0.13rem solid transparent;border-right: 0.13rem solid transparent;
}
.latest-deal > div:nth-of-type(2){flex: 4;min-height: 0;}
.latest-deal > div:nth-of-type(2) span{
  display: inline-block;width: 38%;color: #8089A3;font-size: 0.28rem;transform: scale(0.916);
}
.latest-deal > div:nth-of-type(2) span:first-of-type{width: 24%;}
.latest-deal > div:nth-of-type(2) span:last-of-type{text-align: right;}
.latest-deal > div:nth-of-type(3) {flex: 87;min-height: 0;}
.latest-deal > div:nth-of-type(4) {flex: 2;}
.latest-deal .deal-list{height: 100%;overflow-y: auto;}
.latest-deal .deal-list li{height:0.6rem;line-height: 0.6rem;}
.latest-deal .deal-list li span{
  display: inline-block;float:left;width: 38%;font-size: 0.28rem;transform: scale(0.916); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.latest-deal .deal-list li span:nth-of-type(1){width: 24%;color: #8089a3}
.latest-deal .deal-list li span:nth-of-type(2){color: #e76d42;}
.latest-deal .deal-list li span:nth-of-type(3) {text-align: right;}
.latest-deal .deal-list li.buy span:nth-of-type(2) {color: #00cc99;}
</style>
