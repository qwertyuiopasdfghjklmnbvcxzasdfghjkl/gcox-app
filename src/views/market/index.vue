<template>
  <div class="page">
    <top-back><i class="icon_wallet"></i></top-back>
    <div class="page-main">
      <div class="coin-container">
        <section class="coin_header">
          <ul>
            <li @click="sortMarket('dealAmount')">
              {{$t('exchange.exchange_Transaction_volume')}}<!--成交量-->
              <template v-if="sortActive==='dealAmount'">
                <i class="up" v-if="sort=='asc'"></i>
                <i class="down" v-if="sort=='desc'"></i>
              </template>
            </li>
            <li @click="sortMarket('lastPrice')">
              {{$t('exchange.exchange_price')}}<!--价格-->
              <template v-if="sortActive==='lastPrice'">
                <i class="up" v-if="sort=='asc'"></i>
                <i class="down" v-if="sort=='desc'"></i>
              </template>
            </li>
            <li @click="sortMarket('fall')">
              {{$t('market.change_24h')}}<!--24h涨跌-->
              <template v-if="sortActive==='fall'">
                <i class="up" v-if="sort=='asc'"></i>
                <i class="down" v-if="sort=='desc'"></i>
              </template>
            </li>
          </ul>
        </section>

        <section class="coin_content mt15">
          <ul class="item" v-for="(item, index) in sortMarketDatas" :key="index" @click="goToExchangePage(item)">
            <li>
              <span class="f36">{{item.currencySymbol}}</span><span class="ft-c-lightGray">/{{item.baseSymbol}}</span>
              <p class="ft-c-lightGray ellipsis mt10">24H {{toFixed(item.dealAmount, 2)}}</p>
            </li>
            <li>
              <p>{{toFixed(item.lastPrice, item.accuracy)|number}}</p>
              <p class="ft-c-lightGray mt15">≈<span><valuation :lastPrice="item.lastPrice" :baseSymbol="item.baseSymbol"/></span></p>
            </li>
            <li>
              <button class="c-button c-button-normal" :class="[percent(item).css]">{{percent(item).percent}}%</button>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { Indicator } from 'mint-ui'
import numUtils from '@/assets/js/numberUtils'
import marketApi from '@/api/market'
import valuation from '@/components/valuation'

export default {
  name: 'market-index',
  components: {
    valuation
  },
  data () {
    return {
      sortActive: null,
      sort: null,
      scroll: false,
      token:'USDS',
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getMarketList']),
    sortMarketDatas () {
      let datas = (this.getMarketList || []).sort((item1, item2) => {
        if (this.sortActive === 'dealAmount') {
          let m1 = numUtils.BN(item1.dealAmount)
          let m2 = numUtils.BN(item2.dealAmount)
          if (m1.equals(m2)) {
            return 0
          }
          return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
        } else if (this.sortActive === 'lastPrice') {
          let m1 = numUtils.BN(item1.lastPrice)
          let m2 = numUtils.BN(item2.lastPrice)
          if (m1.equals(m2)) {
            return 0
          }
          return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
        } else if (this.sortActive === 'fall') {
          let m1 = numUtils.BN(item1.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item1.change24h).div(item1.openingPrice)
          let m2 = numUtils.BN(item2.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item2.change24h).div(item2.openingPrice)
          if (m1.equals(m2)) {
            return 0
          }
          return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
        } else {
          let m1 = item1.currencySymbol
          let m2 = item2.currencySymbol
          return this.sort === 'desc' ? (m1 > m2 ? -1 : 1) : (m1 < m2 ? -1 : 1)
        }
      })
      return datas
    }
  },
  methods: {
    ...mapActions(['setLast24h']),
    sortMarket (active) {
      if (active === this.sortActive) {
        this.sort = this.sort === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortActive = active
        this.sort = 'asc'
      }
    },
    goToExchangePage (item) {
      marketApi.get24hPrice({symbol:`${item.currencySymbol}${item.baseSymbol}`},(data)=>{
        this.setLast24h(data)
        this.$router.push({name: 'exchange', params: {market: `${item.currencySymbol}_${item.baseSymbol}`}})
      })
    },
    percent (item) {
      if (numUtils.BN(item.openingPrice).equals(0)) {
        return {percent: '0.00'}
      } else if (item.openingPrice && item.lastPrice) {
        var percent = numUtils.BN(item.change24h).div(item.openingPrice).mul(100)
        if (percent.equals(0)) {
          return {percent: '0.00'}
        }
        return {
          css: percent.gt(0) ? 'c-button-green' : 'c-button-orange',
          percent: percent.toFixed(2)
        }
        return `<font color="${percent < 0 ? '#e76d42' : '#03c087'}">` + percent.toFixed(2) + '%</font>'
      } else {
        return {percent: '0.00'}
      }
    },
    toFixed (v1, fixed) {
      return numUtils.BN(v1).toFixed(fixed !== undefined ? fixed : 8)
    }
  }
}
</script>

<style lang="less" scoped>
.page-main {overflow-y: hidden;}
.coin-container {background-color: #fff; border-radius: 0.1rem; box-shadow: 0 0.02rem 0.1rem rgba(0,0,0,.1); padding: 0.35rem 0.3rem;}
.coin_header ul{display: flex;justify-content: space-between;}
.coin_header ul li{
  flex: 1; color: #999; margin-left: 0.3rem;
  &:first-of-type {
    margin-left: 0;
  }
  &:last-of-type {
    width: 1.4rem;
    flex: none;
  }
}
.coin_header ul li i.down{
  display: inline-block;width: 0.14rem;height: 0.17rem;margin-left: .1rem;
  background: url('../../assets/img/i_down.png') no-repeat center;background-size: contain;
}
.coin_header ul li i.up{
  display: inline-block;width: 0.14rem;height: 0.17rem;margin-left: .1rem;
  background: url('../../assets/img/i_up.png') no-repeat center;background-size: contain;
}

.coin_content {
  max-height: calc(~"100vh - 3.3rem");
  overflow-y:auto;
}
.coin_content .item{border-bottom: 1px solid #eee;}
.coin_content .item:last-of-type{border-bottom: none;}
.coin_content ul{
  padding:0.3rem 0; display: flex;justify-content: space-between;
}
.coin_content ul li{
  flex: 1; margin-left: 0.3rem;
  &:first-of-type {
    margin-left: 0;
  }
  &:last-of-type {
    width: 1.4rem;
    flex: none;
  }
}

.c-button-normal{display: inline-block;width: 1.4rem;}
.c-button{
  font-size: .32rem;appearance: none;border-radius:.06rem;border: 0;box-sizing: border-box;
  color: inherit;height: .64rem;outline: 0;overflow: hidden;position: relative;
  text-align: center;background:#dddddd;
}
.c-button-green{color: #fff;font-weight:bold;background:#24c08a;}
.c-button-orange{color: #fff;font-weight:bold;background:#f1595c;}
i.icon_wallet {
  width: 0.6rem;
  height: 0.6rem;
  margin-top: -0.05rem;
  background-size: auto 0.6rem;
  /*background-image: url('../../assets/img/icon_sc_b@3x.png');*/
  background-position: right center;
}

</style>
