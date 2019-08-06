<template>
<div class="page">
    <top-back>{{$t('home.home16')}}</top-back>
    <div class="page-main">
        <div class="cont">
            <img :src="imgSrc[getUserInfo.kycState]"/>
            <div v-if="getUserInfo.kycState === -1">
                <p class="f-c-green">{{$t('home.kyc-ing')}}</p>
                <span>{{$t('home.kyc-ing-p')}}</span>
            </div>
            <div v-if="getUserInfo.kycState === 0">
                <p>{{$t('home.no-kyc')}}</p>
                <span @click="submitKYC()" style="cursor: pointer" v-html="$t('home.no-kyc-p')"></span>
            </div>
            <div v-if="getUserInfo.kycState === 1">
                <p class="f-c-green">{{$t('home.kyc')}}</p>
                <span>{{$t('home.kyc-p')}}</span>
            </div>
            <div v-if="getUserInfo.kycState === -2 || getUserInfo.kycState === -3">
                <p class="f-c-danger">{{$t('home.re-kyc')}}</p>
                <span @click="submitKYC()"  style="cursor: pointer"  v-html="$t('home.re-kyc-p')"></span>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import user from '../../../api/user'
    export default {
        data(){
            return{
                // 0未通过，1已通过，-1审核中，-2错误，-3拒绝
                imgSrc: {
                    '0': require('../../../assets/img/authentication01.png'),
                    '1': require('../../../assets/img/authentication03.png'),
                    '-1': require('../../../assets/img/authentication02.png'),
                    '-2': require('../../../assets/img/authentication04.png'),
                    '-3': require('../../../assets/img/authentication04.png'),
                }
            }
        },
        computed:{
            ...mapGetters(['getUserInfo']),
        },
        created() {

        },
        methods:{
            submitKYC(){
                user.kyc(res=>{
                    this.$router.push({name:'kyc-form',params:{url: res.data.redirect_url}})
                },msg=>{
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            }
        }
    }
</script>

<style scoped lang="less">
.cont{
    text-align: center;
    margin-top: 1.2rem;
    div{
        p{
            margin: 0.35rem auto;
            font-size: 0.3rem;
        }
        .f-c-green{
            color: #13CE66;
        }
        .f-c-danger{
            color: #e74c3c;
        }
        span{
            color: #c8c8c8;
            font-size: 0.22rem;
            line-height: 0.4rem;
        }
    }
    img{
        width:4rem;
    }
}
</style>
