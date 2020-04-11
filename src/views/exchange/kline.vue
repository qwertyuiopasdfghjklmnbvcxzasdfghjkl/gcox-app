<template>
    <div class="page">
        <top-back :backPage="'exchange'" :params="{market:this.business.market}">
            <div class="market-select" v-tap="{methods:toggleMarketList}">
                <span class="">{{symbol_display}}</span><i class="icon_select"></i>
            </div>
            <i slot="right" class="icon_favorite" :class="{active:curMarket && curMarket.collection}"
               v-tap="{methods:keep}"></i>
        </top-back>
        <div class="page-main">
            <div class="info mt20">
                <div>
                    <p class="f50">
                        {{toFixed(getLast24h.close) | number}}
                    </p>
                    <p class="fabi mt10 f30 price"
                       :class="{down:Number(getLast24h.percent)<0,up:Number(getLast24h.percent)>0}">
                        <span>{{toFixed(getLast24h.rfvol)}}</span>
                        <span class="ml25">{{getLast24h.percent}}%</span>
                    </p>
                    <p class="mt10">
                        <span class="">{{$t('market.volume_24h')}}{{$t('home.home04')}}</span><!--24h成交量-->
                        <span class="ml25">{{toFixed(getLast24h.vol, 2) | number}} {{baseSymbol}}</span>
                    </p>
                </div>
                <div>
                    <p class="mt10">
                        <span class="">{{$t('market.low')}}</span>
                        <!--24h最低价--><span>{{toFixed(getLast24h.bottom) | number}}</span>
                    </p>
                    <p class="mt10">
                        <span class="">{{$t('market.high')}}</span>
                        <!--24h最高价--><span>{{toFixed(getLast24h.high) | number}}</span>
                    </p>
                </div>
            </div>
            <ul class="tabs">
                <li :class="{active:isKline}">
                    <a v-tap="{methods:toggleDepth, type:true}">
                        {{$t('exchange.exchange_candlesticks')}}
                    </a>
                </li>
                <li :class="{active:!isKline}">
                    <a v-tap="{methods:toggleDepth, type:false}">
                        {{$t('exchange.exchange_depth')}}<!--深度图-->
                    </a>
                </li>
                <li class="full_screen">
                    <router-link :to="{name: 'full-screen',params:{market:business.market}}">
                        {{$t('exchange.advanced_full_screen')}} <span><img src="../../assets/img/full.png"/></span>
                    </router-link>
                </li>
            </ul>
            <div class="acpanel">
                <button type="button" class="buy" v-tap="{methods:buyOrSell, t:true}">{{$t('exchange.exchange_buy')}}
                    <!--买入--></button>
                <button type="button" class="sell" v-tap="{methods:buyOrSell, t:false}">{{$t('exchange.exchange_sell')}}
                    <!--卖出--></button>
            </div>
            <div class="kline-panel">
                <div class="kline-panel-container" :class="{depth:!isKline}">
                    <div class="kline-master">
                        <div class="kline-container">
                            <iframe ref="klineContainer" id="klineContainer" frameborder="0"
                                    height="100%" width="100%"
                                    scrolling="no" marginheight="0" marginwidth="0" src=""
                                    @load="iframeLoaded"></iframe>
                        </div>
                    </div>
                    <div class="kline-container" id="depthContainer"></div>
                </div>
                <loading v-show="loading" class="load"/>
            </div>
            <div class="depth-list-container f24">
                <div class="btn-cont">
                    <label v-tap="{methods:()=>{label = 1}}"
                           :class="{show:label === 1 }">{{$t('home.entrus-order')}}</label>
                    <label v-tap="{methods:()=>{label = 2}}" :class="{show:label === 2 }">{{$t('exchange.exchange_trade_history')}}</label>
                    <label v-tap="{methods:()=>{label = 3}}"
                           :class="{show:label === 3 }">{{$t('home.symbol-info')}}</label>
                </div>
                <div v-if="label === 1">
                    <div class="header ft-c-dark">
                        <p>
                            <span>{{$t('market.buy')}}</span>
                        </p>
                        <p>
                            <span>{{$t('market.sell')}}</span>
                        </p>
                    </div>
                    <ul class="dept-list">
                        <li v-for="(n,index) in depthChange.bids.length">
                            <p>
                                <span>{{toFixed(depthChange.bids[index]&&depthChange.bids[index][1],accuracy.quantityAccu)|number}}</span>
                            </p>
                            <p>
                                <span class="buy text-left">{{toFixed(depthChange.bids[index]&&depthChange.bids[index][0])|number}}</span>
                                <span class="ml10 sell ">{{toFixed(depthChange.asks[index]&&depthChange.asks[index][0])|number}}</span>
                            </p>
                            <p>
                                <span>{{toFixed(depthChange.asks[index]&&depthChange.asks[index][1],accuracy.quantityAccu)|number}}</span>
                            </p>
                        </li>
                    </ul>
                </div>
                <div v-if="label === 2" class="lastdeal">
                    <lastdeal :currentSymbol="currentSymbol"
                              :baseSymbol="baseSymbol"
                              :symbol="symbol"
                              :accuracy="accuracy"
                    ></lastdeal>
                </div>
                <div v-if="label === 3" class="symbol-cont">
                    <label>
                        <img>
                        <p>{{this.currentSymbol}}</p>
                    </label>
                    <p><span>{{$t('home.issue-time')}}</span><span>{{symbolInfo.issueTime || '--'}}</span></p>
                    <p>
                        <span>{{$t('home.issue-total')}}</span><span>{{toFixed(symbolInfo.totalIssuance, 2) || '--'}}</span>
                    </p>
                    <p><span>{{$t('home.circulate-total')}}</span><span>{{toFixed(symbolInfo.totalCirculation, 2) || '--'}}</span>
                    </p>
                    <!-- <p><span>{{$t('home.raise-price')}}</span><span>{{symbolInfo.issuePrice || '--'}}</span></p> -->
                    <p><span>{{$t('home.whitePaper')}}</span><span><a :href="symbolInfo.whitePaperUrl">
                        {{symbolInfo.whitePaperUrl || '--'}}</a></span>
                    </p>
                    <p><span>{{$t('home.web')}}</span><span>
                        <a :href="symbolInfo.officialWebsite">{{symbolInfo.officialWebsite || '--'}}</a>
                    </span></p>
                    <p><span>{{$t('home.block-puery')}}</span>
                        <span><a :href="symbolInfo.blockQueryUrl">{{symbolInfo.blockQueryUrl || '--'}}</a></span>
                    </p>
                    <!--<p><span>{{$t('home.intro')}}</span><span>&#45;&#45;</span></p>-->
                </div>
            </div>
        </div>
        <mask-layer :show="showMarkets" @hide="hideMarketList" :isgray="true">
            <transition enter-active-class="animated short slideInRight">
                <div class="wallet-list-container" v-show="showMarketsSlide">
                    <div class="title">
                        <span v-tap="{methods:toggleMarketList}"></span>
                        {{$t('home.select-market')}}
                    </div>
                    <market :form="'kline'"></market>
                </div>
            </transition>
        </mask-layer>
    </div>
