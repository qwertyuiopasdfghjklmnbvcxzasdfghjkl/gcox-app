<template>
    <div id="app">
        <div v-show="showSplash" class="splash"></div>
        <transition enter-active-class="animated short myFadeIn" leave-active-class="animated short fadeOut">
            <router-view :class="{wrap:$route.meta.nav}"/>
        </transition>
        <!--<update ref="update"></update>-->
        <!-- <init-slides v-if="system === 1"></init-slides> -->
        <nav-footer v-show="$route.meta.nav"></nav-footer>

    </div>
</template>

<script>
    import navFooter from '@/components/common/nav'
    import initSlides from '@/components/initSlides'
    import update from '@/components/update'
    import {mapGetters, mapActions} from 'vuex'
    import GlobalWebSocket from '@/assets/js/websocket'
    import utils from '@/assets/js/utils'
    import numUtils from '@/assets/js/numberUtils'
    import cordovaUtils from '@/assets/js/cordovaUtils'
    import marketApi from '@/api/market'
    import walletApi from '@/api/wallet'
    import select from './views/dialog/selectWeb'
    import international from './views/dialog/internationalWeb'
    import internationalApp from './views/dialog/internationalApp'
    import langApi from '@/api/language'
    import Config from '@/api/config'

    export default {
        components: {
            navFooter,
            initSlides,
            update
        },
        data(){
            return{
                system: 0,
                showSplash: true
            }
        },
        computed: {
            ...mapGetters(['getApiToken', 'getQuickLoginInfo',  'getSiteType', 'getSysParams','getUserInfo'])

        },
        watch: {
            getApiToken(newVal) {
                this.loadLoginInfo()
                this.getMarketList()
            },
            getSysParams(e) {
                console.log(e)
                let status = e['maintain']['value']
                if( status === '1'){
                    console.log('go maintain')
                    this.$router.push({name: 'maintain'})
                }else{
                    this.showJumpTo()
                }
            },
            getUserInfo(){
                if(this.getUserInfo.kycState === 1){
                    this.showJumpTo2()
                }
            }
        },
        created() {
            if(window['cordova']){
                this.system = 1
                console.log('我是app首页！',new Date().getTime())
            }else{
                // this.showSplash = false
                console.log('我是h5首页！',new Date().getTime())
            }
            this.getLang()
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
            this.getSysparams()
            this.getBtcPrice()
            this.getMarketList()
            this.loadLoginInfo()
            this.checkDeviceready()
            screen.orientation.lock('portrait');
            console.log('vue created',new Date().getTime())
        },
        mounted() {
            $('#app').on('click', 'input', (e) => {
                e.target.focus()
            })
            setTimeout(()=>{
                this.showSplash = false
            },5000)
        },
        methods: {
            ...mapActions(['setBTCValuation', 'setUSDCNY', 'setNetworkSignal', 'setBtcValues',
                'setMarketList', 'setUserWallets', 'setMarketConfig', 'setApiToken', 'setUserInfo',
                'setVersion', 'setSysParams']),

            getLang(){
                let lang = window.localStorage.lang || 'en'
                langApi.getLanguage(lang, (res) => {
                    if (Config.updateInfo[lang]) {
                        res.updateInfo = Config.updateInfo[lang]
                    } else {
                        res.updateInfo = Config.updateInfo['en']
                    }
                    this.$i18n.locale = lang
                    this.$i18n.setLocaleMessage(lang, res)
                    window.localStorage[lang] = JSON.stringify(res)
                })
            },
            showJumpTo() {
                marketApi.getIpVerify(res => {
                    if (res) {
                        if (window['cordova']) {
                            console.log('请访问新加坡站点')
                            // utils.setDialog(internationalApp, {
                                // 选择哪个站点 select
                            //})
                        } else {
                            utils.setDialog(select, {
                                // 选择哪个站点 select
                            })
                        }
                    }
                })
            },
            showJumpTo2() {
                marketApi.getKycValidate(res => {
                    if (res) {
                        if (window['cordova']) {
                            console.log('请访问新加坡站点')
                           // utils.setDialog(internationalApp, {
                                // 选择哪个站点 select
                            //})
                        } else {
                            this.setApiToken('')
                            utils.setDialog(international, {
                                // 提示其访问主站（gcox.com）
                            })
                        }

                    }
                })
            },

            getSysparams(){
              marketApi.rateSysparams(res=>{
                let params = {}
                for(let item of res){
                  params[item.code] = item
                }
                this.setSysParams(params)
              })
            },
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
                    setTimeout(navigator.splashscreen.hide(), 1000)
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
    .splash{
        background: url("./assets/img/splash.gif") no-repeat center #000000;
        background-size: cover;
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        z-index: 9999;
    }
</style>
