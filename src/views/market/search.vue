<template>
<div class="page">
    <div class="search_box">
        <i>
            <img src="../../assets/img/search.png">
        </i>
        <label>
            <input :placeholder="$t('home.home38')" v-model="text" v-focus/>
        </label>
        <span v-tap="{methods:tobanck}">
            {{$t('home.home37')}}
        </span>
    </div>
    <div class="cont">
        <p>{{$t('home.home39')}}</p>
        <ul>
            <li v-for="item in list" v-tap="{methods:goToExchangePage,item}">{{item.currencySymbol}}/{{item.baseSymbol}}</li>
        </ul>
    </div>
</div>
</template>

<script>
    import {mapGetters,mapActions} from 'vuex'
    import marketApi from '@/api/market'
    export default {
        name: "seach",
        data(){
            return{
                text: null,
                list: []
            }
        },
        computed:{
            ...mapGetters(['getMarketList']),
        },
        watch:{
            text(e){
                if(e){
                    this.list.length = 0;
                    (this.getMarketList || []).filter(res=>{
                        if(res.market.toLowerCase().indexOf(e.toLowerCase()) !== -1){
                            this.list.push(res)
                        }
                    })
                }
            }
        },
        methods:{
            ...mapActions(['setLast24h']),
            tobanck(){
                this.$router.push({name: 'market'})
            },
            goToExchangePage(parames) {
                let item = parames.item
                marketApi.get24hPrice({symbol:`${item.currencySymbol}${item.baseSymbol}`},(data)=>{
                    this.setLast24h(data)
                    this.$router.push({name: 'exchange', params: {market: `${item.currencySymbol}_${item.baseSymbol}`}})
                })
            },
        }
    }
</script>

<style scoped lang="less">
.search_box{
    display: flex;
    padding: 0 0.3rem;
    justify-content: space-between;
    align-items: center;
    background: #2A2A34;
    i{
        img{
            width: 0.37rem;
        }
    }
    label{
        flex-shrink: 0;
        flex-grow: 1;
        input{
            width: 100%;
            padding-left: .2rem;
            height: .9rem;
            border: none;
            background: none;
            outline: none;
            color: #ffffff;
            font-size: 0.3rem;
        }
    }
}
    .cont{
        padding: 0.3rem;
        font-size: 0.28rem;
        p{
            font-size: 0.28rem;
        }
        ul{
            margin-top: 0.2rem;
            li{
                line-height: 0.6rem;
            }
        }
    }
</style>
