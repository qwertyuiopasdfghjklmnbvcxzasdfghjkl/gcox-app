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
                <label>{{$t('home.home56')}}<i><img src="../../../../assets/img/tc_meus_b@2x.png"/></i></label>
                <div>
                    <span @click="symbol = ''" :class="{'active': !symbol}">{{$t('home.home59')}}</span>
                    <span @click="symbol = 'BTC'" :class="{'active': symbol === 'BTC'}">BTC</span>
                    <span @click="symbol = 'ETH'" :class="{'active': symbol === 'ETH'}">ETH</span>
                    <span @click="symbol = 'BCH'" :class="{'active': symbol === 'BCH'}">BCH</span>
                    <span @click="symbol = 'LTC'" :class="{'active': symbol === 'LTC'}">LTC</span>
                </div>
            </div>
            <div class="list">
                <label>{{$t('home.home57')}}<i><img src="../../../../assets/img/tc_meus_b@2x.png"/></i></label>
                <div>
                    <span @click="state = 0" :class="{'active': state === 0}">{{$t('home.home59')}}</span>
                    <span @click="state = 1" :class="{'active': state === 1}">{{$t('home.home60')}}</span>
                    <span @click="state = 2" :class="{'active': state === 2}">{{$t('home.home61')}}</span>
                </div>
            </div>
            <div class="list">
                <label>{{$t('home.home58')}}<i><img src="../../../../assets/img/tc_meus_b@2x.png"/></i></label>
                <div>
                    <span @click="time = 0" :class="{'active': time === 0}">{{$t('home.home59')}}</span>
                    <span @click="time = 1" :class="{'active': time === 1}">{{$t('home.home60')}}</span>
                    <span @click="time = 2" :class="{'active': time === 2}">{{$t('home.home61')}}</span>
                </div>
            </div>
        </div>
        <mt-tab-container v-model="selected">
            <mt-tab-container-item id="tab1">
                <div class="loadmore-wapper">
                    <mt-loadmore
                            :top-method="loadTop"
                            :bottom-method="loadBottom"
                            :bottom-all-loaded="allLoaded"
                            ref="loadmore">
                        <ul class="tab_list">
                            <li v-for="item in list">
                                <div>
                                    <h4><span>{{item.symbol}}</span><span>{{item.amount}}</span></h4>
                                    <p>{{new Date(item.updatedAt).format()}}</p>
                                </div>
                                <p>{{getRechargeState(item.status).value}}</p>
                            </li>
                        </ul>
                        <noMoreData v-if="noMoreData"/>
                        <noData v-if="noData"/>
                    </mt-loadmore>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="tab2">
                <div class="loadmore-wapper">
                    <mt-loadmore
                            :top-method="loadWithdrawalTop"
                            :bottom-method="loadWithdrawalBottom"
                            :bottom-all-loaded="allWithdrawalLoaded"
                            ref="loadmoreWithdrawal">
                        <ul class="tab_list">
                            <li v-for="item in listWithdrawal">
                                <div>
                                    <h4><span>{{item.symbol}}</span><span>{{item.amount}}</span></h4>
                                    <p>{{new Date(item.updatedAt).format()}}</p>
                                </div>
                                <p>{{getWithdrawalState(item.status).value}}</p>
                            </li>
                        </ul>
                        <noMoreData v-if="noMoreDataWithdrawal" :bgColor="'#F7F7F7'"/>
                        <noData v-if="noDataWithdrawal"/>
                    </mt-loadmore>
                </div>
            </mt-tab-container-item>
        </mt-tab-container>
    </div>
</template>

