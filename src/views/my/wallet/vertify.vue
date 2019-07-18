<template>
    <div class="confirm">
        <div class="title">{{mobileState === 1 ? $t('auth_warning.warning_SMS_auth') :
            $t('auth_warning.warning_google_auth')}}<!--短信验证||谷歌验证--></div>
        <!--短信验证-->
        <div class="form" v-if="mobileState === 1">
            <input class="input" ref="box" type="password" v-validate="'required'" name="passwordVerify"
                   :msgs="msgs.password" :errs="errors" v-model="comData.password"
                   :title="$t('account.user_center_login_password')"
                   :placeholder="$t('account.user_center_login_password')"><!--登录密码-->
            <div class="smsCode">
                <input class="input" v-validate="'required|pInteger'" :maxLength="6" name="smsCode" :msgs="msgs.smsCode"
                       :errs="errors" v-model="comData.smsCode" :title="$t('account.user_center_SMS_code')"
                       :placeholder="$t('account.user_center_SMS_code')"><!--短信验证码-->
                <span :class="{disabled: disabled}" @click="sendSMSCode">{{$t('account.user_center_send_SMS')}}
                    <!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</span>
            </div>
            <div class="buttons">
                <span @click="closeDialog">{{$t('public0.no')}}<!--取消--></span>
                <span class="define" @click="auth">{{$t('public0.ok')}}<!--确定--></span>
            </div>
        </div>
        <!--谷歌验证-->
        <div class="form" v-if="mobileState !== 1">
            <input ref="box" v-validate="'required|pInteger'" class="verifycode" :maxLength="6" name="verifyCode"
                   :msgs="msgs.verifyCode" :errs="errors" v-model="formData.verifyCode"
                   :title="$t('account.user_center_Google_verification_code')"
                   :placeholder="$t('account.user_center_Google_verification_code')"/><!--谷歌验证码-->
            <div class="buttons">
                <span @click="closeDialog">{{$t('public0.no')}}<!--取消--></span>
                <span class="define" @click="auth1">{{$t('public0.ok')}}<!--确定--></span>
            </div>
        </div>
    </div>
</template>

<script>
    import utils from '@/assets/js/utils'
    import userApi from '@/api/individual'
    import myApi from '@/api/user'
    import userUtils from '@/api/wallet'

    export default {
        props: ['params', 'mobileState'],
        data() {
            return {
                toAddress: '',
                password: '',
                code: '',
                comData: {
                    type: 1,
                    password: '',
                    smsCode: ''
                },
                formData: {
                    verifyCode: ''
                },
                disabled: false,
                time: 60
            }
        },
        computed: {
            msgs() {
                return {
                    verifyCode: {
                        required: this.$t('login_register.verify_code'),
                        pInteger: this.$t('error_code.NUMERIC')
                    }, // 请输入验证码
                    password: {required: this.$t('login_register.password')}, // 请输入密码
                    smsCode: {required: this.$t('login_register.verify_code'), pInteger: this.$t('error_code.NUMERIC')} // 请输入验证码
                }
            }
        },
        created() {
        },
        methods: {
            auth1() {
                this.$validator.validateAll().then((valid) => {
                    if (!valid) {
                        let items = this.errors.items
                        if (items && items.length && items[0]) {
                            let name = items[0].field
                            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
                            Tip({type: 'danger', message: msg})
                        }
                        return
                    }
                    this.$emit('okCallback', this.formData.verifyCode)
                    this.$emit('removeDialog')
                })
            },
            sendSMSCode() {
                if (this.disabled) {
                    return
                }
                this.disabled = true
                userApi.sendAuthSMSCode({
                    phoneNumber: this.params.phoneNumber,
                    countryCode: this.params.countryCode
                }, (res) => {
                    let timeOut = () => {
                        this.time--
                        if (this.time === 0) {
                            this.disabled = false
                            this.time = 60
                            return
                        }
                        setTimeout(timeOut, 1000)
                    }
                    this.time = 60
                    setTimeout(timeOut, 1000)
                    Tip({type: 'success', message: this.$t('error_code.SEND_CODE_SUCCESS')})
                }, (msg) => {
                    this.disabled = false
                    Tip({type: 'danger', message: msg})
                })
            },
            auth() {
                this.$validator.validateAll().then((valid) => {
                    if (!valid) {
                        let items = this.errors.items
                        if (items && items.length && items[0]) {
                            let name = items[0].field
                            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
                            Tip({type: 'danger', message: msg})
                        }
                        return
                    }
                    let formData = {
                        type: 1,
                        password: this.comData.password,
                        smsCode: this.comData.smsCode
                    }
                    let saveFun = () => {
                        this.$emit('okCallback', formData)
                        this.$emit('removeDialog')
                    }
                    myApi.getRsaPublicKey((rsaPublicKey) => {
                        formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
                        formData.rsaPublicKey = rsaPublicKey
                        saveFun()
                    })
                })
            },
            closeDialog() {
                this.$emit('removeDialog')
            },
        }
    }
</script>

<style scoped="">
    .title {
        font-size: 0.4rem;
        height: 1rem;
        line-height: 1rem;
        padding-left: 0.3rem;
        padding-right: 0.3rem;
    }

    .form {
        padding: 0.3rem;
    }

    .input {
        height: 0.86rem;
        border: 0.02rem solid #394159;
        width: 100%;
        background: #292929;
        text-indent: 0.16rem;
        color: #aebce4;
    }

    .verifycode {
        width: 100% !important;
        height: 0.86rem !important;
        border: 0.02rem solid #394159;;
        background: #1b1e2e;
        text-indent: 0.16rem;
        color: #aebce4;
    }

    .smsCode {
        display: flex;
        justify-content: space-between;
        margin-top: 0.3rem;
        margin-bottom: 0.3rem;
    }

    .smsCode input {
        width: 60%;
    }

    .smsCode span {
        display: inline-block;
        width: 2.3rem;
        height: 0.78rem;
        line-height: 0.78rem;
        text-align: center;
        cursor: pointer;
        background: #292929;
        color: #0072fd;
        border: 1px solid #0072fd;
        font-size: 0.19rem;
    }

    .smsCode span.disabled {
        background: #8089a3;
    }

    .buttons span {
        display: inline-block;
        width: 3rem;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        cursor: pointer;
        background: #8089a3;
        color: #fff;
        font-size: 0.34rem;
    }

    .buttons span.define {
        background: #0072fd;
        color: #fff;
        border: 1px solid #0072fd;
    }

    .buttons {
        display: flex;
        justify-content: space-between;
    }

    input.verifycode {
        margin-bottom: 0.3rem;
    }
</style>
