<template>
    <div class="page">
        <top-back>{{$t('home.setPayPW')}}</top-back>
        <div class="page-main">
            <div class="cont mt55">
                <ui-input
                        :title="$t('account.user_center_new_password')"
                        :label="$t('account.user_center_Please_new_password')"
                        :type="showpwd? 'text':'password'"
                        v-model="formData.newPassword"></ui-input>
                <i class="icon_showpwd" :class="{active:showpwd}"
                   v-tap="{methods: ()=>{showpwd = !showpwd}}"></i>
                <p class="error" v-if="!passwordError">{{$t('home.home22')}}</p>
            </div>
            <div class="cont mt55">
                <ui-input
                        :title="$t('account.user_center_confirm_password')"
                        :label="$t('account.user_center_Please_confirm_password')"
                        :type="showConfirmPW? 'text':'password'"
                        @blur="blur()"
                        v-model="formData.passwordConfirm"></ui-input>
                <i class="icon_showpwd" :class="{active:showConfirmPW}"
                   v-tap="{methods: ()=>{showConfirmPW = !showConfirmPW}}"></i>
                <p class="error" v-if="!confirmPasswordError">{{$t('home.home23')}}</p>
            </div>
            <div class="cont mt55">
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
    import {mapGetters} from 'vuex'
    import user from '../../../api/user'
    import {MessageBox} from 'mint-ui'
    export default {
        components: {UiInput},
        data(){
            return{
                showpwd: false,
                passwordError: true,
                showConfirmPW: false,
                confirmPasswordError: true,
                formData: {
                    newPassword: '',
                    passwordConfirm: '',
                    googleCode: '',
                },
                userInfo: {},
                // lock: false
            }
        },
        computed:{
            ...mapGetters(['getUserInfo']),
            lock(){
                return (this.passwordError && this.confirmPasswordError) && this.formData.googleCode
            }
        },
        watch: {
            'formData.newPassword'(e) {
                this.passwordError = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*+=]).{8,}$/.test(e)
            },
            'formData.passwordConfirm'(e) {
                if (e.length >= this.formData.newPassword.length) {
                    this.confirmPasswordError = e === this.formData.newPassword
                }
            }
        },
        created() {
            this.userInfo = this.getUserInfo
            if (this.userInfo.googleAuthEnable === 0) {
                MessageBox({
                    title: this.$t('public0.public242'),
                    message: this.$t('error_code.GOOGLE_CELLPHONE_AUTH_FIRST'), // 请先进行谷歌验证或短信验证
                    confirmButtonText: this.$t('public0.ok'),
                    showCancelButton: true
                }).then(action => {
                    if (action === 'confirm') {
                        this.$router.push({name: 'google-verify'})
                    }else{
                        this.$router.push({name: 'safe'})
                    }
                })
            } else if (this.userInfo.kycState !== 1) {
                MessageBox({
                    title: this.$t('public0.public242'),
                    message: this.$t('home.home66'), // 请先完成实名验证
                    confirmButtonText: this.$t('public0.ok'),
                    showCancelButton: true
                }).then(action => {
                    if (action === 'confirm') {
                        this.$router.push({name: 'realName'})
                    }else{
                        this.$router.push({name: 'safe'})
                    }
                })
            }
        },
        methods:{
            submit(){
                if(this.lock){
                    this.lock = false
                    let data = {}
                    data.transactionPassword = this.formData.newPassword
                    data.totp = this.formData.googleCode
                    user.payPW(data, res=>{
                        Tip({type: 'success', message: this.$t(`error_code.${res}`)})
                        this.$router.push({name: 'safe'})
                    },msg=>{
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                        this.lock = true
                    })
                }
            },
            blur(){
                this.confirmPasswordError = this.formData.passwordConfirm === this.formData.newPassword
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
