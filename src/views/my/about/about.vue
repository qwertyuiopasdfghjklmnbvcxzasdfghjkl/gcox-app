<template>
    <div class="page">
        <top-back>{{$t('home.about-gcox')}}</top-back>
        <div class="page-main">
            <div class="logo">
                <img src="../../../assets/img/LOGo@3x.png"/>
                <p>GCOX<span>  {{v}}</span></p>
            </div>
            <router-link :to="{name: 'about-bar'}" class="bar">{{$t('account.user_center_contact')}}</router-link>
            <div class="foot">
                <p>GCOX</p>
                <small>{{$t('home.foot')}}</small>
            </div>
        </div>
    </div>
</template>

<script>
    export default {

        data() {
            return {
                v: 'v1.0.0'
            }
        }
    }
</script>

<style scoped lang="less">
    .page-main {
        padding-left: 0;
        padding-right: 0;
    }
    .logo{
        text-align: center;
        margin-top: 1rem;
        margin-bottom: 0.8rem;
        img{
            height: 0.9rem;
        }
        p{
            padding: 0.3rem;
        }
    }
    .bar{
        background: #2A2A34;
        display: block;
        height: 0.9rem;
        line-height: 0.9rem;
        width: 100%;
        text-indent: 0.3rem;
    }
    .foot{
        text-align: center;
        position: fixed;
        bottom: 0.4rem;
        left: 0;
        width: 100vw;
        color: #787b7b;
        p{
            line-height: 0.6rem;
        }
        small{
            line-height: 0.4rem;
            font-size: 0.2rem;
        }
    }
</style>