</template>

<script>
    import {MessageBox, Toast} from 'mint-ui'
    import {mapGetters, mapActions} from 'vuex'
    import KLineWebSocket from '@/assets/js/websocket'
    import KLineChart from '@/assets/js/kline.draw'
    import DepthChart from '@/assets/js/kline.depth'
    import numUtils from '@/assets/js/numberUtils'
    import valuation from '@/components/valuation'
    import marketApi from '@/api/market'
    import market from '../market/index'
    import Lastdeal from "./market/lastdeal";
    import Loading from "../../components/common/loading";
    import config from '../../api/config'

    let chartSettings = window.localStorage.getItem('chartSettings')
    chartSettings && (chartSettings = JSON.parse(chartSettings))
    export default {
        name: 'kline',
        components: {
            Loading,
            Lastdeal,
            valuation,
            market
        },
        data() {
            return {
                filterTitle: '',
                asks: [],
                bids: [],
                loading: true,
                showMarkets: false,
                showMarketsSlide: false,
                kLineChart: null,
                depthChart: null,
                isMore: false,
                showSelect: false,
                select: 2,
                label: 1,
                period: chartSettings ? chartSettings.charts.period : '1m', // 分时线时期
                indice: '', // 技术指标 MACD
                isKline: true, // 当前是否是K线图
                isFirstKline: true, // 是否第一次加载K线数据
                klineSocket: null,
                klineData: [], // k线数据
                depthData: {},
                symbolInfo: {},
                business: {
                    market: ''
                },
                domain: config.domain,
                protocol: config.protocol,
                url: config.url,
            }
        },
        computed: {
            ...mapGetters(['getApiToken', 'getLast24h', 'getInitMarket', 'getMarketList', 'getUserWallets', 'getLang']),
            klineURL(){
                if(window['cordova']){
                    window.httpdURL = window.httpdURL?window.httpdURL:'https://m-exchange.gcox.com/kline/'
                }
                let _url = window.httpdURL?window.httpdURL:'/kline/'
                return `${_url}?symbol=${this.symbol}&domain=${this.domain}&protocol=${this.protocol}&url=${this.url}&lang=${this.getLang}`
            },
            filterMarketList() {
                if (this.getMarketList) {
                    return this.getMarketList.filter(item => {
                        return `${item.currencySymbol}${item.baseSymbol}`.toLowerCase().includes(this.filterTitle.toLowerCase())
                    })
                } else {
                    return []
                }
            },
            accuracy() {
                let fixedNumber = 8, quantityAccu = 4, amountAccu = 8
                if (this.curMarket) {
                    fixedNumber = Number(this.curMarket.accuracy)
                    quantityAccu = Number(this.curMarket.quantityAccu)
                    amountAccu = Number(this.curMarket.amountAccu)
                }
                return {fixedNumber: fixedNumber, quantityAccu: quantityAccu, amountAccu: amountAccu}
            },
            curMarket() {
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
            baseSymbol() {
                return this.business.market.split('_')[1]
            },
            currentSymbol() {
                return this.business.market.split('_')[0]
            },
            symbol() {
                return this.business.market.split('_').join('')
            },
            symbol_display() {
                return `${this.currentSymbol}/${this.baseSymbol}`
            },
            depthChange() {
                return {
                    asks: this.filterAsks,
                    bids: this.filterBids
                }
            },
            filterAsks() {
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
            filterBids() {
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
            'showMarkets'(_n) {
                if (_n) {
                    setTimeout(() => {
                        this.showMarketsSlide = true
                    }, 100)
                } else {
                    this.showMarketsSlide = false
                }
            },
            '$route.params.market'() { //切换市场后重新初始化websoket
                this.business.market = this.$route.params.market
                this.loading = true
                this.showMarkets = false
                this.InitKlineWebSoket()
                this.setIframe()
                this.setLast24h(0)
                marketApi.get24hPrice({symbol: `${this.symbol}`}, (data) => {
                    this.setLast24h(data)
                })
                localStorage.market = this.$route.params.market


            },
            depthChange() {
                this.depthChart && this.depthChart.drawDepth(this.depthChange)
            }
        },
        created() {
            this.business.market = this.$route.params.market || this.getInitMarket
            window.localStorage.market = this.business.market
            this.InitKlineWebSoket()
            this.$nextTick(() => {
                this.initECharts()
            })
            this.getSymbolInfo()
            console.log(this.getUserWallets)
        },
        mounted(){
            this.setIframe()
        },
        beforeDestroy() {
            this.klineSocket && this.klineSocket.close()
        },
        methods: {
            ...mapActions(['setLast24h', 'tiggerEvents', 'setMarketList']),
            iframeLoaded(){
                setTimeout(()=>{
                    this.loading = false
                },1000)
            },
            setIframe(){
                if(!this.loading){

                }
                this.$refs.klineContainer.src = this.klineURL
            },
            upOrDown(item) {
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
            getSymbolInfo() {
                marketApi.getSymbolIntroduce(this.currentSymbol, res => {
                    console.log(res)
                    this.symbolInfo = res
                })
            },
            toggleMarketList(args) {
                this.showMarkets = !this.showMarkets
            },
            hideMarketList() {
                this.showMarkets = false
                this.filterTitle = ''
            },
            changeMarket(args) {
                this.showMarkets = false
                this.$router.replace({
                    name: 'kline',
                    params: {market: `${args.market.currencySymbol}_${args.market.baseSymbol}`}
                })
            },
            buyOrSell(args) {
                this.$router.push({name: 'exchange', params: {market: this.business.market, action: args.t}})
            },
            toggleDepth(args) {
                this.isKline = args.type
                if (this.isKline) {
                    if (this.select === 1) {
                        this.select++
                    } else {
                        this.showSelect = !this.showSelect
                    }
                } else {
                    this.showSelect = false
                    this.select = 1
                }
            },
            initECharts() {
                // 深度图
                this.depthChart = DepthChart({
                    isAmountShowLeft: true,
                    container: document.getElementById('depthContainer')
                })
            },
            toggleQualification(args) {
                this.isMore = false
                this.qualification = args.type
            },
            InitKlineWebSoket() { // 初始化K线websoket
                this.klineSocket = KLineWebSocket({
                    symbol: this.symbol,
                    period: this.period,
                    subscribe: [ 'depth'],
                    callback: (res) => {
                        if (res.dataType === 'LastOrderBook') {
                            // 深度数据
                            this.asks = res.data.asks
                            this.bids = res.data.bids
                        }
                    },
                    onClose: () => {
                        this.isFirstKline = true
                    }
                })
            },
            setPeriod(args) { //设置K线周期
                this.period = args.t
                this.showSelect = false
            },
            setIndice(args) { //设置技术指标
                this.isMore = false
                if (this.isKline) {
                    this.kLineChart.switch_indic(args.t)
                }
                this.indice = args.t
            },
            toFixed(value, fixed) {
                return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.accuracy.fixedNumber : fixed, 1)
            },
            keep() {
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
                    MessageBox.confirm(`${this.$t('public0.not_logged')}, ${this.$t('public0.goLogin')}`, {
                        title: this.$t('public0.tip'),
                        confirmButtonText: this.$t('public0.ok'),
                        cancelButtonText: this.$t('public0.no')
                    }).then(state => {
                        this.$router.push({path: '/login'})
                    })
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .page {
        background-color: #2A2A34;
    }

    .page-main {
        padding-bottom: 1rem;
    }

    .icon_favorite {
        width: 0.35rem;
        height: 0.35rem;
        background-image: url('../../assets/img/i_nc_light@2x.png');

        &.active {
            background-image: url('../../assets/img/i_sc@2x.png');
        }
    }

    .market-select {
        /*position: absolute;*/
        /*left: 0.9rem;*/
        /*height: 0.35rem;*/
        /*line-height: 0.35rem;*/
        /*top: 0.27rem;*/
        /*padding-left: 0.36rem;*/
        /*border-left: 1px solid #687E9A;*/

        .icon_select {
            width: 0.36rem;
            height: 0.32rem;
            background: url('../../assets/img/tc_meus_b@2x.png') no-repeat 0.1rem 0.08rem;
            background-size: 0.24rem;
        }
    }

    .wallet-list-container {
        position: relative;
        width: 100vw;
        height: 100vh;

        .title {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 0.9rem;
            text-align: center;
            background: #32323c;
            z-index: 9;
            line-height: 0.9rem;
            font-size: 0.32rem;
            color: #ffffff;

            span {
                width: 0.8rem;
                height: 0.8rem;
                position: absolute;
                left: 0;
                top: 0.05rem;
                background: url("../../assets/img/icon_back_b_white@3x.png") no-repeat center;
                background-size: 0.4rem;
            }
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

    .price {
        color: #24C898;
    }

    .price.up {
        color: #24C898;
    }

    .price.down {
        color: #E14B26;
    }

    .info {
        display: flex;
        justify-content: space-between;
        color: #ffffff;
        height: 1.75rem;
    }

    .info > div:first-of-type {
        flex: 3;
        min-width: 0;
    }

    .info > div:last-of-type {
        min-width: 0;
        padding-top: 0.54rem;

        p {
            display: flex;
            justify-content: space-between;
            align-items: center;

            span:first-child {
                padding-right: 0.2rem;
                color: #A0A4B2;
            }
        }
    }

    .tabs {
        margin-left: -0.3rem;
        margin-right: -0.3rem;
        display: flex;
        height: 0.8rem;
        background: #25242A;
        align-items: center;
        padding: 0 0.3rem;
    }

    .tabs li {
        width: 2rem;
        text-align: center;
        font-size: 0.24rem;
        height: 100%;
        line-height: 0.8rem;
        position: relative;

        &.full_screen {
            flex: 1;
            text-align: right;

            a {
                padding: 0.08rem;
                font-size: 0.24rem;
                border: 0.02rem solid #43434E;

                span {
                    img {
                        width: 0.24rem;
                    }
                }
            }
        }
    }

    .tabs li:first-child {
    }

    .select {
        position: absolute;
        z-index: 99;
        width: 6.9rem;;
        background: rgba(54, 53, 62, 0.9);
        padding: 0.2rem;
        left: 0;
        top: 1rem;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        span {
            width: 20%;
            text-align: center;
            line-height: 0.6rem;
            font-size: 0.24rem;

            &.active {
                color: #00A0E9;
            }
        }

        &:after {
            content: '';
            display: block;
            position: absolute;
            border: 0.1rem solid rgba(54, 53, 62, 0.9);
            border-left-color: transparent;
            border-bottom-color: transparent;
            top: -0.1rem;
            left: 1rem;
            transform: rotate(-45deg);
        }
    }

    .tabs li a {
        padding: 0.2rem 0;
        color: #cbd4ec;
        text-align: center;
    }

    .tabs li.active {
        border-bottom: 0.04rem solid #00A0E9;
    }

    .tabs li.active a {
        color: #00A0E9;

    }

    .tabs li img {
        width: 0.2rem;
        vertical-align: middle;
        margin-left: 0.08rem;
    }

    .acpanel {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .acpanel button {
        border: none;
        font-size: 0.34rem;
        color: #fff;
        flex: 1;
    }

    .acpanel button.buy, .acpanel button.sell {
        height: 1rem;
        background-color: #439B64;
    }

    .acpanel button.sell {
        background-color: #E14B26;
    }

    .kline-panel {
        margin-left: -0.3rem;
        margin-right: -0.3rem;
        height: 6.3rem;
        overflow: hidden;
        position: relative;
    }

    .kline-panel-container {
        width: 200%;
        height: 100%;
        display: flex;
        transition: 0.3s;
        margin-left: 0px;
    }

    .kline-panel-container.depth {
        margin-left: -100%;
    }

    .kline-panel-container > div {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .kline-container {
        width: 100%;
        height: 100%;
        border-top: 1px solid #313c5a;
        background-color: transparent;
        position: relative;
        overflow: hidden;
    }

    .kine-select {
        height: 0.55rem;
        line-height: 0.55rem;
        position: relative;
        background-color: #0d0d0d;
        display: flex;
        justify-content: space-between;
        z-index: 3;
    }

    .kine-select span {
        padding: 0 0.15rem;
        color: #8089a3;
        font-size: 0.28rem;
    }

    .kine-select span.active {
        color: #cbd4ec;
    }

    .kine-select span.more:after {
        content: '';
        display: inline-block;
        border-top: 0.12rem solid #8089A3;
        border-left: 0.10rem solid transparent;
        border-right: 0.10rem solid transparent;
        margin-left: 0.12rem;
        padding-bottom: 0.05rem;
    }

    .kine-select .choices {
        position: absolute;
        right: 0;
        top: 0.55rem;
        width: 1.8rem;
        box-shadow: 0 3px 6px #11131d;
    }

    .kine-select .choices li {
        line-height: 0.8rem;
        padding-left: 0.3rem;
        background-color: #1b1e2e;
        border-bottom: 1px solid #262a42;
    }

    .kine-select .choices li:last-of-type {
        border-bottom: none;
    }

    .kine-select .choices li.active {
        background-color: #262a42;
    }

    .depth-list-container {
        background-color: #25242A;
        margin-left: -0.3rem;
        margin-right: -0.3rem;
        padding-left: 0.3rem;
        padding-right: 0.3rem;
        padding-bottom: 0.2rem;
        overflow: auto;

        .header {
            padding-bottom: 0.25rem;
            display: flex;
            border-bottom: 0.02rem solid #2A2A34;
            color: #A0A4B2;
            margin-bottom: 0.1rem;

            p {
                width: 50%;
            }
        }

        .dept-list li {
            display: flex;
            justify-content: space-between;

            p {
                display: flex;

                span {
                    min-width: 0;
                }

                &:first-of-type {
                    width: 1.7rem;

                    span:first-of-type {
                        width: 0.6rem;
                    }

                    span:last-of-type {
                        flex: 1;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }

                &:nth-of-type(2) {
                    flex: 1;
                    padding-left: 0.1rem;
                    padding-right: 0.1rem;

                    span {
                        flex: 1;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }

                &:last-of-type {
                    width: 1.7rem;
                    text-align: right;

                    span:first-of-type {
                        flex: 1;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }

                    span:last-of-type {
                        width: 0.6rem;
                    }
                }
            }
        }

        .dept-list {
            color: #CED8E9;
            width: 100%;

            li {
                line-height: 0.5rem;
            }

            li p span {
                &.buy {
                    color: #24C898;
                    text-align: right;
                }

                &.sell {
                    color: #E14B26;
                }
            }
        }
    }

    .btn-cont {
        display: flex;
        justify-content: space-between;
        margin: 0.3rem 0;

        label {
            width: 2.2rem;
            height: 0.64rem;
            text-align: center;
            line-height: 0.64rem;
            background: #43434E;

            &.show {
                color: #00A0E9;
                background: #2A2A34;
            }
        }
    }

    .lastdeal {
        margin: 0 -0.3rem;
    }

    .symbol-cont {
        label {
            display: flex;
            font-size: 0.3rem;
        }

        p {
            display: flex;
            line-height: 0.5rem;
            justify-content: space-between;
            align-items: center;

            span:first-child {
                color: #A0A4B2;
            }

            span:last-child {
                flex-grow: 1;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                text-align: right;
                padding-left: 0.2rem;
            }
        }
    }

    .load {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -0.3rem;
    }
</style>
