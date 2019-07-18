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
                  <span v-tap="{methods: $root.routeTo, to: 'page-topup'}">
                      <img src="../../../assets/img/i_tx.png">
                    <em>
                        {{$t('home.home49')}}<!--提现-->
                    </em>
                  </span>
                    <span v-tap="{methods: withdrawal}">
                    <img src="../../../assets/img/i_cz.png">
                    <em>
                        {{$t('home.home50')}}
                        <!--充值-->
                    </em>
                  </span>
                    <span v-tap="{methods: $root.routeTo, to: 'market'}">
                    <img src="../../../assets/img/i_jy.png">
                    <em>{{$t('home.home51')}}<!--地址--></em>
                  </span>
                </div>
            </section>
            <div class="total">
                <p><span>{{$t('home.home47')}}</span><img :src="require('../../../assets/img/eye_open@2x.png')"/></p>
                <h4 class="">{{currentSymbolInfo|number}}</h4>
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
                    <li v-for="data in filterSymboltList">
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
    import utils from '@/assets/js/utils'
    import myApi from '@/api/user'
    import userApi from '@/api/individual'
    import walletApi from '@/api/wallet'
    import loading from '@/components/common/loading'
    import noData from '@/components/common/noData'
    import noMoreData from '@/components/common/noMoreData'
    import numUtils from '@/assets/js/numberUtils'
    export default {
        name: 'page-trading',
        components: {
            loading,
            noData,
            noMoreData
        },
        data() {
            return {
                filterTitle: '',
                showSymbolSlide: false,
                showZero: false,
                showSymbolList: false,
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
                        return item.symbol.toLowerCase().includes(this.filterTitle.toLowerCase())
                    })
                } else {
                    return []
                }
            },
            currentSymbolInfo() {
                console.log(this.getBTCValuation)
                return this.getBTCValuation
            },
            sortedDatas () {
                let ndatas = this.getUserWallets.sort((item1, item2) => {
                    let m1 = numUtils.BN(item1.totalBalance)
                    let m2 = numUtils.BN(item2.totalBalance)
                    if (m1.equals(m2)) {
                        return item1.symbol < item2.symbol ? -1 : 1
                    }
                    return this.sort === 'desc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
                })
                return ndatas
            },
        },
        watch: {
            showSymbolList(_n) {
                if (_n) {
                    setTimeout(() => {
                        this.showSymbolSlide = true
                    }, 100)
                } else {
                    this.showSymbolSlide = false
                }
            },
        },
        created() {
            // Indicator.open()
            console.log(this.symbolList,this.filterSymboltList)
            this.tatol()
        },
        methods: {
            ...mapActions([]),
            tatol(){
                walletApi.myAssets(res=>{
                    console.log(res)
                })
            },
            withdrawal() { // 前往提现
                if (!this.currentSymbolInfo || this.currentSymbolInfo.withdrawFlag !== 1) {
                    return
                }
                userApi.getUserState((data) => {
                    if (data.verifyState !== 2) {
                        MessageBox({
                            title: this.$t('public0.public242'),
                            message: this.$t('error_code.KYC_AUTH_FIRST'), // 请先完成实名验证
                            confirmButtonText: this.$t('public0.ok')
                        }).then(action => {
                            if (action === 'confirm') {
                                this.$router.push({name: 'realName'})
                            }
                        })
                        return
                    }
                    if (data.googleState !== 1 && data.mobileAuthState !== 1) {
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
                    if (!this.getUserInfo.email && data.mobileAuthState !== 1) {
                        MessageBox({
                            title: this.$t('public0.public242'),
                            message: this.$t('error_code.CELLPHONE_AUTH_FIRST'), // 请先进行短信验证
                            confirmButtonText: this.$t('public0.ok')
                        }).then(action => {
                            if (action === 'confirm') {
                                this.$router.push({name: 'noteVerif'})
                            }
                        })
                        return
                    }
                    this.$router.push({name: 'page-withdrawal', params: {userInfo: this.getUserInfo}})
                }, (msg) => {
                    console.error(msg)
                })
            },
            history(){
                this.$router.push({name: 'history'})
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
    .list_title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.5rem;
        p{
            font-size: 0.28rem;
        }
        label{
            display: inline-flex;
            align-items: center;
            span{
                font-size: 0.24rem;
                line-height: 0.24rem;
                color:  #00A0E9;
            }
            span:first-child{
                margin-right: 0.16rem;
                position: relative;
                width: 0.22rem;
                height: 0.22rem;
                display: inline-block;
                input{
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
    .cont_list{
        background: #272731;
        margin: 0.2rem -0.3rem;
        padding: 0 0.3rem;
        ul{
            li{
                height: 0.88rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 0.02rem solid #43434E;
                &:last-child{
                    border-bottom: none;
                }
                label{
                    display: inline-flex;
                    flex-wrap: nowrap;
                    align-items: center;
                    p{
                        padding-right: 0.24rem;
                    }
                    img{
                        width: 0.18rem;
                        height:0.33rem;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
</style>
