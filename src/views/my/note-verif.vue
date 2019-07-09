<template>
    <div class="page">
        <top-back>
            <template v-if="mobileState === 1">
                {{$t('account.user_unbind_SMS_verification')}}<!--解除短信认证-->
            </template>
            <template v-else>
                {{$t('account.user_bind_SMS_verification')}}
            </template>
        </top-back>

        <div class="page-main">
            <form>
            <!--1、绑定短信认证-->
            <div class="my-item phoneNumber" v-if="mobileState === 0">
                <p class="line">
                    <select v-model="mobileFormData.countryCode">
                        <option v-for="item in areaCodeList" :value="item.code">{{$t(item.key)}}<!--中国大陆-->&nbsp;{{item.code}}</option>
                    </select>
                    <input type="text" name="phoneNumber" v-model="mobileFormData.phoneNumber" disabled="disabled"
                           v-validate="'required|telphone'" :placeholder="$t('account.user_center_phone')"
                           maxlength="11"><!--手机号-->
                </p>
            </div>
            <div class="my-item">
                <p class="line">
                    <input name="phonepassword" v-model="mobileFormData.phonepassword" v-validate="'required'"
                           type="password" :placeholder="$t('account.user_center_login_password')"><!--登录密码-->
                </p>
            </div>
            <div class="my-item">
                <p class="line">
                    <input name="smsCode" maxlength="6" v-model="mobileFormData.smsCode"
                           v-validate="'required|pInteger'" :placeholder="$t('account.user_center_SMS_code')">
                    <!--短信验证码-->
                    <mt-button type="primary" class="mini sendSmsCode" :disabled="disabled" v-tap="{methods:sendSMSCode}">{{$t('public0.sendSmsCode')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</mt-button>
                </p>
            </div>
            <p class="mt30 ft-c-gray f24" v-if="mobileState === 1">（{{$t('public0.public245')}}）<!--为了您的资产安全，不建议您解除手机短信验证码功能。--></p>
            <footer class="mt100">
                <submit-button v-tap="{methods: bindMobile}">{{mobileState
                    === 0 ? $t('account.user_center_operate_bind') : $t('account.user_center_operate_unbind')}}
                    <!--绑定--></submit-button>
            </footer>
            </form>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    import commonConfig from '@/assets/js/commonConfig'
    import utils from '@/assets/js/utils'
    import myApi from '@/api/user'
    import userApi from '@/api/individual'

    export default {
        name: 'page-bindphone',
        data() {
            return {
                mobileState: 0, // 1 已经绑定  0 未绑定
                disabled: false,
                time: 60,
                areaCodeList: commonConfig.areaCodeList,
                mobileFormData: {
                    countryCode: commonConfig.defaultCode,
                    phoneNumber: '',
                    phonepassword: '',
                    smsCode: ''
                }
            }
        },
        computed: {
            ...mapGetters(['getUserInfo']),
            msgs() {
                return {
                    phoneNumber: {required: this.$t('public0.public6')}, // 请输入手机号
                    phonepassword: {required: this.$t('login_register.password')}, // 请输入密码
                    smsCode: {required: this.$t('login_register.verify_code')}, // 请输入验证码
                }
            }
        },
        created() {
            this.fnUserState()
        },
        methods: {
            fnUserState() {
                userApi.getUserState((data) => {
                    this.mobileState = data.mobileAuthState
                    this.getMyUserInfo()
                }, (msg) => {
                    console.error(msg)
                })
            },
            bindMobile() {
                this.$validator.validateAll(this.mobileFormData).then((validResult) => {
                    if (!validResult) {
                        let items = this.errors.items
                        if (items && items.length && items[0]) {
                            let name = items[0].field
                            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
                            Tip({type: 'danger', message: msg})
                        }
                        return
                    }
                    let formData = {}
                    for (let i in this.mobileFormData) {
                        formData[i] = this.mobileFormData[i]
                    }
                    formData.password = formData.phonepassword
                    delete formData.phonepassword
                    myApi.getRsaPublicKey((rsaPublicKey) => {
                        formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
                        formData.rsaPublicKey = rsaPublicKey
                        if (Number(this.mobileState) === 1) {
                            userApi.unbindMobile(formData, (msg) => {
                                this.showBindMobile = false
                                this.disabled = false
                                Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                                this.mobileFormData = {
                                    countryCode: commonConfig.defaultCode,
                                    phoneNumber: '',
                                    phonepassword: '',
                                    smsCode: ''
                                }
                                this.fnUserState()
                                this.getMyUserInfo()
                            }, (msg) => {
                                Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                            })
                            return
                        }
                        userApi.bindMobile(formData, (msg) => {
                            this.showBindMobile = false
                            this.disabled = false
                            Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                            setTimeout(() => {
                                this.$router.push({name: 'ucenter'})
                            }, 1000)
                        }, (msg) => {
                            Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                        })
                    })
                })
            },
            getMyUserInfo() {
                myApi.userInfo((res) => {
                    this.mobileFormData.phoneNumber = res.mobile
                })
            },
            sendSMSCode() {
                if (this.disabled) {
                    return
                } else if (this.mobileFormData.phoneNumber === "") {
                    Tip({type: 'danger', message: this.$t('public0.public6')}) // 请输入手机号
                    return
                }
                this.disabled = true
                userApi.sendAuthSMSCode({
                    countryCode: this.mobileFormData.countryCode,
                    phoneNumber: this.mobileFormData.phoneNumber
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
                    Tip({type: 'success', message: this.$t('error_code.SEND_CODE_SUCCESS')}) // 验证码发送成功
                }, (msg) => {
                    this.disabled = false
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            }
        }
    }
</script>

<style lang="less" scoped>

    .my-item {
        font-size: .28rem;

        &:first-of-type {
            margin-top: .2rem;
        }

        h1 {
            margin-top: .5rem;
            font-size: .34rem;
            color: #cbd4ec;
        }

        input {
            background: transparent;
            border: 0;
            font-size: .34rem;
            color: #222;
            height: .8rem;
            width: 100%;
        }

        input::placeholder {
            color: #9DAAAA;
        }

        p.line {
            position: relative;
            margin-top: .3rem;
            border-bottom: .01rem solid #ccc;
        }

        .msg {
            font-size: .28rem;
            color: #8089a3;
            margin-top: .2rem;
        }
    }

    .my-item.phoneNumber {
        p {
            position: relative;
            margin-top: 0;

            select {
                position: absolute;
                top: 0;
                left: 0;
                width: 2.5rem;
                height: .8rem;
                font-size: .32rem;
                color: #9DAAAA;
                border: none;
                background: none;
            }

            input {
                padding-left: 2.4rem;
                text-indent: .12rem;
            }
        }
    }

    input:-internal-autofill-selected{
        background: none;
    }

    .sendSmsCode {position: absolute; top: 0.14rem; right: 0; background-color: transparent!important; color: #4AC6C3; padding-right: 0;}
    .sendSmsCode:disabled {color: #999;}
    .mint-button.sendSmsCode::after {background-color: transparent;}

</style>
