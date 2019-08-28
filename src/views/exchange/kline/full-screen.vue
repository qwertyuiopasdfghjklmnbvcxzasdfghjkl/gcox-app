<template>
    <div class="cont">
        <div class="top">
            <span>{{symbol_display}}</span>
            <span class="time">{{time.format()}}</span>
            <router-link :to="{name: 'kline', params: {market: `${currentSymbol}_${baseSymbol}`}}"></router-link>
        </div>
        <div class="left">
            <div id="klineCont" class="kline"></div>
        </div>
        <div class="right">
            <ul>
                <li v-tap="{methods: setkline,t: 'CandleStick'}">CandleStick</li>
                <!--<li v-tap="{methods: setkline,t: 'CandleStickHLC'}">CandleStickHLC</li>-->
                <li v-tap="{methods: setkline,t: 'OHLC'}">OHLC</li>
                <li v-tap="{methods: setIndice,t: 'VOL'}">VOL</li>
                <li v-tap="{methods: setIndice,t: 'MACD'}">MACD</li>
                <li v-tap="{methods: setIndice,t: 'KDJ'}">KDJ</li>
                <li v-tap="{methods: setIndice,t: 'RSI'}">RSI</li>
            </ul>
        </div>
        <div class="foot">
            <ul>
                <li v-tap="{methods:setPeriod, t:'1m'}" :class="{active: period === '1m'}">{{$t('exchange.exchange_time')}}</li>
                <li v-tap="{methods:setPeriod, t:'1d'}" :class="{active: period === '1d'}">{{$t('exchange.exchange_1D')}}</li>
                <li v-tap="{methods:setPeriod, t:'1w'}" :class="{active: period === '1w'}">{{$t('exchange.exchange_1W')}}</li>
                <li :class="{active: period.indexOf('h')!== -1}">
                    <p>
                        <!--<span v-if="period=='1h'">1{{$t('exchange.exchange_hour')}}</span>-->
                        <span v-if="period=='2h'">2{{$t('exchange.exchange_hour')}}</span>
                        <span v-else-if="period=='4h'">4{{$t('exchange.exchange_hour')}}</span>
                        <span v-else-if="period=='6h'">6{{$t('exchange.exchange_hour')}}</span>
                        <span v-else-if="period=='12h'">12{{$t('exchange.exchange_hour')}}</span>
                        <span v-else>1{{$t('exchange.exchange_hour')}}</span>
                    </p>
                    <label>
                        <span v-tap="{methods:setPeriod, t:'1h'}" :class="{active:period=='1h'}">1{{$t('exchange.exchange_hour')}}
                            <!--1小时--></span>
                        <span v-tap="{methods:setPeriod, t:'2h'}" :class="{active:period=='2h'}">2{{$t('exchange.exchange_hour')}}
                            <!--2小时--></span>
                        <span v-tap="{methods:setPeriod, t:'4h'}" :class="{active:period=='4h'}">4{{$t('exchange.exchange_hour')}}
                            <!--4小时--></span>
                        <span v-tap="{methods:setPeriod, t:'6h'}" :class="{active:period=='6h'}">6{{$t('exchange.exchange_hour')}}
                            <!--6小时--></span>
                        <span v-tap="{methods:setPeriod, t:'12h'}" :class="{active:period=='12h'}">12{{$t('exchange.exchange_hour')}}
                            <!--12小时--></span>
                    </label>
                </li>
                <li  :class="{active: period.indexOf('m')!== -1}">
                    <p>
                        <!--<span v-if="period=='1m'">1{{$t('exchange.exchange_min')}}</span>-->
                        <span v-if="period=='5m'">5{{$t('exchange.exchange_min')}}</span>
                        <span v-else-if="period=='15m'">15{{$t('exchange.exchange_min')}}</span>
                        <span v-else-if="period=='30m'">30{{$t('exchange.exchange_min')}}</span>
                        <span v-else>1{{$t('exchange.exchange_min')}}</span>
                    </p>
                    <label>
                        <span v-tap="{methods:setPeriod, t:'1m'}" :class="{active:period=='1m'}">1{{$t('exchange.exchange_min')}}
                            <!--分时--></span>
                        <span v-tap="{methods:setPeriod, t:'5m'}" :class="{active:period=='5m'}">5{{$t('exchange.exchange_min')}}
                            <!--5分钟--></span>
                        <span v-tap="{methods:setPeriod, t:'15m'}" :class="{active:period=='15m'}">15{{$t('exchange.exchange_min')}}
                            <!--5分钟--></span>
                        <span v-tap="{methods:setPeriod, t:'30m'}" :class="{active:period=='30m'}">30{{$t('exchange.exchange_min')}}
                            <!--30分钟--></span>
                    </label>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import KLineWebSocket from '@/assets/js/websocket'
    import KLineChart from '@/assets/js/kline.draw'
    import numUtils from '@/assets/js/numberUtils'
    import marketApi from '@/api/market'

    let chartSettings = window.localStorage.getItem('chartSettings')
    chartSettings && (chartSettings = JSON.parse(chartSettings))
    export default {
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
                indice: 'vol', // 技术指标 MACD
                isKline: true, // 当前是否是K线图
                isFirstKline: true, // 是否第一次加载K线数据
                klineSocket: null,
                klineData: [], // k线数据
                depthData: {},
                symbolInfo: {},
                business: {
                    market: ''
                },
                time: new Date()
            }
        },
        computed: {
            ...mapGetters(['getApiToken', 'getLast24h', 'getInitMarket', 'getMarketList', 'getUserWallets']),
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
                this.klineSocket.close()
                this.loading = true
                this.isFirstKline = true
                this.showMarkets = false
                this.InitKlineWebSoket()
            },
            klineData(n, o) { //如果K线数据有变化，更新K线图数据
                this.kLineChart.updateKlienDatas(JSON.parse(JSON.stringify(n)))
            },
            period(n, o) { //如果K线周期变化，重新请求周期数据
                this.loading = true
                this.isFirstKline = true
                this.kLineChart.switch_period(n)
                this.klineSocket.switchPeriod(n)
            },
            depthChange() {
                this.depthChart && this.depthChart.drawDepth(this.depthChange)
            }
        },
        created() {
            screen.orientation.lock('landscape');
            this.business.market = this.$route.params.market || this.getInitMarket
            this.InitKlineWebSoket()
            this.$nextTick(() => {
                this.initECharts()
            })
            this.getSymbolInfo()
            console.log(this.getUserWallets)
            setInterval(()=>{this.time = new Date()},1000)
        },
        beforeDestroy(){
            screen.orientation.unlock();
        },
        methods: {
            ...mapActions(['setLast24h', 'tiggerEvents', 'setMarketList']),
            // select(){},
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
            setPeriod(args) { //设置K线周期
                this.period = args.t
                this.showSelect = false
            },
            initECharts() {
                this.kLineChart = KLineChart({
                    container: document.getElementById('klineCont'),
                    klineType: 'eosbtc',
                    scale: 2,
                    hideDepth: true,
                    fixedNumber: this.accuracy.fixedNumber,
                    Template:{displayVolume: false},
                    ThemeColor: {
                        Background: '#201f25',
                        Cursor: '#555963',
                    }
                })
                this.kLineChart.switch_indic(this.indice)
                this.kLineChart.updateKlienDatas(JSON.parse(JSON.stringify(this.klineData)))
            },
            InitKlineWebSoket() { // 初始化K线websoket
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
                        console.log(this.klineData)

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
            setIndice(args) { //设置技术指标
                this.isMore = false
                this.kLineChart.switch_indic(args.t)
            },
            setkline(val){
                this.$nextTick(() => {
                    this.kLineChart && this.kLineChart.switch_chartStyle(val.t)
                })
            },
            toFixed(value, fixed) {
                return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.accuracy.fixedNumber : fixed, 1)
            },
        }
    }
