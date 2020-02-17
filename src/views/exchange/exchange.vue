<template>
    <div class="page">
        <top-back :back="false">
            <div class="market-select" v-tap="{methods:toggleMarketList}">
                <span class="market_title">{{symbol_display}}</span>
                <i class="icon_select"></i>
            </div>
            <span slot="right">
                <i class="icon_favorite" :class="{active:curMarket && curMarket.collection}" v-tap="{methods:keep}"></i>
        <router-link :to="{name: 'kline', params: {market: `${currentSymbol}_${baseSymbol}`}}" tag="i"
                     class="icon_kline"></router-link>

      </span>
        </top-back>
        <div class="top_checkt">
            <label v-tap="{methods:switchTradeType, name: 'buy'}" :class="{'active': tradeType === 'buy'}">{{$t('exchange.exchange_buy')}}</label>
            <label v-tap="{methods:switchTradeType, name: 'sell'}" :class="{'active': tradeType === 'sell'}">{{$t('exchange.exchange_sell')}}</label>
            <label v-tap="{methods: toNowDeal}">{{$t('trade_record.current_entrust')}}</label>
            <label v-tap="{methods: toHistoryDeal}">{{$t('trade_record.history_entrust')}}</label>
        </div>
        <div class="main">
            <section class="exchange-container">
                <business
                        :pTradeType="tradeType"
                        :tradeType="tradeType"
                        :currentSymbol="currentSymbol"
                        :baseSymbol="baseSymbol"
                        :accuracy="accuracy"></business>
                <div class="right">
                    <depth v-model="showLatestDeal" :baseSymbol="baseSymbol" :currentSymbol="currentSymbol"
                           v-show="!showLatestDeal" :accuracy="accuracy"></depth>
                </div>
            </section>
            <div class="assets mt30">
                <lastdeal :currentSymbol="currentSymbol"
                          :baseSymbol="baseSymbol"
                          :symbol="symbol"
                          :accuracy="accuracy"
                ></lastdeal>
            </div>
        </div>
        <mask-layer :show="showMarkets" @hide="hideMarketList" :isgray="true">
            <transition enter-active-class="animated short slideInRight">
                <div class="wallet-list-container" v-show="showMarketsSlide">

                    <div class="title">
                        <span v-tap="{methods:toggleMarketList}"></span>
                        {{$t('home.select-market')}}
                    </div>
                    <market :form="'exchange'"></market>

                </div>
            </transition>
        </mask-layer>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import {MessageBox, Toast} from 'mint-ui'
    import DataWebSocket from '@/assets/js/websocket'
    import numUtils from '@/assets/js/numberUtils'
    import business from '@/views/exchange/market/business'
    import depth from '@/views/exchange/market/depth'
    import cpSwitch from '@/components/switch'
    import marketApi from '@/api/market'
    import Lastdeal from "./market/lastdeal"
    import market from '../market/index'
    import Loading from "../../components/common/loading";
    import utils from '@/assets/js/utils'

    export default {
        name: 'exchange',
        components: {
            Loading,
            Lastdeal,
            business,
            depth,
            cpSwitch,
            market
        },
        data() {
            return {
                filterTitle: '',
                showMarkets: false,
                showMarketsSlide: false,
                showLatestDeal: false,
                dataSocket: null,
                tradeType: 'buy',
                business: {
                    market: ''
                },
                showDepu: false
            }
        },
        computed: {
            ...mapGetters(['getApiToken', 'getMarketList', 'getUserWallets']),
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
                for (let item of this.getMarketList || []) {
                    if (item.market === this.symbol) {
                        fixedNumber = Number(item.accuracy)
                        quantityAccu = Number(item.quantityAccu)
                        amountAccu = Number(item.amountAccu)
                        break
                    }
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
                let symbol = this.$route.params.market || localStorage.market
                if (symbol) {
                    symbol = symbol.split('_')[1]
                    return symbol ? symbol : 'BTC'
                } else {
                    return 'BTC'
                }
            },
            currentSymbol() {
                let symbol = this.$route.params.market || localStorage.market
                if (symbol) {
                    symbol = symbol.split('_')[0]
                    return symbol ? symbol : 'ETH'
                } else {
                    return 'ETH'
                }
            },
            symbol() {
                return `${this.currentSymbol}${this.baseSymbol}`
            },
            symbol_display() {
                return `${this.currentSymbol}/${this.baseSymbol}`
            },
            wallet() {
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
            showMarkets(_n) {
                if (_n) {
                    setTimeout(() => {
                        this.showMarketsSlide = true
                    }, 100)
                } else {
                    this.showMarketsSlide = false
                }
            },
            symbol() {
                this.dataSocket && this.dataSocket.switchSymbol(this.symbol)
            },
            '$route.params.market'(){
                this.showMarkets = false
                this.setLast24h(0)
                marketApi.get24hPrice({symbol: `${this.symbol}`}, (data) => {
                    this.setLast24h(data)
                })
                localStorage.market = this.$route.params.market
            }
        },
        created() {
            this.tradeType = this.$route.params.action !== false ? 'buy' : 'sell'
            this.InitDataSoket()
            if(this.$route.params.market){
                localStorage.market = this.$route.params.market
            }
        },
        beforeDestroy() {
            this.dataSocket && this.dataSocket.close()
        },
        methods: {
            ...mapActions(['setLast24h', 'tiggerEvents', 'setMarketList', 'setMarketConfig']),
            switchTradeType(active) {
                this.tradeType = active.name
                console.log(active)
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
                    name: 'exchange',
                    params: {market: `${args.market.currencySymbol}_${args.market.baseSymbol}`}
                })
            },
            InitDataSoket() { //初始化数据websoket
                this.dataSocket = DataWebSocket({
                    symbol: this.symbol,
                    period: '1m',
                    subscribe: ['depth', 'msg', 'last_price', 'new_transaction', 'user_new_orderbook', 'user_history_orderbook', 'market'],
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
                            let config = {}
                            res.data = res.data.filter(item=>{
                                config[item.market] = {
                                    minAmount: item.minAmount,
                                    minQuantity: item.minQuantity
                                }

                              if(window.marketVisible){
                                return window.marketVisible[item.market] === '1'
                              } else {
                                return true
                              }
                            })
                            this.setMarketList(res.data)

                            this.setMarketConfig(utils.isPlainEmpty(config) ? null : config)
                            console.log(config)
                        }
                    }
                })
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
            },
            toNowDeal() {
                this.$router.push({
                    name: 'now-deal',
                    params: {currentSymbol: this.currentSymbol, baseSymbol: this.baseSymbol, symbol: this.symbol}
                })
            },
            toHistoryDeal() {
                this.$router.push({
                    name: 'history-deal',
                    params: {currentSymbol: this.currentSymbol, baseSymbol: this.baseSymbol, symbol: this.symbol}
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .top_checkt {
        border-bottom: 0.02rem solid #40403E;
        height: 0.8rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding: 0 0.12rem;

        label {
            color: #C8C7CC;
            font-size: 0.3rem;
            padding: 0.06rem 0.18rem;
            border-bottom: 0.02rem solid transparent;
            margin-bottom: -0.02rem;

            &.active {
                border-bottom-color: #18BAF8;
            }
        }
    }

    .main {
        padding: 0 0.3rem;
        overflow-y: auto;
        height: calc(100vh - 2.7rem);
    }

    .icon_favorite {
        margin-right: 0.25rem;
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
        left: 0;
        height: 0.35rem;
        line-height: 0.35rem;
        top: 0.27rem;
        padding-left: 0.36rem;
        /*border-left: 1px solid #91A4A3;*/

        .icon_select {
            width: 0.24rem;
            height: 0.12rem;
            background-image: url('../../assets/img/tc_meus_b@2x.png');
            margin-left: 0.1rem;
        }

        .market_title {
            font-size: 0.4rem;
            line-height: 0.4rem;
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
            border-bottom: 0.02rem solid #40403E;
            display: flex;
            justify-content: space-between;
        }
    }

    .price.up {
        color: #24C898;
    }

    .price.down {
        color: #E14B26;
    }

    .exchange-container, .entrust-container {
        /*background-color: #fff;*/
        margin-left: -0.3rem;
        margin-right: -0.3rem;
        padding-left: 0.3rem;
        padding-right: 0.3rem;
        position: relative;
    }

    .exchange-container {
        padding-top: 0.2rem;
        display: flex;
    }

    .exchange-container .right {
        flex: 1;
        margin-left: 0.5rem;
        position: relative;
        text-overflow: hidden;
    }

    .assets {
        margin-left: -0.3rem;
        margin-right: -0.3rem;
        /*padding: 0.3rem;*/
        /*background-color: #fff;*/

        /*.items {*/
        /*display: flex;*/
        /*justify-content: space-between;*/

        /*&.header {*/
        /*color: #999;*/
        /*}*/
        /*}*/
    }
</style>
