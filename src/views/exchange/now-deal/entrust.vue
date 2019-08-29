<template>
    <section class="entrust-container">
        <div class="navbar">
            <div class="hideOther">
                <mt-switch v-model="hideOtherTrust"></mt-switch>
                <label class="ml10">{{$t('exchange.exchange_hide_trade_pair')}}<!--隐藏其他交易对--></label>
            </div>
            <div>
                <p class="all_repeal" v-tap="{methods:cancalAll}">{{$t('home.all-repeal')}}</p>
            </div>
        </div>
        <div>
            <ul class="trust-list" v-if="cdatas">
                <li v-for="(item, index) in cdatas" :key="index">
                    <column :data="item" :index="index" @del="cancelOrder"></column>
                </li>
            </ul>
            <no-data v-if="!cdatas"></no-data>
        </div>
    </section>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import {MessageBox} from 'mint-ui'
    import market from '@/api/market'
    import cpSwitch from '@/components/switch'
    import NoData from "../../../components/common/noData";
    import Column from "./column";

    export default {
        props: {
            fixedNumber: {
                type: Number,
                default: 8
            },
            baseSymbol: {
                type: String,
                default: ''
            },
            currentSymbol: {
                type: String,
                default: ''
            },
            symbol: {
                type: String,
                default: ''
            },
            mul: {
                type: Function
            },
        },
        components: {
            Column,
            NoData,
            cpSwitch
        },
        data() {
            return {
                cdatas: [],
                hideOtherTrust: false,
                data:[]
            }
        },
        computed: {
            ...mapGetters(['getApiToken']),
        },
        watch: {
            hideOtherTrust(e){
                // let D = JSON.stringify(this.data)
                // this.data= JSON.parse(D)
                if(e){
                    this.cdatas = []
                    this.data.map(res=>{
                        if(res.market === this.symbol){
                            this.cdatas.push(res)
                        }
                    })
                }else{
                    console.log(this.data)
                    this.cdatas = this.data
                }
            }
        },
        created() {
            this.changeLogin()
        },
        methods: {
            ...mapActions(['setEntrustPrices', 'addEvents', 'removeEvents', 'tiggerEvents']),
            changeLogin() {
                if (this.getApiToken) {
                    let data = {
                        current: 1,
                        hideCancelled: 0,
                        history: "0",
                        limit: 100,
                        tp: 0
                    }
                    market.getCurrentEntrustByParams(data, res => {
                        this.cdatas = res.data
                        this.data = res.data
                    })
                } else {
                    this.cdatas = []
                }
            },
            cancelOrder(e) {
                let orderBookId = e.id
                let index = e.i
                if (this.cdatas.length === 0) {
                    return
                }
                if (!this.getApiToken) {
                    return
                }
                market.cancelOrder(orderBookId, () => {
                    this.cdatas.splice(index, 1)
                    Tip({type: 'success', message: this.$t('account.user_center_Successful')})
                }, (msg) => {
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })

            },
            cancalAll() {
                MessageBox({
                    title: this.$t('public0.public242'),
                    message: this.$t('trade_record.trade_record_repeal') + '?',
                    confirmButtonText: this.$t('public0.ok'),
                    cancelButtonText: this.$t('usercontent.user31'),
                    showCancelButton: true
                }).then(action => {
                    if (action === 'confirm') {
                        market.cancelAll(() => {
                            this.cdatas = []
                            Tip({type: 'success', message: this.$t('account.user_center_Successful')}) // 操作成功
                        }, (msg) => {
                            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    @c_gray: #F4F5FA;
    @c_buy: #24C898;
    @c_sell: #F65B69;
    @c_light: #91A4A3;
    @c_board: #B9D0CF;
    @c_btn: #1C9CE3;

    .entrust-container {
        .navbar {
            display: flex;
            justify-content: space-between;
            height: 1.34rem;
            padding: 0.4rem 0.3rem;
            line-height: 0.54rem;
            color: @c_gray;
            background: #2A2A34;
            margin: 0 -0.3rem;

            .navs span {
                margin-right: 0.3rem;

                &.active {
                    font-size: 0.32rem;
                    color: #536866;
                }
            }
        }
    }

    /deep/ .mint-tab-container {
        margin-left: -0.3rem;
        margin-right: -0.3rem;
    }

    .trust-list {
        li {
            padding: 0.25rem 0;

            .title {
                position: relative;

                .buy {
                    color: @c_buy;
                }

                .sell {
                    color: @c_sell;
                }

                .time {
                    color: @c_board;
                    font-size: 0.24rem;
                    transform: scale(0.916);
                    margin-left: 0.1rem;
                }

                .cancel {
                    position: absolute;
                    right: 0;
                    font-size: 0.26rem;
                    color: #247BDE;
                    background-color: @c_gray;
                    padding: 0.06rem 0.12rem;
                    border-radius: 3px;
                }
            }

            .data {
                margin-top: 0.2rem;

                .data-title {
                    display: flex;

                    span {
                        flex: 1;
                        min-width: 0;
                        color: @c_board;
                        font-size: 0.24rem;

                        &:last-of-type {
                            text-align: right;
                        }
                    }
                }

                .data-info {
                    margin-top: 0.2rem;
                    font-size: 0.3rem;
                    display: flex;

                    span {
                        flex: 1;
                        min-width: 0;

                        &:last-of-type {
                            text-align: right;
                        }

                        em {
                            color: @c_board;
                            font-size: 0.24rem;
                            transform: scale(0.916);
                            font-style: normal;
                        }
                    }
                }
            }
        }
    }

    .hideOther {
        display: flex;
        align-items: center;

        label {
            display: inline-block;
            height: 0.54rem;
        }

        .checkbox {
            width: .28rem;
            height: .28rem;
            vertical-align: top;

            input {
                display: none;

                &:checked {
                    + i {
                        background-color: @c_buy;
                        border-color: @c_buy;

                        &::before {
                            border-color: #fff;
                        }
                    }
                }
            }

            i {
                position: relative;
                display: block;
                width: .28rem;
                height: .28rem;
                border: 2px solid @c_board;
                border-radius: 2px;
                margin-top: 0.04rem;
                overflow: hidden;

                &::before {
                    content: "";
                    position: absolute;
                    top: -0.05rem;
                    left: 0.05rem;
                    width: .12rem;
                    height: .22rem;
                    border-width: 0 2px 2px 0;
                    border-style: solid;
                    border-color: transparent;
                    border-radius: 2px;
                    transform: rotate(45deg);
                }
            }
        }
    }

    .all_repeal {
        border: 0.02rem solid @c_btn;
        color: @c_btn;
        padding: 0 0.3rem;
    }
</style>
