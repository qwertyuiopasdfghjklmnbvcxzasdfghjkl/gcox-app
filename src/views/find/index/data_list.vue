<template>
    <div class="data_list">
        <div class="data_cont">
            <div class="data_content">
                <section class="data_header">
                    <ul>
                        <li v-tap="{methods:sortMarket, name: 'desc'}" :class="{'white': sort=='desc'}">
                            <template>
                                <i class="up" v-if="sort=='desc'">
                                    <img src="../../../assets/img/Gainers-w@3x.png">
                                </i>
                                <i class="down" v-else>
                                    <img src="../../../assets/img/Gainers-h@3x.png">
                                </i>
                            </template>
                            {{$t('home.home01')}}<!--涨幅榜-->
                        </li>
                        <li v-tap="{methods:sortMarket, name: 'asc'}" :class="{'white': sort=='asc'}">
                            <template>
                                <i class="down" v-if="sort=='asc'">
                                    <img src="../../../assets/img/Losers-w@3x.png">
                                </i>
                                <i v-else>
                                    <img src="../../../assets/img/Losers-h@3x.png">
                                </i>
                            </template>
                            {{$t('home.home02')}}<!--跌幅榜-->
                        </li>
                        <li v-tap="{methods:sortMarket, name: 'new'}" :class="{'white': sort=='new'}">
                            <template>
                                <i class="down" v-if="sort=='new'">
                                    <img src="../../../assets/img/NewTokens-w@3x.png">
                                </i>
                                <i v-else>
                                    <img src="../../../assets/img/NewTokens-h@3x.png">
                                </i>
                            </template>
                            {{$t('home.home03')}}<!--新币榜-->
                        </li>
                    </ul>
                </section>

                <section class="data_cont_list">
                    <ul class="item" v-for="(item, index) in sortMarketDatas" :key="index"
                        @click="goToExchangePage(item)">
                        <li>
                            <span class="f34">{{item.currencySymbol}}</span><span class="ft-c-lightGray f24">/{{item.baseSymbol}}</span>
                            <p class="ft-c-lightGray ellipsis mt10 f24">24H{{$t('home.home04')}}
                                {{toFixed(item.dealAmount, 2)}}</p>
                        </li>
                        <li>
                            <p class="f34">{{toFixed(item.lastPrice, item.accuracy)|number}}</p>
                            <!--<p class="ft-c-lightGray mt15">≈<span><valuation :lastPrice="item.lastPrice" :baseSymbol="item.baseSymbol"/></span></p>-->
                        </li>
                        <li>
                            <span class="c-normal f36" :class="[percent(item).css]">{{percent(item).percent}}%</span>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import numUtils from '@/assets/js/numberUtils'
    import marketApi from '@/api/market'
    import valuation from '@/components/valuation'

    export default {
        name: 'market-index',
        components: {
            valuation
        },
        data() {
            return {
                sortActive: null,
                sort: 'desc',
                scroll: false,
                token: 'USDS',
            }
        },
        computed: {
            ...mapGetters(['getApiToken', 'getMarketList']),
            sortMarketDatas() {
                let datas = (this.getMarketList || []).sort((item1, item2) => {
                    if (this.sort === 'asc' || this.sort === 'desc') {
                        let m1 = numUtils.BN(item1.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item1.change24h).div(item1.openingPrice)
                        let m2 = numUtils.BN(item2.openingPrice).equals(0) ? numUtils.BN(0) : numUtils.BN(item2.change24h).div(item2.openingPrice)
                        if (m1.equals(m2)) {
                            return 0
                        }
                        return this.sort === 'asc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
                    } else if (this.sort === 'new') {
                        let m1 = numUtils.BN(item1.createdAt)
                        let m2 = numUtils.BN(item2.createdAt)
                        return (m1.lt(m2) ? -1 : 1)
                    }
                })
                return datas
            }
        },
        methods: {
            ...mapActions(['setLast24h']),
            sortMarket(active) {
                this.sort = active.name
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
                        css: percent.gt(0) ? 'c-green' : 'c-orange',
                        percent: percent.gt(0) ? '+' + percent.toFixed(2) : '' + percent.toFixed(2)
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
    .data_content {
        padding: 0 0.3rem;
    }

    .data_header {
        ul {
            display: flex;
            justify-content: space-between;

            li {
                width: 1.88rem;
                padding-bottom: 0.2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #A7ACB9;
                font-size: 0.28rem;
                border-bottom: 0.02rem solid transparent;
                padding-top: 0.3rem;

                &.white {
                    color: #ffffff;
                    border-bottom-color: #00A0E9;
                }

                i {
                    padding-right: 0.12rem;
                    padding-top: 0.05rem;

                    img {
                        width: 0.3rem;
                        height: 0.3rem;
                    }
                }
            }
        }
    }

    .data_cont_list {
        margin-top: 0.3rem;

        ul {
            display: flex;
            background: #2A2A34;
            border-radius: 0.08rem;
            margin-bottom: 0.24rem;
            padding: 0.34rem 0.24rem;
            justify-content: space-between;
            align-items: center;
            color: #ffffff;

            li:nth-child(1) {
                width: 2.4rem;
            }

            li:nth-child(2) {
                flex-shrink: 0;
                flex-grow: 1;
            }

            .c-normal {
                color: #20C26D;
            }

            .c-green {
                color: #20C26D;
            }

            .c-orange {
                color: #DF4A26;
            }
        }
    }
</style>
