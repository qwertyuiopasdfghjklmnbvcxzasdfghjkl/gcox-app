<template>
    <div class="page">
        <top-back>{{$t('home.home19')}}</top-back>
        <div class="page-main">
            <div class="minInner">
                <div class="register-form mt25">

                    <div class="register_cont ">
                        <ui-input :label="$t('home.home08')" v-model="formData.email"></ui-input>
                        <p class="error" v-if="!emailError">{{$t('home.home24')}}</p>
                    </div>

                    <div class="register_cont mt55">
                        <ui-input
                                :label="$t('home.home09')"
                                :type="showpwd? 'text':'password'"
                                v-model="formData.password"
                                :maxlength="32"></ui-input>
                        <i class="icon_showpwd" :class="{active:showpwd}"
                           v-tap="{methods: ()=>{showpwd = !showpwd}}"></i>
                        <p class="error" v-if="!passwordError">{{$t('home.home22')}}</p>
                    </div>

                    <div class="register_cont mt55">
                        <ui-input
                                :label="$t('home.home20')"
                                :title="$t('home.home21')"
                                :type="showpwdAgin? 'text':'password'"
                                v-model="formData.passwordConfirm"
                                :maxlength="32"></ui-input>
                        <i class="icon_showpwd" :class="{active:showpwdAgin}"
                           v-tap="{methods: ()=>{showpwdAgin = !showpwdAgin}}"></i>
                        <p class="error" v-if="!passwordConfirmError">{{$t('home.home23')}}</p>
                    </div>

                    <div class="service mt35">
                        <label for="service">
                            <input id="service" type="checkbox" name="service" v-model="checked">
                            <i type="checkbox" :class="{'active':checked}"></i>
                        </label>
                        <span class="ml10">
              <label for="service" class="ft-c-lightGray">{{$t('public0.agreeService')}} 《<!--我已阅读并同意--></label>
              <a class="ft-c-main underline" :href="getAgreementUrl" target="_blank">
                {{$t('home.home25')}}
              </a>
              》《
              <a class="ft-c-main underline" :href="getAgreementUrl" target="_blank">
                {{$t('home.home26')}}
              </a>
              》《
              <a class="ft-c-main underline" :href="getAgreementUrl" target="_blank">
                {{$t('home.home27')}}
              </a>
              》
            </span>
                    </div>

                    <div class="register-content-button mt80">
                        <mt-button class="circle" :class="{'unlock': gtLocked}" type="primary" size="large"
                                   v-tap="{methods: register}">
                            <template>{{$t('public0.register')}}<!--注册--></template>
                        </mt-button>
                    </div>

                    <p class="has-account ft-c-lightGray f24 unselected">
                        {{$t('home.home28')}}
                        <router-link class="ft-c-main" :to="{name:'login'}">
                            {{$t('home.home29')}}
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import config from '@/api/config'
    import countryCode from '@/api/countryCode'
    import utils from '@/assets/js/utils'
    import userApi from '@/api/user'
    import VConsole from 'vconsole'
    import UiInput from "../components/uiInput";

    export default {
        name: 'register',
        components: {UiInput},
        data() {
            return {
                showpwd: false,
                showpwdAgin: false,

                locked: true, // 锁
                formData: {
                    email: '',
                    password: '',
                    passwordConfirm: '',
                },
                checked: false,
                emailError: true,
                passwordError: true,
                passwordConfirmError: true,
            }
        },
        computed: {
            gtLocked() {
                return this.formData.email && this.formData.password && this.formData.passwordConfirm && this.checked
            },
            getAgreementUrl() {
                if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
                    return '#'
                } else {
                    return '#'
                }
            }
        },
        watch: {
            'formData.registerType'() {
                this.$validator.reset()
            },
            $route() {
                this.formData.ref = utils.getUrlHashParams().ref
            }
        },
        created() {
            this.formData.ref = utils.getUrlHashParams().ref
            if (this.getApiToken && this.$route.query.ac !== 'bind') {
                this.$router.replace({path: '/'})
            }
        },
        methods: {
            ...mapActions(['setApiToken', 'setUserInfo']),
            vEmail() {
                let reg = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
                this.emailError = reg.test(this.formData.email)
            },
            vPassword() {
                let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*+=]).{8,}$/
                this.passwordError = reg.test(this.formData.password)
            },
            vPasswordConfirm() {
                this.passwordConfirmError = this.formData.password === this.formData.passwordConfirm
            },
            verify() {
                this.vEmail()
                this.vPassword()
                this.vPasswordConfirm()
                console.log(this.passwordConfirmError, this.passwordError, this.emailError)
            },
            register() {
                $('input').blur()
                if(this.gtLocked){
                    this.verify()
                    if (this.passwordConfirmError && this.passwordError && this.emailError && this.locked) {
                        var formData = {
                            email: this.formData.email,
                            password: this.formData.password,
                            passwordConfirm: this.formData.passwordConfirm,
                        }
                        this.locked = false;
                        utils.gtValidate((gtParams) => {
                            for (let i in gtParams) {
                                formData[i] = gtParams[i]
                            }
                            this.sendInfo(formData)
                        }, () => {
                            this.locked = true
                        })
                    }
                }
            },

            sendInfo(formData) {
                userApi.getRsaPublicKey((rsaPublicKey) => {
                    formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
                    formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
                    formData.rsaPublicKey = rsaPublicKey
                    formData.redirectUrl = ''
                    formData.paidCheck = false
                    userApi.register(formData, (msg) => {
                        this.locked = true
                        Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                        this.$router.push({name: 'login', params: formData})
                    }, (msg) => {
                        this.locked = true
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    })
                }, () => {
                    this.locked = true
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .register-title {
        margin-top: 0.5rem;
        color: #9DAAAA;
        font-size: 0.52rem;
    }

    .register_cont {
        /*margin-top: 0.55rem;*/
        position: relative;

        input {
            height: 0.5rem;
            width: 100%;
            font-size: 0.32rem;
            color: #ffffff;
            border: none;
            background-color: transparent;
        }

        .icon_showpwd {
            position: absolute;
            right: 0.3rem;
            top: 0.54rem;
            margin-top: -0.18rem;
            width: 0.36rem;
            height: 0.36rem;
            background-image: url('../assets/img/eye_closed@2x.png');

            &.active {
                background-image: url('../assets/img/eye_open@2x.png');
            }
        }

        .error {
            padding-top: 0.2rem;
            color: #ff5e2d;
            font-size: 0.24rem;
        }
    }

    .service {
        font-size: 0.24rem;
        line-height: 0.28rem;
        display: flex;

        & > label {
            width: 0.28rem;
            height: 0.28rem;
            position: relative;
            flex-shrink: 0;

            input {
                position: absolute;
                z-index: 9;
                width: 100%;
                height: 100%;
                opacity: 0;
                left: 0;
                top: 0;
            }

            i {
                position: absolute;
                top: 0;
                left: 0;
                border: 0.04rem solid #cccccc;
                width: 100%;
                height: 100%;
                border-radius: 0.04rem;

                &.active {
                    background: url("../assets/img/check@3x.png") no-repeat;
                    background-size: cover;
                    border: none;
                }
            }
        }

        & > span {
            display: inline-block;
        }

        a {
            text-decoration: none;
            color: #00A0E9;
        }
    }

    .has-account {
        width: 100%;
        text-align: center;
        position: absolute;
        bottom: 1rem;
    }
</style>
