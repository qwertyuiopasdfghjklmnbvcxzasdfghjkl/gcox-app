<template>
    <div class="page">
        <top-back>{{$t('home.home34')}}</top-back>
        <div class="page-main">

            <div class="mt35">
                <p class="success" v-if="state">{{$t('home.home35')}}</p>
                <div class="cont">
                    <ui-input :label="$t('home.home08')" v-model="formData.email"></ui-input>
                    <p class="error" v-if="emailError">{{$t('home.home24')}}</p>
                </div>

                <div class="register-content-button mt80">

                    <mt-button class="circle"
                               :class="{'unlock': gtLocked}"
                               type="primary"
                               size="large"
                               v-tap="{methods: updatePwd}">{{$t('public0.ok')}}<!--确定--></mt-button>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import UiInput from "../components/uiInput";
    import userApi from '@/api/user'

    export default {
        name: 'findpwd',
        components: {UiInput},
        data() {
            return {
                emailError: false,
                lock: true,
                state: false,
                formData:{
                    email: null
                }
            }
        },
        computed:{
            gtLocked(){
                return this.formData.email
            }
        },

        created() {

        },
        methods: {
            updatePwd() {
                if(this.lock&&this.gtLocked){
                    this.lock = false;
                    let reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
                    if(reg.test(this.formData.email)){
                        this.emailError = false
                        let data = {
                            email: this.formData.email,
                            redirectUrl: ''
                        }
                        userApi.forgetPwdSendEmail(data, ()=>{
                            this.state = true
                            this.lock = true;
                        },(msg)=>{
                            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                            this.lock = true;
                        })
                    }else{
                        this.emailError = true
                        this.lock = true;
                    }
                }
            },
        }
    }
</script>


<style lang="less" scoped>
    .cont {
        /*margin-top: 0.55rem;*/
        position: relative;

        .error {
            padding-top: 0.2rem;
            color: #ff5e2d;
            font-size: 0.24rem;
        }
    }
    .success{
        color: #1ac27f;
    }

</style>
