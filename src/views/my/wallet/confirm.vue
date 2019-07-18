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
                <span :class="{disabled: disabled}" v-tap="{methods:sendSMSCode}">{{!disabled?$t('account.user_center_send_SMS'):''}}
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
        props: ['params'],
        data() {
            return {
                toAddress: '',
                mobileState: null,
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
            this.getUserState()
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
                    let formData = { // 提现
                        symbol: this.params.symbol,
                        symbolType: this.params.symbolType,
                        amount: this.params.amount,
                        fromAccount: this.params.fromAccount, // 用户id
                        toAddress: this.params.selToAddress,
                        googleCode: this.formData.verifyCode,
                        type: 0,
                        memo: this.params.memo,
                        lang: window.localStorage.getItem('lang') === 'zh-CN' ? 'cn' : 'en'
                    }
                    userUtils.walletWithdraw(formData, () => {
                        let msg = this.$t('login_register.Mail_sent_successfully') // 邮件发送成功
                        Tip({type: 'success', message: msg})
                        this.$emit('okCallback')
                        this.$emit('removeDialog')
                        this.$router.push({name: 'wallet'})
                    }, (msg) => {
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    })
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
                    let formData = { // 提现
                        alias: null,
                        symbol: this.params.symbol,
                        symbolType: this.params.symbolType,
                        amount: this.params.amount,
                        fromAccount: this.params.fromAccount, // 用户id
                        toAddress: this.params.selToAddress,
                        type: 1,
                        lang: window.localStorage.getItem('lang') === 'zh-CN' ? 'cn' : 'en',
                        password: this.comData.password,
                        smsCode: this.comData.smsCode,
                        memo: this.params.memo
                    }
                    let saveFun = () => {
                        userUtils.walletWithdraw(formData, () => {
                            let msg = this.$t('message.WITHDRAWALS_SUCCESS')
                            Tip({type: 'success', message: msg}) // 邮件发送成功
                            this.$emit('okCallback')
                            this.$emit('removeDialog')
                        }, (msg) => {
                            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                        })
                    }
                    myApi.getRsaPublicKey((rsaPublicKey) => {
                        formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
                        formData.rsaPublicKey = rsaPublicKey
                        saveFun()
                    })
                })
            },
            closeDialog() {
                this.$emit('errCallback')
                this.$emit('removeDialog')
            },
            getUserState() {
                // 获取当前用户状态信息
                userApi.getUserState((data) => {
                    this.mobileState = data.mobileAuthState
                }, (msg) => {
                    console.error(msg)
                })
            }
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
        height: 0.8rem;
        width: 100%;
        background: #ffffff;
        text-indent: 0.16rem;
        color: #222;
        border:none;
        border-bottom: 0.02rem solid #c8cccc;
    }

    .verifycode {
        width: 100% !important;
        height: 0.86rem !important;
        border: 0.02rem solid #ccc;
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
        height: 0.8rem;
        line-height: 0.84rem;
        text-align: center;
        cursor: pointer;
        background: #4AC6C3;
        color: #ffffff;
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
        background: #b1b6c5;
        color: #fff;
        font-size: 0.34rem;
    }

    .buttons span.define {
        background: #4AC6C3;
        color: #fff;
        border: 1px solid #4AC6C3;
    }

    .buttons {
        display: flex;
        justify-content: space-between;
    }

    input.verifycode {
        margin-bottom: 0.3rem;
    }
</style>
