<template>
    <div class="page">
        <top-back>{{$t('home.home32')}}</top-back>
        <div class="cont">
            <span>{{$t('home.home08')}}：{{email}}</span>
            <label class="reget">
                <mt-button type="primary" class="circle unlock"
                           size="large"v-tap="{methods:reGet}">{{$t('home.home31')}}</mt-button>
            </label>

        </div>
    </div>
</template>

<script>
    import userApi from '@/api/user'
    export default {
        name: "emailVerify",
        data(){
            return {
                email: null,
            }
        },
        created(){
            this.email = this.$route.params.email || ''
            console.log(this.$router,this.$route.params.email)
        },
        methods:{
            reGet(){
                let data = {
                    email: this.email,
                    redirectUrl: ''
                };
                userApi.resend(data, ()=>{
                        Tip({
                            type: 'success',
                            message: this.$t('home.home33')
                        })
                    },
                    (msg)=>{
                        Tip({
                            type: 'danger',
                            message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)
                        })
                    })
            },
        }
    }
</script>

<style scoped lang="less">
.cont{
    padding: 0.3rem;
    &>span{
        font-size: 0.24rem;
        color: #A7ACB9;
        padding: 0.2rem 0;
    }
    .reget{
        display: block;
        margin: 1rem auto;
    }
}
</style>
