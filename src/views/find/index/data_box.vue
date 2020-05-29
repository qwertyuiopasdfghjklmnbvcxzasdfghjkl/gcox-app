<template>
    <div class="data_box">
        <div class="cont">
            <ul>
                <li v-for="item in list" @click="goToExchangePage(item)">
                    <p class="tit">
                        <span class="f28 ft-c-white">{{item.currencySymbol}}</span>
                        <span class="ft-c-lightGray f24">/{{item.baseSymbol}}</span>
                    </p>
                    <p class="nub f32" :class="[percent(item).css]">{{percentToMoney(item)}}</p>
                    <span class="f24 fmt" :class="[percent(item).css]">
                        <img :src="percent(item).css === 'c-orange'? r_d:g_u">{{percent(item).percent}}%
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import numUtils from '@/assets/js/numberUtils'
    import marketApi from '@/api/market'
    import utils from '../../../assets/js/utils'

    export default {
        name: "data_box",
        data(){
            return {
                r_d: require('../../../assets/img/red_down.png'),
                g_u: require('../../../assets/img/green_up.png'),
            }
        },
        computed: {
            ...mapGetters(['getMarketList']),
            list(){
                let d = JSON.stringify(this.getMarketList)
                let data = JSON.parse(d)
                let datas = (data || []).sort((item1, item2) => {
                    let m1 = numUtils.BN(item1.createdAt)
                    let m2 = numUtils.BN(item2.createdAt)
                    return (m1.lt(m2) ? -1 : 1)
                })
                return datas
            }
        },
        methods: {
            ...mapActions(['setLast24h']),
            percent (item) {
                if (numUtils.BN(item.openingPrice).equals(0)) {
                    return {percent: '0.00'}
                } else if (item.openingPrice && item.lastPrice) {
                    var percent = numUtils.BN(item.change24h).div(item.openingPrice).mul(100)
                    if (percent.equals(0)) {
                        return {percent: '0.00'}
                    }
                    return {
                        css: percent.gt(0) ? 'c-green' : 'c-orange',
                        percent: percent.gt(0)? '+'+percent.toFixed(2): ''+percent.toFixed(2)
                    }
                } else {
                    return {percent: '0.00'}
                }
            },
            toFixed (v1, fixed) {
                return numUtils.BN(v1).toFixed(fixed !== undefined ? fixed : 8)
            },
            goToExchangePage(item) {
                marketApi.get24hPrice({symbol: `${item.currencySymbol}${item.baseSymbol}`}, (data) => {
                    this.setLast24h(data)
                    this.$router.push({name: 'exchange', params: {market: `${item.currencySymbol}_${item.baseSymbol}`}})
                })
            },
            percentToMoney(item){
                return utils.removeEndZero(numUtils.BN(item.lastPrice).toFixed(item.accuracy)).toMoney()
            }
        }
    }
</script>

<style scoped lang="less">
.data_box{
    width: 100vw;
    height: 2.08rem;
    overflow: hidden;
    .cont{
        height: 2.2rem;
        overflow: hidden;
        overflow-x: auto;
        ul{
            padding: 0 0.3rem;
            margin: 0;
            display: flex;
            justify-content: left;
            align-items: flex-start;
            white-space: nowrap;
            li{
                padding: 0;
                margin: 0 0.14rem 0 0;
                height: 2.08rem;
                width: 2.14rem;
                background: #2A2A34;
                border-radius: 0.16rem;
                display: inline-block;
                flex-shrink: 0;
                text-align: center;
                .tit{
                    margin-top: 0.24rem;
                }
                .nub{
                    margin-top: 0.28rem;
                    color: #20C26D;
                    line-height: 0.32rem;
                }
                .fmt{
                    display: block;
                    margin-top: 0.32rem;
                    color: #20C26D;
                    img{
                        width: 0.28rem;
                        height: 0.28rem;
                        margin-right: 0.15rem;
                        vertical-align: middle;
                    }
                }
                .c-green{
                    color: #20C26D;
                }
                .c-orange{
                      color: #E14B26;
                  }
            }
        }
    }
}
</style>
