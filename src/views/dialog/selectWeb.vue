<template>
    <div class="select">
        <!--<h4 class="title">{{vm.$t('user.area_chioce')}}</h4>-->
        <h2>{{vm.$t('user.goto_sg_site')}}</h2>
        <small>{{vm.$t('user.curr_pos_sg')}}</small>
        <p>{{vm.$t('user.goto_desc_sg')}}</p>
        <p class="btn next" @click="sg()">{{vm.$t('shop.continue')}}</p>
        <p class="btn" @click="com() ">{{vm.$t('user.curr_stay')}}</p>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "selectWeb",
        data() {
            const vm = window.vm
            return {
                vm: vm
            }
        },
        computed:{
            ...mapGetters(['getSysParams']),
        },
        watch:{
            getSysParams(e) {
                let status = e['maintain']['value']
                if( status === '1'){
                    this.$emit('removeDialog')
                }
            }
        },
        created() {

        },
        methods: {
            sg(){
                window.open('https://m.gcox.sg','_self')
            },
            com(){
                this.$emit('removeDialog')
            }
        }
    }
</script>

<style scoped lang="less">
.select{
    position: fixed;
    width: 90vw;
    height: 5.6rem;
    background: #ffffff;
    top: 50%;
    margin-top: -3rem;
    left: 5vw;
    border-radius:0.1rem;
    text-align: center;
    font-size: 0.28rem;
    padding-top: 0.3rem;
    p{
        color: #999999;
        margin-top: 0.2rem;
        padding: 0 0.3rem;
    }
    .title{
        margin: 0;
        padding: 0.3rem;
        text-align: center;
        border-bottom: 0.02rem solid #b6bbbf;
        color: #222222;
        font-size: 0.3rem;
    }
    h2{
        font-size: 0.34rem;
        font-weight: bold;
        color: #222222;
        margin-top: 0.3rem;
    }
    small{
        color: #999999;
        margin-top: 0.2rem;
        display: block;
    }
    .btn{
        display: block;
        text-align: center;
        margin: 0 0.3rem;
        color: #222222;
        margin-top: 0.3rem;
        border-radius:0.1rem;
        height: 1rem;
        line-height: 1rem;
    }
    .next{
        background: #00a0e9;
        color: #ffffff;
    }
}
</style>
