<template>
  <div class="page">
    <top-back :dark="true">
      <div class="market-select" v-tap="{methods:toggleMarketList}"><i class="icon_select"></i><span class="ml25">{{symbol_display}}</span></div>
      <i slot="right" class="icon_favorite" :class="{active:curMarket && curMarket.collection}" v-tap="{methods:keep}"></i>
    </top-back>
    <div class="page-main">
      <div class="info mt20">
        <div>
          <p class="price f60" :class="{down:getLast24h.direction==2,up:getLast24h.direction==1}">{{toFixed(getLast24h.close)|number}}</p>
          <p class="fabi mt50 f30 ft-c-dark">≈ <valuation :lastPrice="Number(getLast24h.close)" :baseSymbol="baseSymbol"/> <span class="price ml25" :class="{down:Number(getLast24h.percent)<0,up:Number(getLast24h.percent)>0}">{{getLast24h.percent}}%</span></p>
        </div>
        <div>
          <p><span class="ft-c-dark">{{$t('market.high')}}</span><!--24h最高价--><span>{{toFixed(getLast24h.high)|number}}</span></p>
          <p class="mt25"><span class="ft-c-dark">{{$t('market.low')}}</span><!--24h最低价--><span>{{toFixed(getLast24h.bottom)|number}}</span></p>
          <p class="mt25"><span class="ft-c-dark">{{$t('market.volume_24h')}}</span><!--24h成交量--><span>{{toFixed(getLast24h.vol, 2)}} {{baseSymbol}}</span></p>
        </div>
      </div>
      <ul class="tabs">
        <li :class="{active:isKline}">
          <a v-tap="{methods:toggleDepth, type:true}">
            <img v-if="!isKline" src="../../assets/img/kline@3x.png"/>
            <img v-if="isKline" src="../../assets/img/kline-selected@3x.png"/>
            {{$t('market.kline')}}<!--K线图-->
          </a>
        </li>
        <li :class="{active:!isKline}">
          <a v-tap="{methods:toggleDepth, type:false}">
            <img v-if="isKline" src="../../assets/img/depth@3x.png"/>
            <img v-if="!isKline" src="../../assets/img/depth-selected@3x.png"/>
            {{$t('exchange.exchange_depth')}}<!--深度图-->
          </a>
        </li>
      </ul>
      <div class="acpanel">
        <button type="button" class="buy" v-tap="{methods:buyOrSell, t:true}">{{$t('exchange.exchange_buy')}}<!--买入--></button>
        <button type="button" class="sell" v-tap="{methods:buyOrSell, t:false}">{{$t('exchange.exchange_sell')}}<!--卖出--></button>
      </div>
      <div class="kline-panel">
        <div class="kline-panel-container" :class="{depth:!isKline}">
          <div class="kline-master">
            <div class="kine-select">
              <span v-tap="{methods:setPeriod, t:'1m'}" :class="{active:period=='1m'}">{{$t('exchange.exchange_time')}}<!--分时--></span>
              <span v-tap="{methods:setPeriod, t:'5m'}" :class="{active:period=='5m'}">5{{$t('exchange.exchange_min')}}<!--5分钟--></span>
              <span v-tap="{methods:setPeriod, t:'15m'}" :class="{active:period=='15m'}">15{{$t('exchange.exchange_min')}}<!--15分钟--></span>
              <span v-tap="{methods:setPeriod, t:'1h'}" :class="{active:period=='1h'}">1{{$t('exchange.exchange_hour')}}<!--1小时--></span>
              <span v-tap="{methods:setPeriod, t:'6h'}" :class="{active:period=='6h'}">6{{$t('exchange.exchange_hour')}}<!--6小时--></span>
              <span v-tap="{methods:setPeriod, t:'1d'}" :class="{active:period=='1d'}">1{{$t('exchange.exchange_day')}}<!--1天--></span>
              <span class="more" @click="isMore=!isMore">
                <transition enter-active-class="animated short fadeIn" leave-active-class="animated short fadeOut">
                  <ul class="choices" v-show="isMore">
                    <li v-tap="{methods:setIndice, t:'MACD'}" :class="{active:indice=='MACD'}">MACD</li>
                    <li v-tap="{methods:setIndice, t:'KDJ'}" :class="{active:indice=='KDJ'}">KDJ</li>
                    <li v-tap="{methods:setIndice, t:'StochRSI'}" :class="{active:indice=='StochRSI'}">StochRSI</li>
                  </ul>
                </transition>
              {{$t('exchange.advanced_more')}}<!--更多--></span>
            </div>
            <div class="kline-container" id="klineContainer"></div>
          </div>
          <div class="kline-container" id="depthContainer"></div>
        </div>
      </div>
      <div class="depth-list-container f24">
        <div class="header ft-c-dark">
          <p><span>{{$t('market.buy')}}</span><span>{{$t('market.amount')}}({{baseSymbol}})</span></p>
          <p><span class="text-center">{{$t('market.price')}}({{currentSymbol}})</span></p>
          <p><span>{{$t('market.amount')}}({{baseSymbol}})</span><span>{{$t('market.sell')}}</span></p>
        </div>
        <ul class="dept-list">
          <li v-for="(n,index) in depthChange.bids.length">
            <p><span>{{n}}</span><span>{{toFixed(depthChange.bids[index]&&depthChange.bids[index][1],accuracy.quantityAccu)|number}}</span></p>
            <p><span class="buy">{{toFixed(depthChange.bids[index]&&depthChange.bids[index][0])|number}}</span><span class="ml10 sell text-right">{{toFixed(depthChange.asks[index]&&depthChange.asks[index][0])|number}}</span></p>
            <p><span>{{toFixed(depthChange.asks[index]&&depthChange.asks[index][1],accuracy.quantityAccu)|number}}</span><span>{{n}}</span></p>
          </li>
        </ul>
      </div>
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
              <p><span class="f34">{{market.currencySymbol}}</span><span style="color: #687F9B;">/{{market.baseSymbol}}</span></p>
              <p class="price" :class="upOrDown(market)">{{toFixed(market.lastPrice, market.accuracy)|number}}</p>
            </li>
          </ul>
        </div>
      </transition>
    </mask-layer>
  </div>
