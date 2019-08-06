<template>
  <font>{{getCoinSign}}{{curPrice}}</font>
</template>

<script>
import { mapGetters } from 'vuex'
import numUtils from '@/assets/js/numberUtils'
export default {
  props: ['lastPrice', 'baseSymbol'],
  computed: {
    ...mapGetters(['getCoinSign', 'getUSDCNY', 'getUsdRate', 'getBtcValues', 'getLang']),
    curPrice () {
      let lastPrice = this.lastPrice
      if (lastPrice && this.getUSDCNY) {

        let curMarketBtc = this.getBtcValues[this.baseSymbol]
        if (!curMarketBtc && this.baseSymbol !== 'BTC') {
          return '--'
        }
        let curMarketPrice = curMarketBtc ? numUtils.mul(curMarketBtc, this.getUSDCNY).toFixed(6) : this.getUSDCNY
        return numUtils.mul(lastPrice, curMarketPrice).toFixed(6).toMoney()
      } else {
        return '0.000000'
      }
    }
  }
}
</script>
<style>
  font{
    display: inline-block;
    height: 0.32rem;
  }
</style>
