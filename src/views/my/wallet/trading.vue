<template>
    <div class="page">
        <top-back>
            {{$t('home.home45')}}
            <span slot="right" class="right" v-tap="{methods: history}">
                {{$t('home.home48')}}
            </span>
        </top-back>

        <div class="page-main">
            <section class="wallet-feature">
                <p>{{$t('home.home46')}}</p>
                <div class="wallet-feature-operation">
                  <span v-tap="{methods: withdrawal}">
                      <img src="../../../assets/img/i_tx.png">
                    <em>
                        {{$t('home.home49')}}<!--提现-->
                    </em>
                  </span>
                    <span v-tap="{methods: pay}">
                    <img src="../../../assets/img/i_cz.png">
                    <em>
                        {{$t('home.home50')}}
                        <!--充值-->
                    </em>
                  </span>
                    <span v-tap="{methods: $root.routeTo, to: 'address-manage'}">
                    <img src="../../../assets/img/i_jy.png">
                    <em>{{$t('home.home51')}}<!--地址--></em>
                  </span>
                </div>
            </section>
            <div class="total">
                <p v-tap="{methods:()=>{ showMoney = !showMoney}}">
                    <span>{{$t('home.home47')}}</span>
                    <img :src="showMoney ? require('../../../assets/img/eye_open@2x.png'): require('../../../assets/img/eye_closed@2x.png')"/>
                </p>
                <h4 class="">{{currentSymbolInfo|number}} BTC</h4>
            </div>
            <div class="list_title">
                <p>{{$t('home.home53')}}</p>
                <label>
                    <span>
                        <img :src="showZero ? require('../../../assets/img/check@3x.png'): require('../../../assets/img/no-check.png')">
                        <input type="checkbox" v-model="showZero">
                    </span>
                    <span>{{$t('home.home52')}}</span>
                </label>
            </div>
            <div class="cont_list">
                <ul>
                    <li v-for="data in filterSymboltList" v-tap="{methods: toWallet, item:data}">
                        <p>{{data.accountName}}</p>
                        <label>
                            <p>{{data.totalBalance | number}}</p>
                            <span><img src="../../../assets/img/i_rig_c@3x.png"/></span>
                        </label>
                    </li>
                </ul>
            </div>

        </div>

    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import {MessageBox, Toast} from 'mint-ui'
    import market from '@/api/market'
    import loading from '@/components/common/loading'
    import noData from '@/components/common/noData'
    import noMoreData from '@/components/common/noMoreData'
    import numUtils from '@/assets/js/numberUtils'

    export default {
        name: 'trading',
        components: {
            loading,
            noData,
            noMoreData
        },
        data() {
            return {
                filterTitle: '',
                showZero: false,
                showSymbolList: false,
                showMoney: true
            }
        },
        computed: {
            ...mapGetters(['getUserInfo', 'getUserWallets', 'getBTCValuation']),
            symbolList() { // 获取币种列表
                return this.getUserWallets.sort((item1, item2) => {
                    if (item1.symbol === item2.symbol) {
                        return 0
                    } else {
                        return item1.symbol < item2.symbol ? -1 : 1
                    }
                })
            },
            filterSymboltList() {
                if (this.symbolList.length) {
                    return this.symbolList.filter(item => {
                        if (this.showZero) {
                            let data = []
                            if (Number(item.totalBalance) > 0) {
                                // data.push(item)
                                return item.symbol.toLowerCase().includes(this.filterTitle.toLowerCase())
                            }
                        } else {
                            return item.symbol.toLowerCase().includes(this.filterTitle.toLowerCase())
                        }
                    })
                } else {
                    return []
                }
            },
            currentSymbolInfo() {
                if (this.showMoney) {
                    return this.getBTCValuation
                } else {
                    return '******'
                }
            },
        },
        watch: {},
        created() {
            console.log(this.getUserInfo)
            this.getBtcPrice()
        },
        methods: {
            ...mapActions(['setBTCValuation', 'setUSDCNY', 'setSymbol']),
            getBtcPrice() {
                market.getBtcPrice(res => {
                    this.setUSDCNY({
                        USD: numUtils.BN(res.USD).toFixed(2),
                        CNY: numUtils.BN(res.CNY).toFixed(2)
                    })
                    this.setBTCValuation(numUtils.BN(res.btcAmount).toFixed(8)) // 当前转换人民币
                })
            },
            withdrawal() { // 前往提现
                // if (this.getUserInfo.kycState !== 1) {
                //     MessageBox({
                //         title: this.$t('public0.public242'),
                //         message: this.$t('home.home66'), // 请先完成实名验证
                //         confirmButtonText: this.$t('public0.ok')
                //     }).then(action => {
                //         if (action === 'confirm') {
                //             this.$router.push({name: 'kyc'})
                //         }
                //     })
                //     return
                // }
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
                this.$router.push({name: 'withdrawal-select'})
            },
            pay() { // 充值
                console.log(this.getUserInfo)
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
                } else {
                    this.$router.push({name: 'topup-select'})
                }
            },
            history() {
                this.$router.push({name: 'history'})
            },
            toWallet(params) {
                this.setSymbol(params.item.symbol)
                this.$router.push({name: 'wallet-detail'})
            }
        }
    }
</script>