</script>

<style scoped lang="less">
    .cont {
        background: #141420;
        display: flex;
        width: 100vh;
        height: 100vw;
        top: calc((100vh - 100vw)/2);
        left: calc((100vw - 100vh)/2);
        flex-wrap: wrap;
        font-size: 0.28rem;
        position: absolute;
        transform: rotate(90deg);

        .top {
            background: #2a2e37;
            flex-shrink: 0;
            height: 0.8rem;
            width: 100vh;
            display: flex;
            align-items: center;
            padding: 0 0.2rem;
            justify-content: space-between;

            a {
                background: url("../../../assets/img/out-full.png") no-repeat center;
                width: 0.8rem;
                height: 0.8rem;
                display: inline-block;
                background-size: 0.4rem;
            }
            span{
                font-size: 0.32rem;
            }
            .time{
                font-size: 0.2rem;
                text-align: right;
                flex: 1;
                margin-right: 0.2rem;
            }
        }

        .left {
            width: calc(100vh - 1.6rem);
            height: calc(100vw - 1.6rem);
            position: relative;
            z-index: -1;
            .kline{
                width: 100%;
                height: 100%;
                background-color: transparent;
                position: relative;
                overflow: hidden;
            }
        }

        .right {
            width: 1.6rem;
            height: calc(100vw - 1.6rem);

            ul {
                display: flex;
                flex-flow: column;
                text-align: center;
                height: 100%;
                align-items: center;

                li {
                    flex: 1;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    max-height: 0.8rem;
                }
            }
        }

        .foot {
            background: #2a2e37;
            flex-shrink: 0;
            height: 0.8rem;
            width: 100vh;
            padding: 0 0.2rem;

            ul {
                display: flex;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: space-between;
                height: 0.8rem;

                li {
                    width: 1.8rem;
                    position: relative;
                    text-align: center;
                    height: 100%;
                    line-height: 0.8rem;

                    label {
                        position: absolute;
                        bottom: 0.8rem;
                        left: 0;
                        display: none;
                        flex-flow: column;
                        text-align: center;
                        z-index: 9;
                        width: 100%;
                        line-height: 0.8rem;
                        background: #2a2e37;
                    }

                    p {
                        background: url("../../../assets/img/tc_meus_b@2x.png") no-repeat 1.4rem center;
                        background-size: 0.2rem;
                    }
                    &.active{
                        border-bottom: 0.02rem solid #00A0E9;
                    }
                    &:hover{
                        label{
                            display: flex;
                        }
                    }
                }
            }
        }
    }
    /*@media (min-width: 320px)and (max-width: 414px){*/
        /*.cont{*/
            /*transform: rotate(90deg);*/
            /*width: 100vh;*/
            /*height: 100vw;*/
        /*}*/
    /*}*/
</style>
