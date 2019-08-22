<template>
    <div class="page">
        <top-back>{{$t('user.changePassword')}}</top-back>
        <div class="page-main">
            <div class="cont mt55">
                <ui-input
                        :title="$t('exchange.exchange_old_password')"
                        :label="$t('home.oldPW')"
                        :type="showpwd? 'text':'password'"
                        v-model="formData.password"></ui-input>
                <i class="icon_showpwd" :class="{active:showpwd}"
                   v-tap="{methods: ()=>{showpwd = !showpwd}}"></i>
                <p class="error" v-if="!passwordError">{{$t('home.home22')}}</p>
            </div>
            <div class="cont mt55">
                <ui-input
                        :title="$t('account.user_center_new_password')"
                        :label="$t('account.user_center_Please_new_password')"
                        :type="showNewPW? 'text':'password'"
                        v-model="formData.passwordNew"></ui-input>
                <i class="icon_showpwd" :class="{active:showNewPW}"
                   v-tap="{methods: ()=>{showNewPW = !showNewPW}}"></i>
                <p class="error" v-if="!newPasswordError">{{$t('home.home22')}}</p>
            </div>
            <div class="cont mt55">
                <ui-input
                        :title="$t('account.user_center_confirm_password')"
                        :label="$t('account.user_center_Please_confirm_password')"
                        :type="showConfirmPW? 'text':'password'"
                        v-model="formData.passwordConfirm"></ui-input>
                <i class="icon_showpwd" :class="{active:showConfirmPW}"
                   v-tap="{methods: ()=>{showConfirmPW = !showConfirmPW}}"></i>
                <p class="error" v-if="!confirmPasswordError">{{$t('home.home23')}}</p>
            </div>
            <div class="cont mt55" v-if="userInfo.googleAuthEnable === 1">
                <ui-input
                        :title="$t('account.user_center_Google_verification_code')"
                        :label="$t('home.home11')"
                        :type="'tel'"
                        :maxlength="6"
                        v-model="formData.googleCode"></ui-input>
            </div>
            <div class="btn">
                <mt-button type="primary" class="circle" :class="{'unlock': lock}"
                           size="large" v-tap="{methods:submit}">{{$t('public0.submit')}}<!--提交--></mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    import UiInput from "../../../components/uiInput";
    import {mapGetters, mapActions} from 'vuex'
    import user from '../../../api/user'
    import utils from '@/assets/js/utils'

    export default {
        components: {UiInput},
        data() {
            return {
                showpwd: false,
                passwordError: true,
                showNewPW: false,
                newPasswordError: true,
                showConfirmPW: false,
                confirmPasswordError: true,
                formData: {
                    password: null,
                    passwordNew: null,
                    passwordConfirm: null,
                    googleCode: null,
                },
                userInfo: {},
                // lock: false
            }
        },
        computed: {
            ...mapGetters(['getUserInfo']),
            lock() {
                // return (!this.passwordError) && (!this.newPasswordError) && (!this.confirmPasswordError) && this.formData.passwordConfirm
                if(this.userInfo.googleAuthEnable === 1){
                    // let b = this.formData.password || this.formData.passwordNew || this.formData.passwordConfirm
                    // console.log(!b)
                    return this.formData.password && this.formData.passwordNew&&this.formData.passwordConfirm&&this.formData.googleCode
                }else{
                    console.log(!this.passwordError)
                    return this.formData.password && this.formData.passwordNew&&this.formData.passwordConfirm
                }
            }
        },
        watch: {
            'formData.password'(e) {
                this.passwordError = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*+=]).{8,}$/.test(e)
            },
            'formData.passwordNew'(e) {
                this.newPasswordError = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*+=]).{8,}$/.test(e)
            },
            'formData.passwordConfirm'(e) {
                if (e.length >= this.formData.passwordNew.length) {
                    this.confirmPasswordError = e === this.formData.passwordNew
                }
            }
        },
        created() {
            this.userInfo = this.getUserInfo
        },
        methods: {
            ...mapActions(['setApiToken']),
            submit() {
                if(this.lock){
                    this.lock = false
                    let form = {}
                    user.getRsaPublicKey(rsaPublicKey=>{
                        form.password = utils.encryptPwd(rsaPublicKey, this.formData.password)
                        form.passwordNew = utils.encryptPwd(rsaPublicKey, this.formData.passwordNew)
                        form.rsaPublicKey = rsaPublicKey
                        if(this.userInfo.googleAuthEnable === 1){
                            form.googleCode = this.formData.googleCode
                        }
                        user.changePwd(form,res=>{
                            Tip({type: 'success', message: this.$t(`error_code.${res}`)})
                            this.setApiToken(null);
                            localStorage.removeItem('userInfo')
                            localStorage.removeItem('headerImg')
                            this.$router.push({name: 'login'})
                            console.log('1')
                        },msg=>{
                            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                            this.lock = true
                            console.log('2')
                        })
                    })
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .cont {
        margin-top: 0.55rem;
        position: relative;

        .icon_showpwd {
            position: absolute;
            right: 0.3rem;
            bottom: 0.14rem;
            margin-top: -0.18rem;
            width: 0.36rem;
            height: 0.36rem;
            background-image: url('../../../assets/img/eye_closed@2x.png');

            &.active {
                background-image: url('../../../assets/img/eye_open@2x.png');
            }
        }

        .error {
            position: absolute;
            top: .9rem;
            font-size: 0.2rem;
            color: #DF4A26;
        }
    }

    .btn {
        margin-top: 1.4rem;
    }
</style>
