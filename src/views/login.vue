<template>
    <div class="page">
        <top-back :back="false"  v-tap="{methods: showC}">
        <span class="off" v-tap="{methods:goBack}">
        <img src="../assets/img/off.png">
        </span>
        </top-back>
        <div class="page-main">
            <div class="minInner">
                <!--<h3 class="login-title">{{$t('public0.login')}}</h3>-->
                <p class="login_logo">
                    <img src="../assets/img/LOGo@3x.png">
                </p>
                <div class="login-form">
                    <div>
                        <ui-input
                                :label="$t('home.home36')"
                                v-model="formData.username"
                                :title="$t('home.home08')"
                        ></ui-input>
                    </div>
                    <div class="login-content-input">
                        <ui-input
                                :label="$t('home.home09')"
                                :title="$t('home.home21')"
                                :type="showpwd? 'text':'password'"
                                v-model="formData.password"
                                :maxlength="32"></ui-input>
                        <i class="icon_showpwd" :class="{active:showpwd}"
                           v-tap="{methods: ()=>{showpwd = !showpwd}}"></i>
                    </div>

                    <div class="login-content-button mt120">
                        <mt-button type="primary" class="circle" :class="{'unlock': gtLocked}"
                                   size="large" v-tap="{methods:login}">{{$t('public0.login')}}<!--登录--></mt-button>
                    </div>
                    <p class="forget_password">
                        <router-link tag="span" :to="{name:'findpwd'}">{{$t('public0.forgetPassword')}}
                            <!--忘记密码--></router-link>
                    </p>
                    <p class="sing_in">
                        <router-link class="ft-c-main" :to="{name:'register'}">{{$t('home.home10')}}</router-link>
                    </p>
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
    import config from '@/api/config'
    import UiInput from "../components/uiInput";
    import VConsole   from 'vconsole'

    export default {
        name: 'login',
        components: {UiInput},
        data() {
            return {
                brand: config.brand.toUpperCase(),
                curl: '', //登录回调地址
                showpwd: false,
                locked: true, // 锁
                // gtLocked: false,
                formData: {
                    username: '',
                    password: ''
                },
                account: '',
                password: '',
                vi: 0
            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.curl = to.query.curl || '/ucenter'
            })
        },
        computed: {
            gtLocked() {
                return this.formData.username && this.formData.password
            }
        },
        created() {

        },
        methods: {
            ...mapActions(['setApiToken', 'setUserInfo', 'setQuickLoginInfo']),
            login(args) {
                $('input').blur()
                if (this.locked && this.gtLocked) {
                    this.locked = false
                    utils.gtValidate((gtParams) => {
                        let formData = {}
                        for (let i in this.formData) {
                            formData[i] = this.formData[i]
                        }
                        for (let i in gtParams) {
                            formData[i] = gtParams[i]
                        }
                        userApi.getRsaPublicKey((rsaPublicKey) => {
                            formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
                            formData.rsaPublicKey = rsaPublicKey
                            console.log(new Date().getTime())
                            userApi.login(formData, (apiToken, res) => {
                                this.locked = true
                                if (apiToken) {
                                    this.setApiToken(apiToken)
                                    this.setQuickLoginInfo(null) //正常登录清除快速登录信息
                                    myAPi.addLoginHistory()
                                    this.getInfo()
                                    Tip({type: 'success', message: this.$t(`user.loginSuccess`)})
                                    if (this.curl) {
                                        this.$router.replace({path: this.curl})
                                    } else {
                                        this.$router.replace({path: '/'})
                                    }
                                }
                            }, (msg, rst) => {
                                this.locked = true
                                if (msg === 'verify_email_required') {
                                    Tip({
                                        type: 'danger',
                                        message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)
                                    })
                                    this.$router.push({name: 'verify', params: {email: this.formData.username}})
                                } else if (msg === 'invalid_totp') {
                                    // 二次验证
                                    this.$router.push({
                                        name: 'twoverify',
                                        params: {
                                            data: this.formData
                                        },
                                        query: {curl: this.curl}
                                    })
                                }else{
                                    Tip({
                                        type: 'danger',
                                        message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)
                                    })
                                }
                            })
                        }, () => {
                            this.locked = true
                        })
                    }, () => {
                        this.locked = true
                    })
                }
            },
            getInfo() {
                userApi.userInfo(res => {
                    this.setUserInfo(res);
                },msg=>{
                    setTimeout(this.getInfo(),1500)
                })
            },
            goBack() {
                this.$router.back()
            },
            showC(){ // 偷偷连按五次打开调试
                this.vi ++
                let timer
                clearTimeout(timer)
                timer = setTimeout(()=>{
                    this.vi = 0
                },1000)
                if(this.vi === 5){
                    window.vConsole = new VConsole()
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .login-title {
        margin-top: 0.5rem;
        color: #9DAAAA;
        font-size: 0.52rem;
    }

    .login-content-input {
        margin-top: 0.55rem;
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
            bottom: 0.14rem;
            margin-top: -0.18rem;
            width: 0.36rem;
            height: 0.36rem;
            background-image: url('../assets/img/eye_closed@2x.png');

            &.active {
                background-image: url('../assets/img/eye_open@2x.png');
            }
        }
    }

    .no-account {
        position: absolute;
        bottom: 0.5rem;
        left: 0;
        right: 0;
        text-align: center;
    }

    .login_logo {
        height: 3.3rem;
        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 3.12rem
        }
    }

    .forget_password {
        position: absolute;
        left: 0.2rem;
        bottom: 0.8rem;
        font-size: 0.24rem;
        color: #ffffff;
    }

    .sing_in {
        position: absolute;
        right: 0.2rem;
        bottom: 0.8rem;
        font-size: 0.24rem;
        color: #00A0E9;
    }

    .off {
        position: absolute;
        left: 0.3rem;

        img {
            width: 0.27rem;
            height: 0.27rem;
        }
    }

</style>
