<template>
    <div class="cont" v-if="show===1">
        <span class="leftTit"><img src="../../../../icon.png"/>{{$t('public0.public212')}}</span>
        <p v-if="phone === 'ios'">
            <a :href="url.appleUrl" target="_blank" class="ios">
                <img src="../../../assets/img/appleApp.png"/>
            </a>
        </p>
        <p v-else>
            <a :href="url.androidUrl" target="_blank">
                <img src="../../../assets/img/googleApp.png"/>
            </a>
            <a :href="url.androidPath" target="_blank">
                <img src="../../../assets/img/androidApp.png"/>
            </a>
        </p>
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
            // download(){
            //     let _url
            //     if(this.phone === 'ios'){
            //         _url=this.url.appleUrl
            //     }else{
            //         _url=this.url.androidUrl
            //     }
            //     return _url
            // }
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
                    console.log(res)
                })
            },
        }

    }
</script>

<style scoped lang="less">
.cont{
    background: #ffffff;
    height: 1.2rem;
    line-height: 1rem;
    padding: 0.1rem 0.3rem;
    position: relative;
    color: #333333;
    font-size: 0.28rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .leftTit{
        display: flex;
        align-items: center;
        img{
            width: 0.7rem;
            height: 0.7rem;
            margin-right: 0.1rem;
            border-radius:0.1rem;
        }
    }
    p{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-right: 0.6rem;
        a{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.2rem;
            height: 0.7rem;
            background: #F6F6F6;
            border-radius:0.1rem;
            margin-left: 0.2rem;
            img{
                width: 0.4rem;
            }
        }
        .ios{
            background: #0193D2;
        }
    }
    i{
        position: absolute;
        display: inline-block;
        width: 0.8rem;
        height: 1.2rem;
        text-align: center;
        line-height: 1.2rem;
        font-style: normal;
        right: 0;
        top: 0;
        background: url("../../../assets/img/off_blank.png") no-repeat center;
        background-size: 0.18rem;
    }
}
</style>
