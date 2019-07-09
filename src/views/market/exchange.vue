<template>
  <div class="page">
    <top-back>
      <div class="market-select" v-tap="{methods:toggleMarketList}"><i class="icon_select"></i><span class="ml25">{{symbol_display}}</span></div>
      <span slot="right">
        <router-link :to="{name: 'kline', params: {market: `${currentSymbol}_${baseSymbol}`}}" tag="i" class="icon_kline"></router-link>
        <i class="icon_favorite" :class="{active:curMarket && curMarket.collection}" v-tap="{methods:keep}"></i>
      </span>
    </top-back>
    <div class="page-main">
      <section class="exchange-container">
        <business :pTradeType="tradeType" :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :accuracy="accuracy"></business>
        <div class="right">
          <depth v-model="showLatestDeal" :baseSymbol="baseSymbol" :currentSymbol="currentSymbol" v-show="!showLatestDeal" :accuracy="accuracy"></depth>
        </div>
      </section>
      <div class="assets mt20">
        <div class="items header f24">
          <span>{{$t('wallet.value_available')}}</span>
          <span>{{$t('wallet.value_frozen')}}</span>
          <span>{{$t('wallet.value_total')}}</span>
        </div>
        <div class="items mt15">
          <span>{{wallet.availableBalance|number}}</span>
          <span>{{wallet.frozenBalance|number}}</span>
          <span>{{wallet.totalBalance|number}}</span>
        </div>
      </div>
      <entrust :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :symbol="symbol" class="mt20"></entrust>
    </div>
    <mask-layer :show="showMarkets" @hide="hideMarketList" :isgray="true">
      <transition enter-active-class="animated short slideInLeft">
        <div class="wallet-list-container" v-show="showMarketsSlide">
          <p class="pt60 f40 box">{{$t('market.filterToken')}}</p>
          <div class="mt55 box">
            <input type="search" class="search-input" v-model="filterTitle" :placeholder="$t('public0.search')"/>
          </div>
          <ul class="wallet-list mt20">
            <li class="box" v-for="market in filterMarketList" v-tap="{methods:changeMarket, market:market}">
              <p><span class="f34">{{market.currencySymbol}}</span><span style="color: #91A4A3;">/{{market.baseSymbol}}</span></p>
              <p class="price" :class="upOrDown(market)">{{toFixed(market.lastPrice, market.accuracy)|number}}</p>
            </li>
          </ul>
        </div>
      </transition>
    </mask-layer>
    
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MessageBox, Toast } from 'mint-ui'
import DataWebSocket from '@/assets/js/websocket'
import numUtils from '@/assets/js/numberUtils'
import business from '@/views/market/market/business'
import entrust from '@/views/market/market/entrust'
import depth from '@/views/market/market/depth'
import cpSwitch from '@/components/switch'
import marketApi from '@/api/market'
export default {
  name: 'exchange',
  components: {
    business,
    entrust,
    depth,
    cpSwitch
  },
  data () {
    return {
      filterTitle:'',
      showMarkets: false,
      showMarketsSlide:false,
      showLatestDeal: false,
      dataSocket: null,
      tradeType: 'buy',
      business: {
        market: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getMarketList', 'getUserWallets']),
    filterMarketList(){
      if(this.getMarketList){
        return this.getMarketList.filter(item=>{
          return `${item.currencySymbol}${item.baseSymbol}`.toLowerCase().includes(this.filterTitle.toLowerCase())
        })
      } else {
        return []
      }
    },
    accuracy(){
      let fixedNumber = 8, quantityAccu = 4, amountAccu = 8
      for(let item of this.getMarketList || []){
        if(item.market === this.symbol){
          fixedNumber = Number(item.accuracy)
          quantityAccu = Number(item.quantityAccu)
          amountAccu = Number(item.amountAccu)
          break
        }
      }
      return {fixedNumber:fixedNumber, quantityAccu:quantityAccu, amountAccu:amountAccu}
    },
    curMarket () {
      if (!this.getMarketList) {
        return false
      }
      let markets = this.getMarketList
      for (let i = 0; i < markets.length; i++) {
        if (this.symbol === markets[i].market) {
          return markets[i]
        }
      }
      return false
    },
    baseSymbol () {
      let symbol = this.$route.params.market
      if (symbol) {
        symbol = symbol.split('_')[1]
        return symbol ? symbol : 'BTC'
      } else {
        return 'BTC'
      }
    },
    currentSymbol () {
      let symbol = this.$route.params.market
      if (symbol) {
        symbol = symbol.split('_')[0]
        return symbol ? symbol : 'ETH'
      } else {
        return 'ETH'
      }
    },
    symbol () {
      return `${this.currentSymbol}${this.baseSymbol}`
    },
    symbol_display () {
      return `${this.currentSymbol}/${this.baseSymbol}`
    },
    wallet(){
      for (let i = 0; i < this.getUserWallets.length; i++) {
        let item = this.getUserWallets[i]
        if (item.symbol === this.currentSymbol) {
          return item
        }
      }
      return {}
    },
  },
  watch: {
    showMarkets(_n){
      if(_n){
        setTimeout(()=>{
          this.showMarketsSlide = true
        },100)
      } else {
        this.showMarketsSlide = false
      }
    },
    symbol () {
      this.dataSocket && this.dataSocket.switchSymbol(this.symbol)
    }
  },
  created () {
    this.tradeType = this.$route.params.action !== false ? 'buy' : 'sell'
    this.InitDataSoket()
  },
  beforeDestroy () {
    this.dataSocket && this.dataSocket.close()
  },
  methods: {
    ...mapActions(['setLast24h', 'tiggerEvents','setMarketList']),
    upOrDown (item) {
      if (numUtils.BN(item.openingPrice).equals(0)) {
        return ''
      } else if (item.openingPrice && item.lastPrice) {
        var percent = numUtils.BN(item.change24h).div(item.openingPrice).mul(100)
        if (percent.equals(0)) {
          return ''
        }
        return percent.gt(0) ? 'up' : 'down'
      } else {
        return ''
      }
    },
    toggleMarketList (args) {
      this.showMarkets = !this.showMarkets
    },
    hideMarketList () {
      this.showMarkets = false
      this.filterTitle = ''
    },
    changeMarket (args) {
      this.showMarkets = false
      this.$router.replace({name: 'exchange', params: {market: `${args.market.currencySymbol}_${args.market.baseSymbol}`}})
    },
    InitDataSoket () { //初始化数据websoket
      this.dataSocket = DataWebSocket({
        symbol: this.symbol,
        period: '1m',
        subscribe: ['depth','msg','last_price','new_transaction','user_new_orderbook','user_history_orderbook'],
        callback: (res) => {
          if (res.symbol && res.symbol !== this.symbol) {
            console.log(`市场数据不匹配...`)
            return
          }
          if (res.dataType === 'LastOrderBook') {
            // 深度数据
            let data = res.data
            this.tiggerEvents({
              name: 'depthEvent',
              params: {
                type: 'updateDatas',
                asks: data.asks || [],
                bids: data.bids || []
              }
            })
          } else if (res.dataType === 'LastPrice') {
            // 24小时最新信息
            this.setLast24h(res.data)
          } else if (res.dataType === 'LastAccounts') {
            // 用户账户余额
            let temp = {}
            res.data.forEach((item) => {
              temp[item.accountName] = item
            })
            this.getUserWallets.forEach((item) => {
              let d = temp[item.accountName]
              if (d) {
                item.availableBalance = d.availableBalance
                item.frozenBalance = numUtils.add(d.frozenBalance, d.adFrozenBalance).add(d.loanBalance).toFixed(8)
                item.totalBalance = d.totalBalance
              }
            })
          } else if (res.dataType === 'LastUserOrderBook') {
            // 当前委托
            this.tiggerEvents({
              name: 'extrustEvent',
              params: {
                type: 'current',
                data: res.data
              }
            })
          } else if (res.dataType === 'LastHistoryBook') {
            // 历史委托
            this.tiggerEvents({
              name: 'extrustEvent',
              params: {
                type: 'history',
                data: res.data
              }
            })
          } else if (res.dataType === 'LastTrades') {
            // 最新交易记录
            this.tiggerEvents({
              name: 'lastdealEvent',
              params: {
                type: 'updateData',
                data: res.data
              }
            })
          } else if (res.dataType === 'markets') {
            // 市场信息
            if (this.getMarketList) {
              let datas = this.getMarketList
              let tempObj = {}
              datas.forEach((item) => {
                tempObj[item.market] = item
              })
              res.data.forEach((item) => {
                let d = tempObj[item.market]
                if (d) {
                  item.collection = d.collection
                  item.iconBase64 = d.iconBase64
                  item.iconUrl = d.iconUrl
                }
              })
            }
            this.setMarketList(res.data)
          }
        }
      })
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.accuracy.fixedNumber : fixed, 1)
    },
    keep () {
      let data = this.curMarket
      if (this.getApiToken) {
        if (data.collection) { // 取消
          marketApi.removeCollection({
            market: data.market
          }, (res) => {
            data.collection = !data.collection
          })
        } else {
          marketApi.addCollection({ // 收藏
            market: data.market
          }, (res) => {
            data.collection = !data.collection
          })
        }
      } else {
        MessageBox.confirm(`${this.$t('public0.not_logged')}, ${this.$t('public0.goLogin')}`,{
            title:this.$t('public0.tip'),
            confirmButtonText: this.$t('public0.ok'),
            cancelButtonText: this.$t('public0.no')
          }).then(state=>{
          this.$router.push({path:'/login'})
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.icon_favorite {
  margin-left: 0.25rem;
  width: 0.35rem;
  height: 0.35rem;
  background-image: url('../../assets/img/star_c@2x.png');
  &.active {
    background-image: url('../../assets/img/star_b@2x.png');
  }
}
.icon_kline {
  width: 0.35rem;
  height: 0.35rem;
  background-image: url('../../assets/img/sxq_a@2x.png');
}
.market-select {
  position: absolute;
  left: 0.9rem;
  height: 0.35rem;
  line-height: 0.35rem;
  top: 0.27rem;
  padding-left: 0.36rem;
  border-left: 1px solid #91A4A3;
  .icon_select {
    width: 0.36rem;
    height: 0.32rem;
    background-image: url('../../assets/img/tc_meus_b@2x.png');
    vertical-align: top;
  }
}

.wallet-list-container {
  position: relative;
  width: 5.3rem;
  height: 100vh;
  color: #0B2725;
  background-color: #F7F7F7;
  .search-input {
    font-size: 0.3rem;
    color: #888;
    width: 100%;
    height: 0.54rem;
    line-height: 0.54rem;
    padding-left:0.47rem;
    border:none;
    background: url('../../assets/img/i_search@2x.png') transparent no-repeat left center;
    background-size: 0.27rem auto;
  }
}
.wallet-list {
  max-height: calc(~'100vh - 2.36rem');
  overflow-y: auto;
  li {
    line-height: 0.8rem;
    background-color: #fff;
    margin-bottom: 1px;
    display: flex;
    justify-content: space-between;
  }
}
.price.up {color: #24C898;}
.price.down{color: #F65B69;}

.exchange-container, .entrust-container {
  background-color: #fff;
  margin-left: -0.3rem;
  margin-right: -0.3rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  position: relative;
}
.exchange-container {padding-top: 0.2rem; display: flex;}
.exchange-container .right{
  flex:1; margin-left:0.3rem; position: relative; text-overflow: hidden;
}
.assets {
  margin-left: -0.3rem;
  margin-right: -0.3rem;
  padding:0.3rem;
  background-color:#fff;
  .items {
    display: flex;
    justify-content: space-between;
    &.header {color: #999;}
  }
}
</style>
