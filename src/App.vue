<template>
    <div id="app">
        <transition enter-active-class="animated short myFadeIn" leave-active-class="animated short fadeOut">
            <router-view :class="{wrap:$route.meta.nav}"/>
        </transition>
        <!--<update ref="update"></update>-->
        <init-slides></init-slides>
        <nav-footer v-show="$route.meta.nav"></nav-footer>
    </div>
</template>

<script>
    import navFooter from '@/components/common/nav'
    import initSlides from '@/components/initSlides'
    import update from '@/components/update'
    import {mapGetters, mapActions} from 'vuex'
    import config from '@/api/config'
    import GlobalWebSocket from '@/assets/js/websocket'
    import utils from '@/assets/js/utils'
    import numUtils from '@/assets/js/numberUtils'
    import cordovaUtils from '@/assets/js/cordovaUtils'
    import marketApi from '@/api/market'
    import walletApi from '@/api/wallet'
    import userApi from '@/api/user'
    import {MessageBox} from 'mint-ui'

    export default {
        components: {
            navFooter,
            initSlides,
            update
        },
        computed: {
            ...mapGetters(['getApiToken', 'getQuickLoginInfo'])
        },
        watch: {
            getApiToken(newVal) {
                this.loadLoginInfo()
                this.getMarketList()
            },
        },
        created() {
            //一键注册用户快速登录
            if (!this.getApiToken && this.getQuickLoginInfo) {
                this.setApiToken(this.getQuickLoginInfo.apiToken)
                this.setUserInfo(this.getQuickLoginInfo)
            }
            //建立全局推送，初始化数据
            this.gws = new GlobalWebSocket({
                type: 'global',
                checkNetWork: (signal) => {
                    this.setNetworkSignal(signal)
                },
                onClose: () => {
                    this.setNetworkSignal(3)
                },
                callback: (res) => {
                    if (res.dataType === 'LastValuation') {
                        this.setUSDCNY({
                            USD: numUtils.BN(res.USD).toFixed(2),
                            CNY: numUtils.BN(res.USDCNY).toFixed(2)
                        })
                        this.setBTCValuation(numUtils.BN(res.totalAmount).toFixed(8)) // 当前转换人民币

                    }
                }
            })
            this.getBtcPrice()
            this.getMarketList()
            this.loadLoginInfo()
            this.checkDeviceready()
        },
        mounted() {
            $('#app').on('click', 'input', (e) => {
                e.target.focus()
            })
        },
        methods: {
            ...mapActions(['setBTCValuation', 'setUSDCNY', 'setNetworkSignal', 'setBtcValues', 'setMarketList', 'setUserWallets', 'setMarketConfig', 'setApiToken', 'setUserInfo', 'setVersion']),
            getMarketList() {
                //获取市场列表并初始化BTC币种与其它币种最新交易价格
                marketApi.marketList((res) => {
                    if (!this.getApiToken) {
                        res.forEach((item) => {
                            item.collection = false
                        })
                    }
                    this.setMarketList(res)
                    this.setBtcValues(res)
                    let config = {}
                    res.forEach((item) => {
                        config[item.market] = {
                            minAmount: item.minAmount,
                            minQuantity: item.minQuantity
                        }
                    })
                    this.setMarketConfig(utils.isPlainEmpty(config) ? null : config)
                })
            },
            loadLoginInfo() {
                console.log('getApiToken===', this.getApiToken)
                if (this.getApiToken) {

                    walletApi.myAssets({}, (res) => {
                        res = res.filter(item => {
                            return item.type === 1
                        })
                        res.forEach((item) => {
                            item.frozenBalance = numUtils.add(item.frozenBalance, item.adFrozenBalance).add(item.loanBalance).toString()
                        })
                        this.setUserWallets(res)
                    })
                } else {
                    this.setUserWallets([])
                }
            },
            getBtcPrice() {
                if (!this.getApiToken) {
                    return
                }
                marketApi.getBtcPrice(res => {
                    this.setUSDCNY({
                        USD: numUtils.BN(res.USD).toFixed(2),
                        CNY: numUtils.BN(res.CNY).toFixed(2)
                    })
                    this.setBTCValuation(numUtils.BN(res.btcAmount).toFixed(8)) // 当前转换人民币
                })
            },
            checkDeviceready() {
                if (window['deviceready']) {
                    this.setVersion(AppVersion.version)
                    cordovaUtils.getDeviceLang()
                } else {
                    setTimeout(this.checkDeviceready, 100)
                }
            }, //检测壳连接状态
        }
    }
</script>

<style lang="less">
    @import './assets/css/style.css';
    @import './assets/css/common.less';
    @import './assets/css/fonts.css';

    #app {
        font-family: SFUIText-Regular, PingFang-SC, 'Microsoft YaHei', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .page.wrap {
        height: -webkit-calc(~'100vh - 0.98rem');
        height: calc(~'100vh - 0.98rem');
    }
</style>
<style type="text/css">
    @media screen and (min-aspect-ratio: 13/9) {
        .tip {
            padding: 0.08rem !important;
            font-size: 0.16rem !important;
        }
    }
</style>