<style lang="less" scoped>

    .page-top h1 {
        height: .8rem;
        font-size: 0;
        line-height: 0;
        text-align: center;
    }

    .page-top h1 span {
        position: relative;
        display: inline-block;
        padding-right: .36rem;
        font-size: .36rem;
        line-height: .8rem;
        color: #cbd4ec;
    }

    .page-top h1 span::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 0;
        margin-top: -0.06rem;
        border-width: .12rem .12rem 0 .12rem;
        border-style: solid;
        border-color: #cbd4ec transparent transparent transparent;
    }

    .top {
        display: inline-flex;
        font-size: 0.38rem;
        align-items: center;
        position: relative;

        span {
            padding-left: 0.2rem;
        }

        &:after {
            content: '';
            display: inline-block;
            vertical-align: middle;
            border-top: 0.15rem solid #222222;
            border-left: 0.12rem solid transparent;
            border-right: 0.12rem solid transparent;
            margin-left: 0.15rem;
        }
    }

    .right {
        color: #8C8CA1;
        font-size: 0.28rem;
    }

    .page-main {
        top: 1rem;
    }

    .wallet-feature {
        display: flex;
        justify-content: space-between;
        border-bottom: 0.02rem solid #40403E;
        padding: 0.18rem 0;
        margin-top: 0.16rem;
    }

    .wallet-feature p {
        font-size: 0.32rem;
        height: 0.44rem;
        line-height: 0.44rem;
        color: #00A0E9;
        position: relative;
    }

    .wallet-feature p:after {
        content: '';
        position: absolute;
        display: inline-block;
        width: 1.5rem;
        left: 0;
        bottom: -0.2rem;
        height: 0.02rem;
        background: #00A0E9;
    }

    .wallet-feature-symbol {
        width: 0.8rem;
        height: 0.8rem;
        object-fit: contain;
        object-position: center;
        margin-left: auto;
        margin-right: auto;
        display: block;
    }

    .wallet-feature-operation {
        display: flex;
        width: 3.3rem;;
        justify-content: flex-end;
    }

    .wallet-feature-operation span {
        margin-right: 0.2rem;
        display: inline-flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 0.24rem;

        &:nth-of-type(3) {
            margin-right: 0;
        }
    }

    .wallet-feature-operation span img {
        width: 0.32rem;
        object-fit: contain;
        object-position: center;
        vertical-align: middle;
    }

    .wallet-feature-operation span em {
        color: #fff;
        font-style: normal;
        display: inline-block;
        margin-left: 0.1rem;
    }

    .wallet-feature-operation span em.disabled {
        opacity: 0.6;
    }

    .wallet-history {
        margin-left: -0.3rem;
        margin-right: -0.3rem;
        height: calc(~"100vh - 4.95rem");
        overflow-y: auto;

        ul {
            background-color: #fff;
            padding-left: 0.3rem;
            padding-right: 0.3rem;

            li {
                padding: 0.25rem 0;
                border-bottom: 1px solid #E7E7E7;
                display: flex;
                justify-content: space-between;

                &:last-of-type {
                    border-bottom: none;
                }

                > div:first-of-type {
                    flex: 1;
                }

                p {
                    display: inline-block;
                    line-height: 1.5em;
                }

                img {
                    width: 0.96rem;
                    height: 0.96rem;
                    object-fit: contain;
                    object-position: center;
                    border-radius: 0.25rem;
                    overflow: hidden;
                    margin-right: 0.28rem;
                    vertical-align: top;
                }
            }
        }

    }

    .total {
        p {
            color: #A7ACB9;
            font-size: 0.26rem;
            padding: 0.24rem 0;
            display: flex;
            align-items: center;

            span {
                padding-right: 0.2rem;
            }

            img {
                width: 0.42rem;
            }
        }

        h4 {
            font-size: 0.3rem;
        }
    }

    .list_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.5rem;

        p {
            font-size: 0.28rem;
        }

        label {
            display: inline-flex;
            align-items: center;

            span {
                font-size: 0.24rem;
                line-height: 0.24rem;
                color: #00A0E9;
            }

            span:first-child {
                margin-right: 0.16rem;
                position: relative;
                width: 0.22rem;
                height: 0.22rem;
                display: inline-block;

                input {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    z-index: 9;
                    opacity: 0;
                }
            }
        }
    }

    .quantity {
        line-height: 0.96rem;
        color: #FFBA00;

        &.in {
            color: #05C878;
        }
    }

    .mint-loadmore {
        min-height: 100%;
    }

    .mint-loadmore .loading:first-of-type {
        visibility: hidden;
        margin-top: -0.8rem;
    }

    .mint-loadmore .loading.is-loading:first-of-type {
        visibility: visible;
    }

    .symbol-list-container {
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
            padding-left: 0.47rem;
            border: none;
            background: url('../../../assets/img/i_search@2x.png') transparent no-repeat left center;
            background-size: 0.27rem auto;
        }
    }

    .symbol-list {
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

    .cont_list {
        background: #272731;
        margin: 0.2rem -0.3rem;
        padding: 0 0.3rem;

        ul {
            li {
                height: 0.88rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 0.02rem solid #43434E;

                &:last-child {
                    border-bottom: none;
                }

                label {
                    display: inline-flex;
                    flex-wrap: nowrap;
                    align-items: center;

                    p {
                        padding-right: 0.24rem;
                    }

                    img {
                        width: 0.18rem;
                        height: 0.33rem;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
</style>
