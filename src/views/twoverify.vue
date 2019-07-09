<template>
    <div class="page">
        <top-back>{{$t('public0.smsCode')}}<!--短信验证码--></top-back>
        <div class="page-main">
            <div class="second-form mt20">
                <!--<h3 class="second-title">-->
                <!--<i></i>-->
                <!--</h3>-->
                <div class="second-content">
                    <div class="second-content-item" v-tap="{methods:focusVerifyCode}">
                        <div class="second-content-row SMSLabel">
                            <span class="f34 ft-c-gray">{{formData.username}}</span>
                            <mt-button type="primary" class="mini" :disabled="disabled" v-tap="{methods:sendSMSCode}">
                                {{$t('public0.sendSmsCode')}}<!--发送验证码--> {{disabled ? `（${time}s）` : ''}}
                            </mt-button>
                        </div>
                        <div class="second-content-row verifyCode mt40">
                            <input id="verifyCode" ref="verifyCode" type="tel" v-model="formData.verifyCode"
                                   maxlength="6" :placeholder="$t('public0.input')+$t('public0.smsCode')" v-focus
                                   autocomplete="off">
                        </div>
                    </div>
                    <div class="second-content-row button mt50">
                        <mt-button type="primary" class="circle" size="large" @click="loginbtn">{{$t('public0.login')}}
                            <!--确定--></mt-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import utils from '@/assets/js/utils'
    import userApi from '@/api/user'
    import myAPi from '@/api/individual'

    export default {
        name: 'twoverify',
        data() {
            return {
                countryCode: '+86',
                formData: {
                    verifyType: 0, // 0 是短信 1 是谷歌
                    username: '',
                    mobile: '',
                    verifyCode: ''
                },
                locked: false, // 锁
                type: '',
                account: '',
                password: '',
                disabled: false,
                time: 60
            }
        },
        watch: {
            'formData.verifyType'() {
                this.formData.verifyCode = ''
                this.$nextTick(() => {
                    $('#verifyCode').focus()
                })
            },
            type(val) {
                if (String(val).indexOf('0') !== -1) {
                    this.formData.verifyType = 0
                } else {
                    this.formData.verifyType = 1
                }
            }
        },
        created() {
            let username = this.$route.params.username
            if (username) {
                this.formData.username = username
                window.localStorage.setItem('$twoverify_username', username)
            } else {
                username = window.localStorage.getItem('$twoverify_username')
                if (username) {
                    this.formData.username = username
                } else {
                    this.$router.push({name: 'login'})
                }
            }
            let mobile = this.$route.params.mobile
            if (mobile) {
                this.formData.mobile = mobile
                window.localStorage.setItem('$twoverify_mobile', mobile)
            } else {
                mobile = window.localStorage.getItem('$twoverify_mobile')
                if (mobile) {
                    this.formData.mobile = mobile
                }
            }
            let type = this.$route.params.type
            if (type) {
                this.type = type
                window.localStorage.setItem('$twoverify_type', type)
            } else {
                type = window.localStorage.getItem('$twoverify_type')
                if (type) {
                    this.type = type
                }
            }
            let countryCode = this.$route.params.countryCode
            if (countryCode) {
                this.countryCode = countryCode
                window.localStorage.setItem('$twoverify_countryCode', countryCode)
            } else {
                countryCode = window.localStorage.getItem('$twoverify_countryCode')
                if (countryCode) {
                    this.countryCode = countryCode
                }
            }
        },
        methods: {
            ...mapActions(['setApiToken', 'setUserInfo','setQuickLoginInfo']),
            focusVerifyCode() {
                $('#verifyCode').focus()
            },
            loginbtn() {
                $('input').blur()
                if (this.locked) {
                    return
                }
                let m = Number(this.formData.verifyType) === 0 ? 'loginMobileVerify' : 'loginTwo'
                let formData = Number(this.formData.verifyType) === 0 ? { // 短信验证
                    smsCode: this.formData.verifyCode,
                    username: this.formData.username,
                    mobile: this.formData.mobile
                } : {
                    verifyCode: this.formData.verifyCode,
                    username: this.formData.username
                }
                myAPi[m](formData, (apiToken) => {
                    window.localStorage.removeItem('$twoverify_username')
                    this.locked = false
                    this.setApiToken(apiToken)
                    this.setQuickLoginInfo(null) //正常登录清除快速登录信息
                    userApi.userInfo(res => {
                        this.setUserInfo(res);
                    })
                    if (this.$route.query.curl) {
                        this.$router.replace({path: this.$route.query.curl})
                    } else {
                        this.$router.replace({path: '/'})
                    }
                    myAPi.addLoginHistory()
                }, (msg) => {
                    this.locked = false
                    this.formData.verifyCode = ''
                    setTimeout(() => {
                        $('#verifyCode').focus()
                    }, 10)
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
            sendSMSCode() {
                if (this.disabled) {
                    return
                }
                if (!this.formData.mobile) {
                    Tip({type: 'danger', message: this.$t('public0.public6')}) // 请输入手机号
                    return
                }
                this.disabled = true
                myAPi.sendAuthSMSCode({
                    phoneNumber: this.formData.mobile,
                    countryCode: this.countryCode
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
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .second-title {
        text-align: center;

        i {
            display: inline-block;
            width: 2rem;
            height: 2rem;
            vertical-align: middle;
            background: url('../assets/logo.png') no-repeat center center;
            background-size: contain;
        }

        span {
            display: inline-block;
            height: .8rem;
            font-size: .4rem;
            line-height: .8rem;
            color: #fff;
            vertical-align: middle;
        }
    }

    .second-content {
        /*padding: .8rem .4rem;*/
        margin-top: .4rem;
        /*border-radius: 0.1rem;*/
        /*background-color: #fff;*/
        /*box-shadow: 0 0.02rem 0.1rem rgba(0,0,0,.1);*/

        &-row {
            &.SMSLabel {
                display: flex;
                justify-content: space-between;
                border-bottom: 1px solid #ccc;
            }

            &.verifyCode {
                position: relative;
                overflow: hidden;

                input {
                    height: 0.6rem;
                    width: 100%;
                    /*padding-left: 0.15rem ;*/
                    /*padding-right: 0.15rem ;*/
                    font-size: 0.3rem;
                    color: #333333;
                    border: none;
                    background-color: transparent;
                    border-bottom: 1px solid #ccc;
                    /*border-radius: 4px;*/
                }
            }
        }
    }

    .page {
        .mini {
            background-color: transparent !important;
            color: #4AC6C3;
            &:disabled {color: #999;}
        }
    }
</style>
