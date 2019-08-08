<template>
<div class="page">
    <top-back>
        {{$t('trade_record.current_entrust')}}
        <span slot="right" class="right"  v-tap="{methods: toHistoryDeal}">{{$t('trade_record.history_entrust')}}</span>
    </top-back>
    <div class="page-main">
        <entrust :currentSymbol="currentSymbol" :baseSymbol="baseSymbol" :symbol="symbol"></entrust>
    </div>
</div>
</template>

<script>
    import Entrust from "./now-deal/entrust";
    export default {
        name: "now-deal",
        components: {Entrust},
        data(){
            return{
                currentSymbol:null,
                baseSymbol:null,
                symbol:null,
            }
        },
        created() {
            let params = this.$route.params
            this.currentSymbol = params.currentSymbol
            this.baseSymbol = params.baseSymbol
            this.symbol = params.symbol
            console.log(params)
        },
        methods:{
            toHistoryDeal() {
                this.$router.push({
                    name: 'history-deal',
                    params: {currentSymbol: this.currentSymbol, baseSymbol: this.baseSymbol, symbol: this.symbol}
                })
            }
        }
    }
</script>

<style scoped lang="less">
.right{
    font-size: 0.24rem;
    color: #8C8CA1;
}
</style>
