<template>
    <div class="page">
        <top-back>
            {{$t('trade_record.history_entrust')}}
        </top-back>
        <div class="page-main">
            <deal :currentSymbol="currentSymbol"
                  :baseSymbol="baseSymbol"
                  :symbol="symbol"></deal>
        </div>
    </div>
</template>

<script>
    import Deal from "./history-deal/deal";

    export default {
        name: "now-deal",
        components: {Deal},
        data() {
            return {
                currentSymbol: null,
                baseSymbol: null,
                symbol: null,
            }
        },
        created() {
            let params = this.$route.params
            this.currentSymbol = params.currentSymbol
            this.baseSymbol = params.baseSymbol
            this.symbol = params.symbol
            console.log(params)
        }
    }
</script>

<style scoped lang="less">
    .right {
        font-size: 0.24rem;
        color: #8C8CA1;
    }
</style>
