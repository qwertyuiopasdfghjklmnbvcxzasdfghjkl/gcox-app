<template>
    <div class="page">
        <top-back>{{$t('exchange.exchange_wallet')}}<!--钱包--></top-back>
        <div class="page-main">
            <div class="detail">
                <div class="name">
                    <span><img :src="`data:image/png;base64,${symbolInfo.iconBase64}`"/></span>
                    <span>{{symbol}}</span>
                </div>
                <label>
                    <span>{{$t('home.total')}}</span>
                    <p>{{symbolInfo.totalBalance}}</p>
                </label>
                <label>
                    <span>{{$t('account.estimated_value_available')}}</span>
                    <p>{{symbolInfo.availableBalance}}</p>
                </label>
                <label>
                    <span>{{$t('wallet.value_frozen')}}</span>
                    <p>{{symbolInfo.frozenBalance}}</p>
                </label>
                <label class="top-border">
                    <span>{{$t('home.home47')}}</span>
                    <p>{{symbolInfo.totalBalance}}</p>
                </label>
            </div>
            <div class="market">
                <p>{{$t('home.go-market')}}</p>
                <ul>
                    <li v-for="item in dataList" v-tap="{methods: goMarket, data: item}">
                        <label>
                            <p><b>{{symbol}}</b><span>/{{item.baseSymbol}}</span></p>
                            <small>{{item.highPrice24h || 0}}</small>
                        </label>
                        <span class="c-normal" :class="[percent(item).css]">{{percent(item).percent}}%</span>
                    </li>
                </ul>
            </div>
            <div class="btn">
                <label class="withdrawal" v-tap="{methods: withdrawal}">{{$t('public0.topup')}}</label>
                <label class="topup" v-tap="{methods: topup}">{{$t('home.topup')}}</label>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import numUtils from '@/assets/js/numberUtils'
    import {MessageBox, Toast} from 'mint-ui'

    export default {
        name: "wallet-detail",
        computed: {
            ...mapGetters(['getUserWallets', 'getSymbol', 'getMarketList','getUserInfo']),
            dataList() {
                return this.getMarketList.filter(res => {
                    if (this.symbol === res.currencySymbol) {
                        return res
                    }
                })
            }
        },
        data() {
            return {
                symbolInfo: {},
                symbol: null
            }
        },
        created() {
            this.symbol = this.getSymbol
            this.getInfo()
            console.log(this.dataList)
        },
        methods: {
            getInfo() {
                this.getUserWallets.filter(res => {
                    if (this.getSymbol === res.symbol) {
                        this.symbolInfo = res
                    }
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
            goMarket(data) {
                console.log(data)
                let item = data.data
                this.$router.push({name: 'exchange', params: {market: `${item.currencySymbol}_${item.baseSymbol}`}})
            },
            withdrawal() {
                if (this.getUserInfo.kycState !== 1) {
                    MessageBox({
                        title: this.$t('public0.public242'),
                        message: this.$t('home.home66'), // 请先完成实名验证
                        confirmButtonText: this.$t('public0.ok')
                    }).then(action => {
                        if (action === 'confirm') {
                            this.$router.push({name: 'realName'})
                        }
                    })
                    return
                }
                if (this.getUserInfo.googleAuthEnable === 0) {
                    MessageBox({
                        title: this.$t('public0.public242'),
                        message: this.$t('error_code.GOOGLE_CELLPHONE_AUTH_FIRST'), // 请先进行谷歌验证或短信验证
                        confirmButtonText: this.$t('public0.ok')
                    }).then(action => {
                        if (action === 'confirm') {
                            this.$router.push({name: 'safe'})
                        }
                    })
                    return
                }
                this.$router.push({name: 'withdrawal'})
            },
            topup() {
                if(this.getUserInfo.googleAuthEnable === 0){
                    MessageBox({
                        title: this.$t('public0.public242'),
                        message: this.$t('error_code.GOOGLE_CELLPHONE_AUTH_FIRST'), // 请先进行谷歌验证或短信验证
                        confirmButtonText: this.$t('public0.ok')
                    }).then(action => {
                        if (action === 'confirm') {
                            this.$router.push({name: 'safe'})
                        }
                    })
                }else{
                    this.$router.push({name: 'page-topup'})
                }
            },
        }
    }
</script>

<style scoped lang="less">
    .detail {
        .name {
            text-align: center;
            margin: 0.7rem auto 0.2rem;

            img {
                width: 0.8rem;
            }

            span {
                line-height: 0.8rem;
                height: 0.8rem;
                display: inline-block;
                vertical-align: top;
                margin: 0 0.1rem;
                font-size: 0.4rem;
            }
        }

        label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.2rem 0;
            font-size: 0.3rem;

            span {
                color: #9da2a9;
            }
        }

        .top-border {
            border-top: 0.02rem solid #2A2A34;
            padding-top: 0.3rem;
            margin-top: 0.1rem;
        }
    }

    .market {
        margin-top: 0.3rem;
        margin-bottom: 1.2rem;

        & > p {
            font-size: 0.3rem;
            color: #9da2a9;
        }

        ul {
            margin: 0.5rem auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;

            li {
                width: 3.35rem;
                flex-shrink: 0;
                flex-grow: 0;
                background: #2A2A34;
                padding: .2rem;
                border-radius: 0.1rem;
                height: 1.5rem;
                margin-bottom: 0.2rem;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;

                label {
                    p {
                        b {
                            font-weight: 400;
                            font-size: 0.36rem;
                        }
                    }

                    small {
                        font-size: 0.3rem;
                        line-height: 0.4rem;
                        color: #b1b6be;
                        padding-top: 0.2rem;
                        display: block;
                    }
                }
            }
        }
    }

    .btn {
        position: fixed;
        width: 100vw;
        height: 1.1rem;
        bottom: 0;
        left: 0;
        background: #20C26D;
        display: flex;
        label{
            width: 50%;
            height: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.3rem;
        }
        .withdrawal{
            background: #DF4A26;
        }
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
</style>
