<template>
    <div class="page">
        <top-back :back="false">
            {{$t('nav.market')}}
            <span slot="right" class="right">
                <router-link to="/market/search">
                    <img src="../../assets/img/i_search@2x.png">
                </router-link>
            </span>
        </top-back>

        <div class="box one">
            <div class="inner">
                <section class="coin_tab">
                    <ul>
                        <li :class="{'activation':index===null}"
                            v-tap="{methods: tab, id:{i:null,symbol:null}}">
                            <span>{{$t('home.home_favorites')}}<!--自选--></span>
                        </li>
                        <li v-for="(item, i) in baseSymbol"
                            :class="{'activation':i === index}"
                            v-tap="{methods: tab, id:{i:i,symbol:item}}"><span>{{item}}</span></li>
                    </ul>
                </section>
                <section class="coin_header">
                    <ul>
                        <li @click="sortMarket('dealAmount')">
                            {{$t('home.home05')}}/{{$t('exchange.exchange_Transaction_volume')}}<!--成交量-->
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
                            {{$t('home.home06')}}<!--24h涨跌-->
                            <template v-if="sortActive==='fall'">
                                <i class="up" v-if="sort=='asc'"></i>
                                <i class="down" v-if="sort=='desc'"></i>
                            </template>
                        </li>
                    </ul>
                </section>
            </div>
        </div>

        <!---->

        <div id="scroll">
            <div class="box box-wrap">
                <div class="inner">
                    <section class="coin_content">
                        <div class="">
                            <div class="inner">
                                <ul class="item" v-for="(item, index) in marketsList" :key="index"
                                    @click="goToExchangePage(item)">
                                    <!--<li>-->
                                    <!--<img :src="item.iconBase64?`data:image/png;base64,`+item.iconBase64:item.iconUrl"/>-->
                                    <!--</li>-->
                                    <li>
                                        <h1><span>{{item.currencySymbol}}</span>/<i>{{item.baseSymbol}}</i></h1>
                                        <h2>24h{{$t('home.home04')}} {{toFixed(item.dealAmount, 2)}}</h2>
                                    </li>
                                    <li>
                                        <h1>{{toFixed(item.lastPrice, item.accuracy)}}</h1>
                                        <!--<h2>≈<span><valuation :lastPrice="item.lastPrice"-->
                                        <!--:baseSymbol="item.baseSymbol"/></span></h2>-->
                                    </li>
                                    <li>
                                                <span class="c-button c-button-normal" :class="[percent(item).css]">
                                                    {{percent(item).percent}}%
                                                </span>
                                    </li>
                                </ul>
                                <div class="lastspace"></div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {mapGetters, mapActions} from 'vuex'
    import {TabContainer, TabContainerItem, Indicator} from 'mint-ui'
    import numUtils from '@/assets/js/numberUtils'
    import marketApi from '@/api/market'
    import valuation from '@/components/valuation'

    Vue.component(TabContainer.name, TabContainer)
    Vue.component(TabContainerItem.name, TabContainerItem)
    export default {
        name: 'page-iconindex',
        components: {
            valuation
        },
        data() {
            return {
                sortActive: null,
                sort: null,
                scroll: false,
                markets: [],
                index: null,
                baseSymbol: [],
                symbol: null,
                marketsList: []
            }
        },
        computed: {
            ...mapGetters(['getApiToken', 'getMarketList']),
            sortMarketDatas() {
                let datas = this.markets.sort((item1, item2) => {
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
        watch: {
            sortMarketDatas(){
                this.tab({id:{i:this.index,symbol:this.symbol}})
            }
        },
        created() {
            this.getMarkets()
        },
        methods: {
            ...mapActions(['setLast24h']),
            sortMarket(active) {
                if (active === this.sortActive) {
                    this.sort = this.sort === 'asc' ? 'desc' : 'asc'
                } else {
                    this.sortActive = active
                    this.sort = 'asc'
                }
            },
            getMarkets() { // 获取市场
                marketApi.marketList((res) => {
                    console.log(res)
                    res.filter(data => {
                        if (this.baseSymbol.indexOf(data.baseSymbol) === -1) {
                            this.baseSymbol.push(data.baseSymbol)
                        }
                    })
                    this.markets = res
                }, () => {
                })
            },
            tab(data) {
                this.index = data.id.i
                this.symbol = data.id.symbol
                this.marketsList = []
                if(this.index === null){
                    this.sortMarketDatas.filter(res=>{
                        if(res.collection){
                            this.marketsList.push(res)
                        }
                    })
                }else{
                    this.sortMarketDatas.filter(res=>{
                        if(this.symbol === res.baseSymbol){
                            this.marketsList.push(res)
                        }
                    })
                }
                console.log(this.marketsList)
            },
            goToExchangePage(item) {
                marketApi.get24hPrice({symbol: `${item.currencySymbol}${item.baseSymbol}`}, (data) => {
                    this.setLast24h(data)
                    this.$router.push({name: 'exchange', params: {market: `${item.currencySymbol}_${item.baseSymbol}`}})
                })
            },
            percent(item) {
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
                } else {
                    return {percent: '0.00'}
                }
            },
            toFixed(v1, fixed) {
                return numUtils.BN(v1).toFixed(fixed !== undefined ? fixed : 8)
            }
        }
    }
</script>

<style lang="less" scoped>
    @write: #ffffff;
    @write-20: #cbd4ec;
    @write-374: #ffffff;
    @write-8e9: #A7ACB9;
    .right {
        img {
            width: 0.34rem;
        }
    }

    .mint-tab-container {
        /*position: absolute;*/
        /*top: 2.2rem;*/
        /*left: 0;*/
        /*right: 0;*/
        /*bottom: 0*/
    }

    .mint-tab-container /deep/ .mint-tab-container-wrap {
        height: 100%;
    }

    .mint-tab-container /deep/ .mint-tab-container-item {
        overflow: auto;
        padding-bottom: 0.2rem;
    }

    .lastspace {
        height: 0.4rem;
        width: 100%;
    }

    #scroll {
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .c-button-normal {
        color: #279C61;
    }

    .c-button {
        font-size: .34rem;
        display: block;
        text-align: right;
    }

    .c-button-green {
        color: #279C61;
    }

    .c-button-orange {
        color: #E14B26;
    }

    .box {
        font-size: .3rem;
        padding: 0;
    }

    .box > .inner {
        color: #C8C7CC;
    }

    .coin_tab {
        overflow-y: hidden;
    }

    .coin_tab ul {
        display: flex;
        justify-content: space-between;
        border-bottom: .01rem solid #40403E;
        padding: 0 0.3rem;
        overflow-x: auto;
    }

    .coin_tab ul li {
        position: relative;
        bottom: 0rem;
        line-height: .75rem;
        height: .75rem;
        white-space: nowrap;
        margin-right: 0.1rem;
    }

    .coin_tab ul li.activation {
        color: #ffffff;
    }

    .coin_tab ul li.activation::after {
        content: "";
        position: absolute;
        display: flex;
        width: calc(~"100% - 0.08rem");
        height: 0.01rem;
        background: #00A0E9;
        left: 0.04rem;
        bottom: 0rem;
    }

    .coin_tab ul li span {
        padding: 0.04rem 0.08rem;
    }

    .coin_tab ul li.activation span {
        /*background: #FFF;*/
    }

    .coin_header {
        /*background: linear-gradient(to bottom, #f2f1f7, #fff);*/
    }

    .coin_header ul {
        display: flex;
        justify-content: space-between;
        border-bottom: .01rem solid #40403E;
        padding: 0 0.3rem;
    }

    .coin_header ul li {
        font-size: .24rem;
        width: 1.8rem;
        line-height: .72rem;
        height: .72rem;
        color: @write-8e9;
        flex-shrink: 0;
    }

    .coin_header ul li:first-child {
        width: 2.9rem
    }

    .coin_header ul li:nth-child(2) {
        width: 2.4rem;
    }

    .coin_header ul li:last-child {
        text-align: right;
        flex-shrink: 1;
        width: 1.6rem;
    }

    .coin_header ul li i.down {
        display: inline-block;
        width: 0.12rem;
        height: 0.3rem;
        margin-left: .1rem;
        background: url('../../assets/img/i_down.png') no-repeat center;
        background-size: contain;
        vertical-align: sub;
    }

    .coin_header ul li i.up {
        display: inline-block;
        width: 0.12rem;
        height: 0.3rem;
        margin-left: .1rem;
        background: url('../../assets/img/i_up.png') no-repeat center;
        background-size: contain;
        vertical-align: sub;
    }

    .coin_header ul li:nth-child(3) {
        text-align: right;
    }

    .one {
        /*background-color: #fff;*/
        /*height: 1.4rem;*/
    }

    .coin_content {
        font-size: .24rem;
    }

    .coin_content .item {
        border-bottom: .01rem solid #40403E;
    }

    .coin_content .item:first-child {

    }

    .coin_content ul {
        padding: .16rem .3rem;
        /*background-color: #fff;*/
        display: flex;
        justify-content: space-between;
        // box-shadow: 0px 3px 30px 0px rgba(14, 14, 14, 0.35);
    }

    .coin_content ul li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 0.82rem;
    }

    .coin_content ul li img {
        height: .4rem;
        display: inline-block;
        width: .4rem;
        left: 0.3rem;
        border-radius: 50%;
        overflow: hidden;
    }

    .coin_content ul li:nth-child(1) {
        /*padding-left: .2rem;*/
        width: 2.9rem;
        color: @write-8e9;
        flex-shrink: 0;

        h1 span {
            font-size: .34rem;
            color: @write-374;
        }

        h1 i {
            font-style: normal;
            font-size: .24rem;
            color: @write-8e9;
        }

        h2 {
            font-size: .24rem;
            color: @write-8e9;
            margin-top: 0.1rem;
        }
    }

    .coin_content ul li:nth-child(2) {
        width: 2.8rem;
        display: flex;
        flex-shrink: 0;
        overflow: hidden;

        h1 {
            font-size: .34rem;
            color: @write-374;
            width: 100%;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        h2 {
            font-size: .24rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            display: block;
            color: @write-8e9;
        }
    }

    .coin_content ul li:nth-child(3) {
        width: 1.2rem;
    }
</style>
