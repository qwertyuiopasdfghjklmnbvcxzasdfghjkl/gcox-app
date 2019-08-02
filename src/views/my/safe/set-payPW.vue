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
        </div>
    </div>
</template>

<script>
    import UiInput from "../../../components/uiInput";
    import {mapGetters} from 'vuex'
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
                userInfo: {}
            }
        },
        computed:{
            ...mapGetters(['getUserInfo']),
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
</style>
