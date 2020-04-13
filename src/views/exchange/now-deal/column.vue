<template>
    <div class="cont">
        <div class="top">
            <div>
                <p>
                    <span :class="[data.direction==1?'buy':'sell']">{{getPrice(data.price) }}
                    {{data.direction==1 ? $t('exchange.exchange_buy') : $t('exchange.exchange_sell')}}</span>
                    <span>  {{data.direction==1?`${data.toSymbol} / ${data.fromSymbol}`:`${data.fromSymbol} / ${data.toSymbol}`}}</span>
                </p>
                <p class="time">{{new Date(Number(data.createdAt)).format()}}</p>
            </div>

            <p v-if="form" class="f24">{{getStatue(data)}}</p>
            <span v-else class="cancel" @click="cancelOrder(data.orderBookId)">
                    {{$t('exchange.exchange_revoked')}}<!--撤销-->
                </span>
        </div>

        <div class="data">
            <div class="ear">
                <!--<div class="ear-cont">-->
                    <!--<div class="ear-left">-->
                        <!--<div class="border-right"-->
                             <!--:class="[data.direction==1?'buy':'sell']"-->
                             <!--:style="{transform: `rotate(${leftRotate}deg)`}">-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<div class="ear-right">-->
                        <!--<div class="border-left"-->
                             <!--:class="[data.direction==1?'buy':'sell']"-->
                             <!--:style="{transform: `rotate(${rightRotate}deg)`}"></div>-->
                    <!--</div>-->
                    <!--<p :class="[data.direction==1?'buy':'sell']">{{value}}%</p>-->
                <!--</div>-->
                <p>{{$t('exchange.entrust_price')}}({{data.fromSymbol}})</p>
                <p>{{util.removeEndZero(toFixed(data.price))}}</p>
            </div>
            <div class="data-title">
                <p>{{$t('exchange.exchange_Transaction_volume')}}<!--成交量--> / {{$t('exchange.entrust_total')}} ({{data.toSymbol}})<!--委托总量--></p>
                <p>{{util.removeEndZero(toFixed(data.finishedAmount))}} / {{util.removeEndZero(toFixed(data.totalAmount))}}</p>
            </div>
            <div class="btn">
                <p>{{$t('home.home_volume')}}<!--成交额-->({{data.fromSymbol}}) </p>
                <p>{{util.removeEndZero(toFixed(data.averagePrice * data.finishedAmount))}}</p>
                <!--<span v-if="form">{{getStatue(data)}}</span>-->
                <!--<span v-else class="cancel" @click="cancelOrder(data.orderBookId)">-->
                    <!--{{$t('exchange.exchange_revoked')}}&lt;!&ndash;撤销&ndash;&gt;-->
                <!--</span>-->
            </div>
        </div>
    </div>
</template>

<script>

    import numUtils from '@/assets/js/numberUtils'
    import utils from '../../../assets/js/utils'

    export default {
        props: ['data','index','form'],
        data() {
            return {
                rightRotate: 45,
                value: 0,
                fixedNumber: 8,
                util: utils
            }
        },
        computed: {
            leftRotate() {
                let roatte = (this.toFixed(this.data.finishedAmount) / this.toFixed(this.data.totalAmount)) * 100
                this.value = Number(this.toFixed(roatte,2));
                if (roatte <= 50) {
                    return (roatte * 3.6) + 45
                } else {
                    this.rightRotate = (roatte - 50) * 3.6 + 45
                    return 180 + 45
                }
            }
        },
        methods: {
            getType(type) {
                if (numUtils.BN(type).equals(numUtils.BN(1))) {
                    return this.$t('exchange.exchange_buys') // 买
                } else if (numUtils.BN(type).equals(numUtils.BN(2))) {
                    return this.$t('exchange.exchange_sells') // 卖
                }
            },
            getPrice(price) {
                if (numUtils.BN(price).equals(numUtils.BN(-1))) {
                    return this.$t('exchange.exchange_market_price') // 市价
                } else {
                    return this.$t('home.limit') // 限价
                }
            },
            cancelOrder(orderBookId) {
                let data = {
                    i: this.index,
                    id: orderBookId
                }
               this.$emit('del',data)
            },
            toFixed(value, fixed) {
                return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixedNumber : fixed, 1)
            },
            getStatue (item) { // 状态
                let state = Number(item.state)
                if (state === 0) {
                    if (numUtils.BN(item.finishedAmount).gt(0)) {
                        return this.$t('exchange.exchange_partial_transaction') // 部分成交
                    }
                    return this.$t('exchange.exchange_cancelled') // 已撤销
                } else if (state === 2) {
                    return this.$t('exchange.exchange_partial_transaction') // 部分成交
                } else if (state === 3 || state === 4) {
                    return this.$t('exchange.exchange_complete_transaction') // 完全成交
                } else {
                    return '--'
                }
            },
        }
    }
</script>

<style scoped lang="less">
    @c_f: #969EAD;
    .cont {
        background: #2A2A34;
        margin-top: 0.2rem;
        .top {
            display: flex;
            border-bottom: 0.02rem solid #353544;
            padding: 0.2rem 0.3rem;
            align-items: center;
            justify-content: space-between;

            span{
                font-size: 0.3rem;
            }
            .time{
                font-size: 0.24rem;
                color: @c_f;
                padding-top: 0.15rem;
            }
            .cancel{
                font-size: 0.28rem;
                color: #1C9CE3;
                height: 0.6rem;
                line-height: 0.6rem;
            }
        }

        .buy {
            color: #439B64;
        }

        .sell {
            color: #D65538;
        }

        .data {
            display: flex;
            align-items: center;
            padding: 0.3rem;
            justify-content: space-between;

            .ear {
                margin-right: 0.2rem;
                width: 2.2rem;
            }
            div{
                font-size: 0.24rem;
                &>p:first-child{
                    color: #969EAD;
                    margin-bottom: 0.2rem;
                }
            }

            .ear-cont {



                .ear-left {
                    left: -0.06rem;
                    top: -0.06rem;
                }

                .ear-right {
                    right: -0.06rem;
                    top: -0.06rem;
                }
                p{
                    text-align: center;
                    padding-top: 0.24rem;
                    font-size: 0.2rem;
                }
            }
        }
        .data-title{

        }
        .btn{
            flex-grow: 1;
            text-align: right;
            .cancel{
                padding: 0.04rem 0.2rem;
                border: 0.02rem solid #1C9CE3;
                color: #1C9CE3;
                margin-top: 0.2rem;
                display: inline-block;
            }
        }
    }
</style>