<script>
    import loading from '@/components/common/loading'
    import noData from '@/components/common/noData'
    import noMoreData from '@/components/common/noMoreData'
    import wallet from '../../../../api/wallet'

    export default {
        name: "history-list",
        components: {
            loading,
            noData,
            noMoreData
        },
        data() {
            return {
                selected: 'tab1',
                symbol: '',
                state: 0,
                time: 0,
                allLoaded: false,
                allWithdrawalLoaded: false,
                params: {
                    direction: 1,
                    page: 0,
                    pageSize: 10
                },
                paramsWithdrawal: {
                    direction: 2,
                    page: 1,
                    pageSize: 10
                },
                sport: '',
                sportWithdrawal: '',
                list: [],
                listWithdrawal: [],
                noMoreData: false,
                noMoreDataWithdrawal: false,
                noData: false,
                noDataWithdrawal: false,
            }
        },
        created() {
            this.getWithdrawalList()
        },
        methods: {
            loadBottom() { // 获取下一页
                this.sport = 'bottom'
                this.params.page++;
                this.getList()
                this.allLoaded = true
            },
            getList() {
                wallet.listDepositHistory(this.params, res => {
                    if (this.sport === 'bottom') { // 加载更多数据
                        this.allLoaded = false
                        res.data.filter(d => {
                            this.list.push(d)
                        })
                        this.$refs.loadmore.onBottomLoaded();
                        if (this.list.length >= res.total) { // 没有更多数据
                            this.noMoreData = true
                            this.allLoaded = true
                        }
                    } else if (this.sport === 'top') { // 下拉刷新
                        this.list = res.data
                        this.$refs.loadmore.onTopLoaded();
                    } else {
                        this.list = res.data
                    }
                    this.noData = !this.list.length
                }, msg => {
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
            loadTop() { // 刷新
                this.sport = 'top';
                this.params.page = 1;
                this.getList()
            },

            loadWithdrawalBottom() { // 获取下一页
                this.sportWithdrawal = 'bottom'
                this.paramsWithdrawal.page++;
                this.getWithdrawalList()
                this.allWithdrawalLoaded = true
            },
            getWithdrawalList() {
                wallet.listDepositHistory(this.paramsWithdrawal, res => {
                    if (this.sportWithdrawal === 'bottom') { // 加载更多数据
                        this.allWithdrawalLoaded = false
                        res.data.filter(d => {
                            this.listWithdrawal.push(d)
                        })
                        this.$refs.loadmoreWithdrawal.onBottomLoaded();
                        if (this.listWithdrawal.length >= res.total) { // 没有更多数据
                            this.noMoreDataWithdrawal = true
                            this.allWithdrawalLoaded = true
                        }
                    } else if (this.sportWithdrawal === 'top') { // 下拉刷新
                        this.listWithdrawal = res.data
                        this.$refs.loadmoreWithdrawal.onTopLoaded();
                    } else {
                        this.listWithdrawal = res.data
                    }
                    this.noDataWithdrawal = !this.listWithdrawal.length
                }, msg => {
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
            loadWithdrawalTop() { // 刷新
                this.sportWithdrawal = 'top';
                this.paramsWithdrawal.page = 1;
                this.getWithdrawalList()
            },


            getRechargeState(state) { // 获取充值状态
                if (state === 1) {
                    return {
                        className: 'underway',
                        value: this.$t('account.user_center_history_status_wait') // 等待中
                    }
                } else if (state === 2) {
                    return {
                        className: 'success',
                        value: this.$t('account.user_center_history_status_success') // 成功
                    }
                } else {
                    return {
                        className: null,
                        value: null
                    }
                }
            },
            getWithdrawalState(state) { // 获取提现状态
                switch (state) {
                    case 1:
                        return {
                            className: 'underway',
                            value: this.$t('account.user_center_history_status_review') // 审核中
                        }
                    case 2:
                    case 3:
                        return {
                            className: 'underway',
                            value: this.$t('account.user_center_history_status_withdrawal') // 提现中
                        }
                    case 4:
                        return {
                            className: 'fail',
                            value: this.$t('account.user_center_history_status_repeal') // 已撤销
                        }
                    case 5:
                        return {
                            className: 'fail',
                            value: this.$t('account.user_center_history_status_fail') // 失败
                        }
                    case 6:
                        return {
                            className: 'success',
                            value: this.$t('account.user_center_history_status_complete') // 已完成
                        }
                    default:
                        return {
                            className: null,
                            value: null
                        }
                }
            },
        }
    }
</script>

<style scoped lang="less">
    @bgc: #2A2A34;
    @brc: #40403E;
    .mint-navbar {
        background: @bgc;
        border-bottom: 0.02rem solid @brc;

        .mint-tab-item {
            color: #c8c8c8;
            border-bottom: 0.04rem solid transparent;
            margin-bottom: -0.02rem;

            .mint-tab-item-label {
                font-size: 0.3rem;
            }
        }
    }

    .mint-navbar .mint-tab-item.is-selected {
        color: #ffffff;
        border-bottom: 0.04rem solid #00A0E9;
    }

    .list_box {
        background: @bgc;
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 0.8rem;
        position: relative;

        .list {
            & > div {
                display: none;
                position: absolute;
                width: 90vw;
                left: 5vw;
                top: 1rem;
                background: @bgc;
                padding: 0.3rem;
                justify-content: left;
                align-items: flex-end;
                border: 0.02rem solid @brc;
                flex-wrap: wrap;
                border-radius: 0.12rem;
                z-index: 9;

                &:before {
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

                span {
                    width: 1.82rem;
                    border: 0.02rem solid @brc;
                    height: 0.8rem;
                    flex-shrink: 0;
                    text-align: center;
                    line-height: 0.8rem;
                    margin-bottom: 0.3rem;
                    margin-right: 0.3rem;

                    &:nth-child(3n) {
                        margin-right: 0;
                    }

                    &.active {
                        border-color: #00A0E9;
                        color: #00A0E9;
                    }
                }
            }

            &:hover {
                & > div {
                    display: flex;
                }

                & > label {
                    img {
                        transform: rotate(180deg);
                    }
                }
            }

            & > label {
                i {
                    margin-left: 0.1rem;

                    img {
                        width: 0.26rem;
                    }
                }
            }

            &:first-child {
                & > div:before {
                    left: 0.8rem;
                }
            }

            &:nth-child(2) {
                & > div:before {
                    left: 3.2rem;
                }
            }

            &:nth-child(3) {
                & > div:before {
                    left: 5.6rem;
                }
            }
        }
    }

    .no_data {
        text-align: center;

        img {
            width: 4rem;
            margin-top: 1.6rem;
        }
    }

    .loadmore-wapper {
        height: calc(100vh - 2.7rem);
        overflow-y: auto;
    }

    .tab_list {
        padding: 0 .3rem;
        scroll-padding: 0;
        scroll-snap-margin: 0;

        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.3rem 0;
            border-bottom: 0.02rem solid #434248;

            div {
                h4 {
                    font-size: 0.28rem;

                    span {
                        padding-right: 0.34rem;
                    }
                }

                p {
                    font-size: 0.24rem;
                    margin-top: 0.2rem;
                }
            }

            p {
                color: #C1C5D2;
            }
        }
    }
</style>
