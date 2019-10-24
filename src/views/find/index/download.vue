<template>
    <div class="cont" v-if="show===1">
        <a :href="download" target="_blank">{{$t('public0.public212')}}</a>
        <i v-tap="{methods:hidden}"></i>
    </div>
</template>

<script>
    import Vue from 'vue'
    import Wallet from "../../../api/wallet"
    import config from "../../../api/config"
    export default {
        name: "download",
        props: ['phone'],
        data() {
            return {
                show: 1,
                system: 0,
                url: {},
            }
        },
        computed:{
            download(){
                let _url
                if(this.phone === 'ios'){
                    _url=this.url.appleUrl
                }else{
                    _url=this.url.androidUrl
                }
                return _url
            }
        },
        created() {
            this.getAddress()
        },
        methods: {
            hidden(){
                this.show =0
            },
            getAddress(){
                Wallet.getLatestVersion((res)=>{
                    this.url = res
                })
            },
        }

    }
</script>

<style scoped lang="less">
.cont{
    background: #3a3a3a;
    height: 0.8rem;
    line-height: 0.6rem;
    text-align: center;
    padding: 0.1rem 0.6rem;
    position: relative;
    a{
        display: block;
        border: 0.02rem dashed #1ac27f;
    }
    i{
        position: absolute;
        display: inline-block;
        width: 0.6rem;
        height: 0.8rem;
        background: url("../../../assets/img/off.png") center no-repeat;
        background-size: 0.2rem;
        right: 0;
        top: 0;
    }
}
</style>
