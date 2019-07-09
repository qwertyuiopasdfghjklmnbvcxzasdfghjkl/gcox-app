<template>
    <div class="page">
        <top-back>
            <p class="top" v-tap="{methods: toggleSymbolList}">
                <span>{{porp.symbol}}</span>
            </p>
        </top-back>

        <div class="page-main">
            <section class="wallet-feature">
                <img class="wallet-feature-symbol" v-if="currentSymbolInfo" :src="'data:image/png;base64,' + currentSymbolInfo.iconBase64"/>
                <p class="mt20 text-center f30">{{currentSymbolInfo && currentSymbolInfo.totalBalance|number}}</p>
                <div class="wallet-feature-operation">
                  <span v-tap="{methods: $root.routeTo, to: (!currentSymbolInfo ||
                   currentSymbolInfo.rechargeFlag!==1)?'':'page-topup', params: {symbol: porp.symbol}}">
                    <img src="../../assets/img/i_cz.png" style="opacity: 0.6"
                         v-if="!currentSymbolInfo || currentSymbolInfo.rechargeFlag!==1">
                    <img src="../../assets/img/i_cz.png" v-else>
                    <em :class="{disabled:!currentSymbolInfo || currentSymbolInfo.rechargeFlag!==1}">
                        {{$t('account.estimated_value_deposit')}}<!--充值-->
                    </em>
                  </span>
                  <span v-tap="{methods: withdrawal, params: {symbol: porp.symbol, symbolType: porp.symbolType}}">
                    <img src="../../assets/img/i_tx.png" style="opacity: 0.6"
                         v-if="!currentSymbolInfo || currentSymbolInfo.withdrawFlag!==1">
                    <img src="../../assets/img/i_tx.png" v-else>
                    <em :class="{disabled:!currentSymbolInfo || currentSymbolInfo.withdrawFlag!==1}">
                        {{$t('account.estimated_value_withdrawal')}}
                        <!--提现-->
                    </em>
                  </span>
                  <span v-tap="{methods: $root.routeTo, to: 'market', params: {symbol: porp.symbol}}">
                    <img src="../../assets/img/i_jy.png">
                    <em>{{$t('account.estimated_value_trade')}}<!--交易--></em>
                  </span>
                </div>
            </section>

            <p class="mt40">{{$t('trade_record.trade_history')}}</p>
            <section class="wallet-history mt15">
              <mt-loadmore
                      :class="{'is-loading': depositTopLoading}"
                      ref="depositLoadmore"
                      :autoFill="false"
                      :topDistance="40"
                      :topMethod="loadTop"
                      @top-status-change="handleTopChange"
                      infinite-scroll-immediate-check="false"
                      infinite-scroll-distance="80"
                      infinite-scroll-disabled="depositBottomDisabled"
                      v-infinite-scroll="loadMore"
              >
                  <!-- <loading slot="top" :class="{'is-loading': depositTopDrop}"/> -->
                  <template v-if="depositHistory.length > 0">
                      <ul ref="depositHistoryList">
                          <li class="item" v-for="(item, index) in depositHistory">
                              <div>
                                <img :src="item.icon || 'data:image/png;base64,' + currentSymbolInfo.iconBase64">
                                <p class="mt10">
                                    <span class="f30">{{getTransTitle(item.transType)}}</span> <br />
                                    <span class="ft-c-lightGray f24">{{item.transTime ? new Date(Number(item.transTime)).format() : '--'}}</span>
                                </p>
                              </div>
                              <div class="quantity in f30" v-if="{in:item.transType===1 ||item.transType===5}">
                                +{{item.transAmount}} {{porp.symbol}}
                              </div>
                              <div class="quantity out f30" v-else>
                                -{{item.transAmount}} {{porp.symbol}}
                              </div>
                          </li>
                      </ul>
                      <loading :bgColor="depositHistory.length % 2 === 0 ? '#0c151d' : '#0d0d0d'"
                               v-if="depositBottomLoading"/>
                      <noMoreData :bgColor="depositHistory.length % 2 === 0 ? '#F7F7F7' : '#F7F7F7'"
                                  v-if="!depositBottomLoading && noMoreDepositHistory"/>
                  </template>
                  <noData v-if="!depositTopLoading && depositHistory.length === 0"/>
              </mt-loadmore>
            </section>
        </div>
        <mask-layer :show="showSymbolList" @hide="hideSymbolList" :isgray="true">
          <transition enter-active-class="animated short slideInLeft">
            <div class="symbol-list-container" v-show="showSymbolSlide">
              <p class="pt60 f40 box">{{$t('market.filterToken')}}</p>
              <div class="mt55 box">
                <input type="search" class="search-input" v-model="filterTitle" :placeholder="$t('public0.search')"/>
              </div>
              <ul class="symbol-list f34 mt20">
                <li class="box" v-for="item in filterSymboltList" v-tap="{methods: changeSymbol, item: item}">
                  <p>{{item.symbol}}</p>
                </li>
              </ul>
            </div>
          </transition>
        </mask-layer>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import {MessageBox, Toast} from 'mint-ui'
    import utils from '@/assets/js/utils'
    import myApi from '@/api/user'
    import userApi from '@/api/individual'
    import userUtils from '@/api/wallet'
    import loading from '@/components/common/loading'
    import noData from '@/components/common/noData'
    import noMoreData from '@/components/common/noMoreData'

    export default {
        name: 'page-trading',
        components: {
            loading,
            noData,
            noMoreData
        },
        data() {
            return {
                filterTitle:'',
                showSymbolSlide:false,
                porp: {
                    symbol: this.$route.params.symbol,
                    symbolType: this.$route.params.symbolType
                },
                showSymbolList: false,
                paramDeposit: {
                    symbol: this.$route.params.symbol,
                    page: 1,
                    pageSize: 10
                },
                depositHistory: [], // 充值记录
                depositTopDrop: false, // 充值记录下拉状态
                depositTopLoading: false, // 充值记录下拉加载状态
                depositBottomDisabled: false, // 充值记录滚动加载禁用状态
                depositBottomLoading: false, // 充值记录滚动加载状态
                noMoreDepositHistory: false, // 是否没有更多充值记录
            }
        },
        computed: {
            ...mapGetters(['getUserInfo','getUserWallets']),
            symbolList() { // 获取币种列表
                return this.getUserWallets.sort((item1, item2) => {
                    if (item1.symbol === item2.symbol) {
                        return 0
                    } else {
                        return item1.symbol < item2.symbol ? -1 : 1
                    }
                })
            },
            filterSymboltList(){
              if(this.symbolList.length){
                return this.symbolList.filter(item=>{
                  return item.symbol.toLowerCase().includes(this.filterTitle.toLowerCase())
                })
              } else {
                return []
              }
            },
            currentSymbolInfo() {
                for (let i = 0; i < this.symbolList.length; i++) {
                    let tempItem = this.symbolList[i]
                    if (this.porp.symbol === tempItem.symbol) {
                        return tempItem
                    }
                }
                return null
            }
        },
        watch: {
            showSymbolList(_n){
              if(_n){
                setTimeout(()=>{
                  this.showSymbolSlide = true
                },100)
              } else {
                this.showSymbolSlide = false
              }
            },
            'porp.symbol'(val) {
                Indicator.open()
                // 初始化充值记录参数
                this.paramDeposit.symbol = val
                this.paramDeposit.page = 1
                this.depositHistory = []
                this.getTransList(() => {
                    Indicator.close()
                }, () => {
                    Indicator.close()
                })
            },
            'paramDeposit.page'(val) {
                if (val !== 1 && !this.noMoreDepositHistory) {
                    this.depositBottomDisabled = true
                    this.depositBottomLoading = true
                    this.getDepositHistory(() => {
                        this.depositBottomLoading = false
                    }, () => {
                        this.depositBottomLoading = false
                    })
                }
            },
        },
        created() {
            Indicator.open()
            this.getTransList(() => {
                Indicator.close()
            }, () => {
                Indicator.close()
            })
        },
        methods: {
            ...mapActions([]),
            getTransTitle(transType){
                let result = ''
                switch(transType){
                    case 1:
                    result = this.porp.symbol + this.$t('account.estimated_value_deposit')
                    case 2:
                    result = this.porp.symbol + this.$t('account.estimated_value_withdrawal')
                    case 3:
                    result = this.porp.symbol + this.$t('account.exchange')
                    case 4:
                    result = this.$t('account.game_deposit')
                    case 5:
                    result = this.$t('account.game_withdrawal')
                }
                return result
            },
            toggleSymbolList() { // 展开/收起币种列表
                this.showSymbolList = !this.showSymbolList
            },
            hideSymbolList() { // 隐藏币种列表
                this.showSymbolList = false
                this.filterTitle = ''
            },
            changeSymbol(args) { // 切换币种
                this.porp.symbol = args.item.symbol
                this.porp.symbolType = args.item.symbolType
                this.$router.replace({path: `/trading/${args.item.symbol}`})
                this.showSymbolList = false
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
            getTransList(successCallback, errorCallback, isLoadTop) { // 获取充值记录
                userUtils.getTransList(this.paramDeposit, (res) => {
                    if (isLoadTop) { // 判断是否为下拉刷新方式加载数据，则替换旧数据
                        this.depositHistory = res.data
                    } else {
                        this.depositHistory = this.depositHistory.concat(res.data)
                    }
                    if (this.depositHistory.length >= Number(res.msg)) { // 判断数据是否加载完毕，则禁用滚动加载事件
                        this.depositBottomDisabled = true
                        this.noMoreDepositHistory = true
                    } else {
                        this.depositBottomDisabled = false
                        this.noMoreDepositHistory = false
                    }
                    if (!this.noMoreDepositHistory) { // 如果数据撑不满容器时，继续请求下一页数据
                        this.$nextTick(() => {
                            if (this.$refs.depositLoadmore.$el.clientHeight > this.$refs.depositHistoryList.clientHeight) {
                                this.paramDeposit.page++
                            }
                        })
                    }
                    successCallback && successCallback(res)
                }, (msg) => {
                    errorCallback && errorCallback(msg)
                    console.error(msg)
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
            handleTopChange(status) { // 获取组件的下拉状态 status: pull（组件被下拉但未达到阈值）、drop（组件被下拉且已达到阈值）、loading（组件被下拉达到阈值后释放）
                this.depositTopDrop = status !== 'pull'
                this.depositTopLoading = status === 'loading'
            },
            loadTop() { // 下拉获取最新消息
                this.paramDeposit.page = 1
                this.getTransList(() => {
                    setTimeout(()=>{
                        this.depositTopDrop = false
                        this.depositTopLoading = false
                        $('.mint-loadmore-content').css({'transform':'translate3d(0px, 0px, 0px)'})
                    },1000)
                }, () => {
                    setTimeout(()=>{
                        this.depositTopDrop = false
                        this.depositTopLoading = false
                        $('.mint-loadmore-content').css({'transform':'translate3d(0px, 0px, 0px)'})
                    },1000)
                }, true)
            },
            loadMore() { // 向下滚动获取更多消息
                this.paramDeposit.page++
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
        border-left:0.12rem solid transparent;
        border-right:0.12rem solid transparent;
        margin-left: 0.15rem;
    }
}

.page-main {
    top: 1rem;
}

.wallet-feature {
    margin-left: -0.3rem;
    margin-right: -0.3rem;
    padding: .3rem;
    background-color: #fff;
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
    justify-content: space-between;
    margin-top: .3rem;
}

.wallet-feature-operation span {
    margin-right:0.3rem;
    flex: 1;
    line-height: 0.75rem;
    text-align: center;
    border-radius:0.1rem;
    &:nth-of-type(1){
        background-color:#05C878;
    }
    &:nth-of-type(2){
        background-color:#FFBA00;
    }
    &:nth-of-type(3){
        margin-right:0;
        background-color:#6AA9FF;
    }
}

.wallet-feature-operation span img {
    width: 0.45rem;
    height: .75rem;
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
.wallet-feature-operation span em.disabled {opacity: 0.6;}

.wallet-history {
    margin-left: -0.3rem;
    margin-right: -0.3rem;
    height: calc(~"100vh - 4.95rem");
    overflow-y: auto;
    ul {
        background-color:#fff;
        padding-left:0.3rem;
        padding-right: 0.3rem;
        li{
            padding: 0.25rem 0;
            border-bottom: 1px solid #E7E7E7;
            display: flex;
            justify-content: space-between;
            &:last-of-type {
                border-bottom: none;
            }
            > div:first-of-type {flex: 1;}
            p {display: inline-block; line-height: 1.5em;}
            img {
                width: 0.96rem;
                height: 0.96rem;
                object-fit: contain;
                object-position: center;
                border-radius:0.25rem;
                overflow: hidden;
                margin-right: 0.28rem;
                vertical-align: top;
            }
        }
    }
     
}
.quantity {
    line-height: 0.96rem;
    color: #FFBA00;
    &.in {color: #05C878;}
}
.mint-loadmore{
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
    padding-left:0.47rem;
    border:none;
    background: url('../../assets/img/i_search@2x.png') transparent no-repeat left center;
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
</style>
