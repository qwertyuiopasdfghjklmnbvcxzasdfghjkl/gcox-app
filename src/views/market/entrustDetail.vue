<template>
  <div class="page">
    <top-back > {{$t('trade_record.entrust_detail')}} </top-back>
    <div class="page-main">
      <div class="view">
        <p class="f30">
          <span v-if="item.direction===1" class="c_buy">{{$t('exchange.exchange_buys')}}</span><span class="c_sell" v-else>{{$t('exchange.exchange_sells')}}</span>
          <strong class="ml20">{{item.currencySymbol}}/{{item.baseSymbol}}</strong>
        </p>
        <div class="mt25 items">
          <p>
            <span>{{$t('exchange.exchange_Transaction_amount')}}<!--成交金额-->({{item.currencySymbol}})</span>
            {{Number(toFixed(item.dealCurrency))}}
          </p>
          <p>
            <span>{{$t('exchange.exchange_Transaction_price')}}<!--成交均价-->({{item.baseSymbol}}) </span>
            {{Number(getPrice(item.price))}}
          </p>
          <p>
            <span>{{$t('exchange.exchange_Transaction_volume')}}<!--成交量-->({{item.currencySymbol}})</span>
            {{Number(toFixed(item.finishedAmount))}}<em>({{getFinishedPercent(item)}}%)</em>
          </p>
          <p>
            <span>{{$t('exchange.advanced_fee')}}<!--手续费--></span>
            
          </p>
        </div>
      </div>
      <!-- <ul class="detail">
        <li><span>{{$t('exchange.exchange_date')}}</span><span>{{new Date(Number(item.createdAt)).format()}}</span></li>
        <li><span>{{$t('exchange.exchange_Transaction_price')}}</span><span>{{getPrice(item.averagePrice)}} <template v-if="item.direction===1">{{item.fromSymbol}}</template><template v-else>{{item.toSymbol}}</template></span></li>
        <li><span>{{$t('exchange.exchange_Transaction_volume')}}</span><span>{{toFixed(item.finishedAmount)}} <template v-if="item.direction===1">{{item.toSymbol}}</template><template v-else>{{item.fromSymbol}}</template></span></li>
        <li><span>{{$t('exchange.exchange_Transaction_amount')}}</span><span>{{toFixed(item.dealCurrency)}} {{item.direction === 1 ? item.fromSymbol : item.toSymbol}}</span></li>
        <li><span>{{$t('exchange.advanced_fee')}}</span><span v-html="fee(item)"></span></li>
      </ul> -->
    </div>
  </div>
</template>

<script>
import numUtils from '@/assets/js/numberUtils'
import market from '@/api/market'
export default {
  name: 'entrust-detail',
  data(){
    return {
      item:{},
      fixedNumber: 8,
      symbolDeduction:''
    }
  },
  created(){
    this.item = this.$route.params || {}
    this.getrateSysparams()
    console.log(this.item)
  },
  methods:{
    getrateSysparams () {
      market.rateSysparams((res) => {
        res.forEach((item) => {
          if (item.code === 'symbolDeduction') {
            this.symbolDeduction = item.value
          }
        })
      })
    },
    getFinishedPercent (item) {
      return numUtils.div(item.finishedAmount, item.totalAmount).mul(100).toFixed(2)
    },
    fee(item){
      if(Number(item.deductionFee)){
        return `${this.toFixed(item.fee)} ${item.toSymbol}<br />${this.toFixed(item.deductionFee)} ${this.symbolDeduction}`
      } else {
        return `${this.toFixed(item.fee)} ${item.toSymbol}`
      }
    },
    getPrice (price) {
      if (numUtils.BN(price).equals(numUtils.BN(-1))) {
        return this.$t('exchange.exchange_market_price') // 市价
      }
      return this.toFixed(price)
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed)
    }
  }
}
</script>

<style lang="less" scoped>
.c_buy {color: #24C898;}
.c_sell {color: #F65B69;}
.c_light {color: #91A4A3;}

.page-main {padding-left: 0; padding-right: 0;}
.view {
  padding: 0.4rem 0.3rem;
  background-color: #fff;
  .items {
    display: flex;
    flex-wrap: wrap;
    p {
      width: 33.33%; margin-top: 0.25rem;
      span {display: block; color: #91A4A3; font-size: 0.24rem; padding-bottom: 0.2rem;}
      em {font-size: 0.24rem; transform: scale(0.916); color: #91A4A3;}
      &:nth-of-type(3n) {
        text-align: right;
      }
    }
  }
}
.detail {padding: 0.5rem; margin-top: 0.3rem;}
.detail li{
  text-align: right;
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-size: 0.28rem;
  line-height: 0.6rem;
}
</style>
