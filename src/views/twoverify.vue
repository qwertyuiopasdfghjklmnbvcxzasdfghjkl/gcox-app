<template>
    <div class="page">
        <top-back :back="false">
          <span class="off" v-tap="{methods:goBack}">
            <img src="../assets/img/off.png">
          </span>
        </top-back>
        <div class="page-main">
            <div class="second-form">
                <p class="login_logo">
                    <img src="../assets/img/LOGo@3x.png">
                </p>
                <p>{{$t('home.home12')}}</p>
                <div class="second-content-row verifyCode mt30">
                    <input id="verifyCode" ref="verifyCode" type="tel" v-model="formData.googleCode"
                           maxlength="6" :placeholder="$t('home.home11')" v-focus
                           autocomplete="off">
                </div>
                <div class="second-content-row button mt200">
                    <mt-button type="primary" class="circle" size="large" @click="loginbtn">{{$t('public0.login')}}
                        <!--确定--></mt-button>
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
                formData: {
                    googleCode: ''
                },
                data: {},
                locked: false, // 锁
                disabled: false,
            }
        },
        watch: {

        },
        created() {
            this.data = this.$route.params.data
        },
        methods: {
            ...mapActions(['setApiToken', 'setUserInfo', 'setQuickLoginInfo']),
            loginbtn() {
                $('input').blur()
                if (this.locked) {
                    return
                }
                this.data.googleCode = this.formData.googleCode
                userApi.login(this.data, (apiToken) => {
                    window.localStorage.removeItem('$twoverify_username')
                    this.locked = false
                    this.setApiToken(apiToken)
                    this.setQuickLoginInfo(null) //正常登录清除快速登录信息
                    myAPi.addLoginHistory()
                    this.getInfo()
                    Tip({type: 'success', message: this.$t(`user.loginSuccess`)})
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
            getInfo() {
                userApi.userInfo(res => {
                    this.setUserInfo(res);
                })
            },
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
                    font-size: 0.24rem;
                    color: #A5AAB7;
                    border: none;
                    background-color: transparent;
                    border-bottom: 0.02rem solid  #73757E;;
                    transition: border 0.3s;
                    &:hover{
                        border-bottom-color: #5CACCF;
                    }
                }
            }
        }
    }

    .page {
        .mini {
            background-color: transparent !important;
            color: #4AC6C3;

            &:disabled {
                color: #999;
            }
        }
    }

    .off {
        position: absolute;
        left: 0.3rem;

        img {
            width: 0.27rem;
            height: 0.27rem;
        }
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
    .mt200{
        margin-top: 2rem;
    }
</style>
