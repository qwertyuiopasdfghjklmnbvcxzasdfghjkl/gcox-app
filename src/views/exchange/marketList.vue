<template>
    <div class="market_list">
        <div class="head">
            {{$t('market.select_symbol')}}
        </div>
        <div class="select">
            <span class="star" v-tap="{methods: ()=>{star=true;symbol=''}}">
                <img v-show="star" src="../../assets/img/i_sc@2x.png"/>
                <img v-show="!star" src="../../assets/img/i_nc@2x.png"/>
            </span>
            <ol>
                <li v-for="(item, i) in baseSymbol" :class="{active: item === symbol}"
                    v-tap="{methods: tab, item:item}"><span>{{item}}</span></li>
            </ol>
        </div>

        <label class="search">
            <input v-model="search"/>
        </label>
        <ul class="list">
            <li v-for="data in marketList" v-tap="{methods: change, data:data}">
                <p><b>{{data.currencySymbol}}</b>/<small>{{data.baseSymbol}}</small></p>
                <span :class="percent(data).css">{{data.lastPrice}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import numUtils from '@/assets/js/numberUtils'

    export default {
        name: "marketList",
        data() {
            return {
                symbol: 'USDT',
                search: '',
                star: false
            }
        },
        computed: {
            ...mapGetters(['getMarketList']),
            baseSymbol() {
                let _temp = this.getMarketList || []
                let _list = _temp.map(item => {
                    return item.baseSymbol
                })
                return [...new Set(_list)].sort()
            },
            marketList(){
                let list = []
                let market = this.getMarketList || []
                market.forEach(item=>{
                    item.lastPrice = numUtils.BN(item.lastPrice).toFixed(item.accuracy)
                })
                market.filter(res=>{
                    if(this.star){
                        if(res.collection){
                            let b = res.market.indexOf(this.search.toUpperCase()) !== -1 || res.market.indexOf(this.search.toLowerCase()) !== -1
                            if(b){
                                list.push(res)
                            }
                        }
                    }else{
                        if(this.symbol === res.baseSymbol){
                            let b = res.market.indexOf(this.search.toUpperCase()) !== -1 || res.market.indexOf(this.search.toLowerCase()) !== -1
                            if(b){
                                list.push(res)
                            }
                        }
                    }

                })
                return list
            }
        },
        created() {

        },
        mounted(){
            this.symbol = this.baseSymbol[0]
        },
        methods: {
            tab(e){
                let a = e.item
                this.symbol = a
                this.star = false
            },
            change(e){
                this.$emit('changeMarket',e.data)
                console.log(e)
            },
            percent(item) {
                if (numUtils.BN(item.openingPrice).equals(0)) {
                    return {css: 'c-green'}
                } else if (item.openingPrice && item.lastPrice) {
                    var percent = numUtils.BN(item.change24h).div(item.openingPrice).mul(100)
                    if (percent.equals(0)) {
                        return {css: 'c-green'}
                    }
                    return {
                        css: percent.gt(0) ? 'c-green' : 'c-orange',
                    }
                } else {
                    return {css: 'c-green'}
                }
            },
        }
    }
</script>

<style scoped lang="less">
    .market_list{
        background: #151C2C;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        .head{
            padding: 0.3rem;
            color: #ffffff;
            font-size: 0.32rem;
        }

        .select{
            width: 100%;
            height:0.5rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            .star{
                width: 0.6rem;
                height: .6rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-left: 0.3rem;
                img{
                    width: 0.3rem;
                }
            }
            ol{
                flex: 1;
                overflow-y: auto;
                list-style-type: none;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding: 0 0.3rem;
                li{
                    color: #4B5875;
                    font-size: 0.3rem;
                    padding: 0 0.2rem;
                    line-height: 0.4rem;
                    &.active{
                        background: #0C6AC9;
                        color: #ffffff;
                        border-radius: 0.1rem;
                    }
                }
            }
        }
        .search{
            margin: 0.3rem;
            display: block;
            input{
                border: 0.01rem solid #1F283B;
                border-radius: 0.1rem;
                padding: 0.2rem;
                height: 0.8rem;
                padding-left: 0.8rem;
                width: 100%;
                background: url("../../assets/img/i_search@2x.png") no-repeat 0.2rem 0.2rem;
                background-size: 0.33rem 0.33rem;
                color: #ffffff;
            }
        }
        .list{
            list-style-type: none;
            overflow-x: auto;
            padding-bottom: 0.2rem;
            li{
                display: flex;
                border-top: 0.01rem solid #1F283B;
                padding: 0.3rem;
                align-items: center;
                justify-content: space-between;
                b{
                    color: #ffffff;
                    font-size: 0.32rem;
                }
                small{
                    color: #4B5875;
                    font-size: 0.24rem;
                }
                .c-green{
                    color: #439B64;
                }
                .c-orange{
                    color: #E14B26;
                }
            }
        }
    }
</style>
