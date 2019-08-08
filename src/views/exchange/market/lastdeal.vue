<template>
    <div class="latest-deal">
        <div @click="switchLastDeal"><p>{{$t('exchange.exchange_trade_history')}}<!--最新成交--></p></div>
        <div class="header">
            <span>{{$t('exchange.exchange_date')}}<!--编号--></span>
            <span>{{$t('exchange.exchange_price')}}<!--价格-->({{baseSymbol}})</span>
            <span>{{$t('exchange.exchange_amount')}}<!--数量-->({{currentSymbol}})</span>
        </div>
        <div>
            <ul class="deal-list">
                <li v-for="(item, index) in datas" :key="index" :class="{buy:item.direction==1}"
                    @click="clickChangeValue(item)">
                    <span>{{formatDate(item.createdAt)}}</span>
                    <span>{{toFixed(item.price)}}</span>
                    <span>{{toFixed(item.amount,accuracy.quantityAccu)}}</span>
                </li>
            </ul>
        </div>
        <div></div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import numUtils from '@/assets/js/numberUtils'
    import market from '@/api/market'

    export default {
        props: {
            value: null,
            accuracy: {
                type: Object
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
                type: String
            }
        },
        data() {
            return {
                showLoading: true,
                datas: []
            }
        },
        computed: {
            ...mapGetters(['getApiToken'])
        },
        watch: {
            getApiToken() {
                this.changeLogin()
            },
            symbol() {
                this.changeLogin()
            },
            datas() {
                if (this.datas.length) {
                    this.tiggerEvents({
                        name: 'depthEvent',
                        params: {
                            type: 'direction',
                            value: this.datas[0].direction
                        }
                    })
                }
            }
        },
        created() {
            this.$nextTick(() => {
                this.addEvents({
                    name: 'lastdealEvent',
                    fun: this.lastdealEvent
                })
            })
            this.changeLogin()
        },
        beforeDestroy() {
            this.removeEvents('lastdealEvent')
        },
        methods: {
            ...mapActions(['setEntrustNewPrice', 'addEvents', 'removeEvents', 'tiggerEvents']),
            switchLastDeal() {
                this.$emit('input', !this.value)
            },
            lastdealEvent(res) {
                if (res && res.type === 'updateData') {
                    this.datas = res.data
                }
            },
            clickChangeValue(item) {
                this.setEntrustNewPrice(item.price)
            },
            changeLogin() {
                // 最近交易记录
                market.getNearestTradeRecords(this.symbol, (res) => {
                    this.datas = res
                }, (msg) => {
                    console.log(msg)
                })
            },
            toFixed(price, fixed) {
                return numUtils.BN(price).toFixed(fixed || this.accuracy.fixedNumber)
            },
            formatDate(date) {
                return (new Date(Number(date))).format('HH:mm:ss')
            }
        }
    }
</script>

<style lang="less" scoped>
    .latest-deal {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .latest-deal .header {
        display: flex;
        justify-content: space-between;
        margin-top: 0.2rem;
    }

    .latest-deal .header > span {
        height: 0.4rem;
        line-height: 0.4rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .latest-deal > div:nth-of-type(1) {
        flex: 5;
        min-height: 0;
        position: relative;
    }

    .latest-deal > div:nth-of-type(1) p {
        font-size: 0.28rem;
        background: #2A2A34;
        padding: 0.1rem 0.3rem;
    }

    .latest-deal > div:nth-of-type(2) {
        flex: 4;
        min-height: 0;
    }

    .latest-deal > div:nth-of-type(2) span {
        display: inline-block;
        width: 36%;
        color: #8089A3;
        font-size: 0.26rem;
    }

    .latest-deal > div:nth-of-type(2) span:first-of-type {
        width: 24%;
        padding-left: 0.3rem;
    }

    .latest-deal > div:nth-of-type(2) span:last-of-type {
        text-align: right;
        padding-right: 0.3rem;
    }

    .latest-deal > div:nth-of-type(3) {
        flex: 87;
        min-height: 0;
    }

    .latest-deal > div:nth-of-type(4) {
        flex: 2;
    }

    .latest-deal .deal-list {
        height: 100%;
        overflow-y: auto;
        padding: 0 0.3rem;
    }

    .latest-deal .deal-list li {
        height: 0.6rem;
        line-height: 0.6rem;
    }

    .latest-deal .deal-list li span {
        display: inline-block;
        float: left;
        width: 38%;
        font-size: 0.24rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .latest-deal .deal-list li span:nth-of-type(1) {
        width: 24%;
        color: #ffffff
    }

    .latest-deal .deal-list li span:nth-of-type(2) {
        color: #F65B69;
    }

    .latest-deal .deal-list li span:nth-of-type(3) {
        text-align: right;
    }

    .latest-deal .deal-list li.buy span:nth-of-type(2) {
        color: #24C898;
    }
</style>