</template>

<script>
import { MessageBox, Toast } from 'mint-ui'
import { mapGetters, mapActions } from 'vuex'
import KLineWebSocket from '@/assets/js/websocket'
import KLineChart from '@/assets/js/kline.draw'
import DepthChart from '@/assets/js/kline.depth'
import numUtils from '@/assets/js/numberUtils'
import valuation from '@/components/valuation'
import marketApi from '@/api/market'

let chartSettings = window.localStorage.getItem('chartSettings')
chartSettings && (chartSettings = JSON.parse(chartSettings))
export default {
  name: 'kline',
  components: {
    valuation
  },
  data () {
    return {
      filterTitle:'',
      asks: [],
      bids: [],
      loading: true,
      showMarkets: false,
      showMarketsSlide:false,
      kLineChart: null,
      depthChart: null,
      isMore: false,
      period: chartSettings ? chartSettings.charts.period : '1m', // 分时线时期
      indice: 'MACD', // 技术指标
      isKline: true, // 当前是否是K线图
      isFirstKline: true, // 是否第一次加载K线数据
      klineSocket: null,
      klineData: [], // k线数据
      depthData: {},
      business: {
        market: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getApiToken', 'getLast24h', 'getInitMarket', 'getMarketList']),
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
      if(this.curMarket){
        fixedNumber = Number(this.curMarket.accuracy)
        quantityAccu = Number(this.curMarket.quantityAccu)
        amountAccu = Number(this.curMarket.amountAccu)
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
      return this.business.market.split('_')[1]
    },
    currentSymbol () {
      return this.business.market.split('_')[0]
    },
    symbol () {
      return this.business.market.split('_').join('')
    },
    symbol_display () {
      return `${this.currentSymbol}/${this.baseSymbol}`
    },
    depthChange () {
      return {
        asks: this.filterAsks,
        bids: this.filterBids
      }
    },
    filterAsks () {
      let mergeDatas = []
      let temp = {}
      this.asks.forEach((item) => {
        let key = this.toFixed(item.price)
        let tempItem = temp[key]
        if (!tempItem) {
          temp[key] = {
            price: key,
            avaliableAmount: item.avaliableAmount
          }
          mergeDatas.push(temp[key])
        } else {
          tempItem.avaliableAmount = numUtils.add(tempItem.avaliableAmount, item.avaliableAmount).toString()
        }
      })
      let newDatas = []
      mergeDatas.forEach((item) => {
        newDatas.push([item.price, item.avaliableAmount])
      })
      newDatas.sort((item1, item2) => {
        return numUtils.BN(item1[0]).lt(numUtils.BN(item2[0])) ? -1 : 1
      })
      return newDatas
    },
    filterBids () {
      let mergeDatas = []
      let temp = {}
      this.bids.forEach((item) => {
        let key = this.toFixed(item.price)
        let tempItem = temp[key]
        if (!tempItem) {
          temp[key] = {
            price: key,
            avaliableAmount: item.avaliableAmount
          }
          mergeDatas.push(temp[key])
        } else {
          tempItem.avaliableAmount = numUtils.add(tempItem.avaliableAmount, item.avaliableAmount).toString()
        }
      })
      let newDatas = []
      mergeDatas.forEach((item) => {
        newDatas.push([item.price, item.avaliableAmount])
      })
      return newDatas
    }
  },
  watch: {
    'showMarkets'(_n){
      if(_n){
        setTimeout(()=>{
          this.showMarketsSlide = true
        },100)
      } else {
        this.showMarketsSlide = false
      }
    },
    '$route.params.market' () { //切换市场后重新初始化websoket
      this.business.market = this.$route.params.market
      this.klineSocket.close()
      this.loading = true
      this.isFirstKline = true
      this.InitKlineWebSoket()
    },
    klineData (n, o) { //如果K线数据有变化，更新K线图数据
      this.kLineChart.updateKlienDatas(JSON.parse(JSON.stringify(n)))
    },
    period (n, o) { //如果K线周期变化，重新请求周期数据
      this.loading = true
      this.isFirstKline = true
      this.kLineChart.switch_period(n)
      this.klineSocket.switchPeriod(n)
    },
    depthChange () {
      this.depthChart && this.depthChart.drawDepth(this.depthChange)
    }
  },
  created () {
    this.business.market = this.$route.params.market || this.getInitMarket
    this.InitKlineWebSoket()
    this.$nextTick(() => {
      this.initECharts()
    })
  },
  beforeDestroy () {
    this.klineSocket && this.klineSocket.close()
  },
  methods: {
    ...mapActions(['setLast24h', 'tiggerEvents', 'setMarketList']),
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
      this.$router.replace({name:'kline', params:{market: `${args.market.currencySymbol}_${args.market.baseSymbol}`}})
    },
    buyOrSell (args) {
      this.$router.push({name: 'exchange', params: {market: this.business.market, action: args.t}})
    },
    toggleDepth (args) {
      this.isKline = args.type
    },
    initECharts () {
      this.kLineChart = KLineChart({
        container: document.getElementById('klineContainer'),
        klineType: 'eosbtc',
        scale: 2,
        hideDepth: true,
        fixedNumber: this.accuracy.fixedNumber,
        ThemeColor: {
          Background: '#0d0d0d'
        }
      })
      this.kLineChart.switch_indic(this.indice)
      this.kLineChart.updateKlienDatas(JSON.parse(JSON.stringify(this.klineData)))
      // 深度图
      this.depthChart = DepthChart({
        isAmountShowLeft: true,
        container: document.getElementById('depthContainer')
      })
    },
    toggleQualification (args) {
      this.isMore = false
      this.qualification = args.type
    },
    InitKlineWebSoket () { // 初始化K线websoket
      this.klineSocket = KLineWebSocket({
        symbol: this.symbol,
        period: this.period,
        callback: (res) => {
          // K线图数据
          if (res.dataType === 'kline') { // K线图数据
            let klineDatas = JSON.parse(JSON.stringify(this.klineData))
            let datas = res.data && res.data.constructor === Array ? res.data : []
            let newArray = []
            datas.forEach((item) => {
              // newArray.push([Number(item[0]), parseFloat(item[1]) || 0, parseFloat(item[2]) || 0, parseFloat(item[3]) || 0, parseFloat(item[4]) || 0, parseFloat(item[5]) || 0])
              newArray.push([Number(item[0]), parseFloat(this.toFixed(Number(item[1]))) || 0, parseFloat(this.toFixed(Number(item[2]))) || 0, parseFloat(this.toFixed(Number(item[3]))) || 0, parseFloat(this.toFixed(Number(item[4]))) || 0, parseFloat(this.toFixed(Number(item[5]))) || 0])
            })
            if (!this.isFirstKline) {
              let tempObj = {}
              newArray.forEach((item) => {
                tempObj[String(item[0])] = item
              })
              for (let i = 0; i < klineDatas.length; i++) {
                let td = klineDatas[i]
                if (tempObj[String(td[0])]) {
                  klineDatas.splice(i, 1, tempObj[String(td[0])])
                  delete tempObj[String(td[0])]
                }
              }
              newArray.forEach((item) => {
                if (tempObj[String(item[0])]) {
                  klineDatas.push(item)
                }
              })
              this.klineData = klineDatas
            } else {
              this.isFirstKline = false
              this.klineData = newArray
            }

          } else if (res.dataType === 'LastOrderBook') {
            // 深度数据
            this.asks = res.data.asks
            this.bids = res.data.bids
          } else if (res.dataType === 'LastPrice') {
            // 24小时最新信息
            this.setLast24h(res.data)
          } else if (res.dataType === 'markets') {
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
            // 市场信息
            this.setMarketList(res.data)
          }
        },
        onClose: () => {
          this.isFirstKline = true
        }
      })
    },
    setPeriod (args) { //设置K线周期
      this.period = args.t
    },
    setIndice (args) { //设置技术指标
      this.isMore = false
      if (this.isKline) {
        this.kLineChart.switch_indic(args.t)
      }
      this.indice = args.t
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
.page {background-color: #172030;}
.page-main {padding-bottom: 1.25rem;}
.icon_favorite {
  width: 0.35rem;
  height: 0.35rem;
  background-image: url('../../assets/img/i_nc_light@2x.png');
  &.active {
    background-image: url('../../assets/img/i_sc@2x.png');
  }
}
.market-select {
  position: absolute;
  left: 0.9rem;
  height: 0.35rem;
  line-height: 0.35rem;
  top: 0.27rem;
  padding-left: 0.36rem;
  border-left: 1px solid #687E9A;
  .icon_select {
    width: 0.36rem;
    height: 0.32rem;
    background-image: url('../../assets/img/tc_meus@2x.png');
    vertical-align: top;
  }
}

.wallet-list-container {
  position: relative;
  width: 5.3rem;
  height: 100vh;
  color: #CED8E9;
  background-color: #0A1322;
  .search-input {
    font-size: 0.3rem;
    color: #CED8E9;
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
    background-color: #172030;
    margin-bottom: 1px;
    display: flex;
    justify-content: space-between;
  }
}
.price.up {color: #24c08a;}
.price.down{color: #f1595c;}
.info{display: flex;justify-content: space-between; color: #CED8E9; height: 1.75rem;}
.info > div:first-of-type {flex:3;min-width:0;}
.info > div:last-of-type {
  flex:2;min-width:0;
  p {display: flex; justify-content: space-between;}
}

.tabs{margin-left:-0.3rem; margin-right:-0.3rem; display:flex;height:1rem;background:#161f2f;align-items:center;
border-top: 0.01rem solid #42526a;
}
.tabs li{flex:1;text-align:center;font-size:0.34rem;height: 100%;line-height: 1rem;}
.tabs li:first-child{border-right: 0.01rem solid #42526a;}
.tabs li a{padding:0.2rem 0.4rem;color: #cbd4ec;}
.tabs li.active a{color:#4AC6C3;}
.tabs li img{width:0.31rem;height:0.28rem;vertical-align: middle;margin-right: 0.08rem;}

.acpanel{
  position: fixed;left: 0;right: 0;bottom: 0;padding: 0.2rem; z-index:3;
  background-color: #1E2C43;display: flex;justify-content:space-between;align-items:center;
}
.acpanel button{border: none;font-size: 0.34rem;color: #fff; flex: 1; border-radius: 2px;}
.acpanel button.buy,.acpanel button.sell{height: 0.8rem;background-color: #00cc99;}
.acpanel button.sell{background-color:#F65B69; margin-left: 0.2rem;}
.kline-panel{margin-left: -0.3rem; margin-right: -0.3rem;height: 6rem; overflow:hidden;}
.kline-panel-container{width:200%;height:100%;display:flex;transition:0.3s;margin-left:0px;}
.kline-panel-container.depth{margin-left:-100%;}
.kline-panel-container > div{display:flex;flex:1;flex-direction:column;}
.kline-container{
  width:100%;height:100%;
  border-top:1px solid #313c5a;
  background-color: transparent;position: relative;overflow:hidden;
}
.kine-select{
  height: 0.55rem;line-height: 0.55rem;position:relative;
  background-color: #0d0d0d;display: flex;justify-content:space-between;z-index: 3;
}
.kine-select span{padding: 0 0.15rem;color: #8089a3;font-size: 0.28rem;}
.kine-select span.active{color: #cbd4ec;}
.kine-select span.more:after{
  content: '';display: inline-block;border-top: 0.12rem  solid #8089A3;border-left: 0.10rem solid transparent;
  border-right: 0.10rem solid transparent;margin-left: 0.12rem;padding-bottom: 0.05rem;
}
.kine-select .choices{
  position: absolute;right: 0;top: 0.55rem;width: 1.8rem;box-shadow: 0 3px 6px #11131d;
}
.kine-select .choices li{
  line-height: 0.8rem;padding-left: 0.3rem;background-color: #1b1e2e;border-bottom: 1px solid #262a42;
}
.kine-select .choices li:last-of-type{border-bottom: none;}
.kine-select .choices li.active{background-color:#262a42;}

.depth-list-container {
  border-top: 1px solid #0A1322;
  background-color:#161f2f;
  margin-left: -0.3rem;
  margin-right: -0.3rem;
  padding-left: 0.3rem;
  padding-right: 0.3rem;
  .header {padding-top:0.25rem;}
  .header, .dept-list li {
    display: flex;
    justify-content: space-between;
    p {
      display: flex;
      span {min-width: 0;}
      &:first-of-type {
        width: 1.7rem;
        span:first-of-type {width: 0.6rem;}
        span:last-of-type {flex: 1; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;}
      }
      &:nth-of-type(2) {
        flex: 1;
        padding-left:0.1rem;
        padding-right:0.1rem;
        span{flex: 1; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;}
      }
      &:last-of-type {
        width: 1.7rem;
        text-align: right;
        span:first-of-type {flex: 1; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;}
        span:last-of-type {width: 0.6rem;}
      }
    }
  }
  .dept-list {
    color: #CED8E9;
    width: 100%;
    li {line-height: 0.5rem;}
    li p span {
      &.buy {color: #24C898;}
      &.sell {color: #F65B69;}
    }
  }
}
</style>
