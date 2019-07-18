<template>
    <div class="page">
        <top-back>
            {{$t('home.home48')}}
        </top-back>
        <mt-navbar v-model="selected">
            <mt-tab-item id="tab1">{{$t('home.home54')}}</mt-tab-item>
            <mt-tab-item id="tab2">{{$t('home.home55')}}</mt-tab-item>
        </mt-navbar>
        <div class="list_box">
            <div class="list">
                <label>{{$t('home.home56')}}<i><img src="../../../assets/img/tc_meus_b@2x.png"></i></label>
                <div>
                    <span @click="symbol = ''" :class="{'active': !symbol}">{{$t('home.home59')}}</span>
                    <span @click="symbol = 'BTC'" :class="{'active': symbol === 'BTC'}">BTC</span>
                    <span @click="symbol = 'ETH'" :class="{'active': symbol === 'ETH'}">ETH</span>
                    <span @click="symbol = 'BCH'" :class="{'active': symbol === 'BCH'}">BCH</span>
                    <span @click="symbol = 'LTC'" :class="{'active': symbol === 'LTC'}">LTC</span>
                </div>
            </div>
            <div class="list">
                <label>{{$t('home.home57')}}<i><img src="../../../assets/img/tc_meus_b@2x.png"></i></label>
                <div>
                    <span @click="state = 0" :class="{'active': state === 0}">{{$t('home.home59')}}</span>
                    <span @click="state = 1" :class="{'active': state === 1}">{{$t('home.home60')}}</span>
                    <span @click="state = 2" :class="{'active': state === 2}">{{$t('home.home61')}}</span>
                </div>
            </div>
            <div class="list">
                <label>{{$t('home.home58')}}<i><img src="../../../assets/img/tc_meus_b@2x.png"></i></label>
                <div>
                    <span @click="time = 0" :class="{'active': time === 0}">{{$t('home.home59')}}</span>
                    <span @click="time = 1" :class="{'active': time === 1}">{{$t('home.home60')}}</span>
                    <span @click="time = 2" :class="{'active': time === 2}">{{$t('home.home61')}}</span>
                </div>
            </div>
        </div>
        <mt-tab-container v-model="selected">
            <mt-tab-container-item id="tab1">
                <ul>
                    <li></li>
                </ul>
                <div class="no_data">
                    <img src="../../../assets/img/noData.jpg">
                    <p>{{$t('home.home65')}}</p>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="tab2">
                <ul>
                    <li></li>
                </ul>
                <div class="no_data">
                    <img src="../../../assets/img/noData.jpg">
                    <p>{{$t('home.home65')}}</p>
                </div>
            </mt-tab-container-item>
        </mt-tab-container>
    </div>
</template>

<script>
    import loading from '@/components/common/loading'
    import noData from '@/components/common/noData'
    import noMoreData from '@/components/common/noMoreData'
    export default {
        name: "history-list",
        components: {
            loading,
            noData,
            noMoreData
        },
        data(){
            return{
                selected: 'tab1',
                symbol: '',
                state: 0,
                time: 0,
            }
        },
        methods:{
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
                    setTimeout(() => {
                        this.depositTopDrop = false
                        this.depositTopLoading = false
                        $('.mint-loadmore-content').css({'transform': 'translate3d(0px, 0px, 0px)'})
                    }, 1000)
                }, () => {
                    setTimeout(() => {
                        this.depositTopDrop = false
                        this.depositTopLoading = false
                        $('.mint-loadmore-content').css({'transform': 'translate3d(0px, 0px, 0px)'})
                    }, 1000)
                }, true)
            },
            loadMore() { // 向下滚动获取更多消息
                this.paramDeposit.page++
            }
        }
    }
</script>

<style scoped lang="less">
    @bgc: #2A2A34;
    @brc: #40403E;
.mint-navbar{
    background: @bgc;
    border-bottom: 0.02rem solid @brc;
    .mint-tab-item{
        color: #c8c8c8;
        border-bottom: 0.04rem solid transparent;
        margin-bottom: -0.02rem;
        .mint-tab-item-label{
            font-size: 0.3rem;
        }
    }
}
.mint-navbar .mint-tab-item.is-selected{
    color: #ffffff;
    border-bottom: 0.04rem solid #00A0E9;
}
    .list_box{
        background: @bgc;
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 0.8rem;
        position: relative;
        .list{
            &>div{
                display: none;
                position: absolute;
                width: 90vw;
                left: 5vw;
                top: 1rem;
                background: @bgc;
                padding: 0.3rem;
                justify-content: left;
                align-items: flex-end;
                border:0.02rem solid @brc;
                flex-wrap: wrap;
                border-radius:0.12rem;
                z-index: 9;
                &:before{
                    position: absolute;
                    content: '';
                    display: block;
                    z-index: 8;
                    width: 0.4rem;
                    height: 0.4rem;
                    background: @bgc;
                    border: 0.02rem solid @brc;
                    border-width: 0.02rem 0.02rem 0 0;
                    top: -0.2rem;
                    transform: rotate(-45deg);
                }
                span{
                    width: 1.82rem;
                    border: 0.02rem solid @brc;
                    height: 0.8rem;
                    flex-shrink: 0;
                    text-align: center;
                    line-height: 0.8rem;
                    margin-bottom: 0.3rem;
                    margin-right: 0.3rem;
                    &:nth-child(3n){
                        margin-right: 0;
                    }
                    &.active{
                        border-color: #00A0E9;
                        color: #00A0E9;
                    }
                }
            }
            &:hover{
                &>div{
                    display: flex;
                }
                &>label{
                    img{
                         transform: rotate(180deg);
                    }
                }
            }
            &>label{
                i{
                    margin-left: 0.1rem;
                    img{
                        width: 0.26rem;
                    }
                }
            }
            &:first-child{
                &>div:before{
                    left: 0.8rem;
                }
            }
            &:nth-child(2){
                &>div:before{
                    left: 3.2rem;
                }
            }
            &:nth-child(3){
                &>div:before{
                    left: 5.6rem;
                }
            }
        }
    }
    .no_data{
        text-align: center;
        img{
            width: 4rem;
            margin-top: 1.6rem;
        }
    }
</style>
