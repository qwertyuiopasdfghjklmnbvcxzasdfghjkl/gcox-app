<template>
    <div class="page">
        <top-back>{{title}}</top-back>
        <div class="page-main">
            <div class="google-cont" v-if="userInfo.googleAuthEnable !== 1">
                <p>{{$t('home.google-authentication')}}</p>
                <div class="google">
                    <div ref="qrcode"></div>
                </div>
            </div>
            <div class="google-box">
                <div class="addres" v-if="userInfo.googleAuthEnable !== 1">
                    <p>{{$t('account.user_center_backup_key')}}</p>
                    <label>
                        <small>{{key}}</small>
                        <span v-tap="{methods: copy}">{{$t('home.copy')}}</span>
                    </label>
                </div>
                <div class="inout">
                    <p>{{$t('account.user_center_Google_verification_code')}}</p>
                    <label>
                        <input v-model="googleCode" ref="google" type="tel" maxlength="6"/>
                        <ul>
                            <li :class="{'active': googleCode.length>0}"></li>
                            <li :class="{'active': googleCode.length>1}"></li>
                            <li :class="{'active': googleCode.length>2}"></li>
                            <li :class="{'active': googleCode.length>3}"></li>
                            <li :class="{'active': googleCode.length>4}"></li>
                            <li :class="{'active': googleCode.length>5}"></li>
                        </ul>
                    </label>
                </div>
            </div>
            <div class="btn">
                <mt-button type="primary" class="circle" :class="{'unlock':lock}"
                           v-tap="{methods: submit}">{{buttonTitle}}</mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
import utils from '../../../assets/js/utils'
    import individual from '../../../api/individual'
    import userApi from '../../../api/user'
    export default {
        data() {
            return {
                title: null,
                userInfo: {},
                googleCode: '',
                lock: false,
                buttonTitle: null,
                key: null
            }
        },
        computed: {
            ...mapGetters(['getUserInfo']),
        },
        watch:{
            googleCode(e){
                if(e.length >= 6){
                    this.$refs.google.blur()
                    this.lock = true
                    this.submit()
                }
            }
        },
        created() {
            this.userInfo = this.getUserInfo
            if (this.userInfo.googleAuthEnable === 1) {
                this.title = this.$t('account.user_center_operate_unbind')
                this.buttonTitle = this.$t('account.user_center_operate_unbind')
            } else {
                this.title = this.$t('account.user_bind_google_authentication')
                this.buttonTitle = this.$t('home.google-bind')
                this.getGoogleKey()
            }
        },
        methods:{
            ...mapActions(['setUserInfo']),
            copy(){
                utils.copyText(this.key)
                Tip({type: 'success', message: this.$t(`public0.public33`)})
            },
            getGoogleKey () {
                individual.createGoogleKey(res => {
                    this.key = res.msg
                    var qrCode = `otpauth://totp/${window.location.host}:${this.userInfo.username}?secret=${res.msg}&digits=6&issuer=${window.location.host}&period=30`
                    utils.qrcode(this.$refs.qrcode, {
                        width: 150,
                        height: 150,
                        text: qrCode
                    })
                }, (msg) => {
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
            submit() {
                if(this.lock){
                    this.lock = false
                    if (this.userInfo.googleAuthEnable === 1) {
                        this.openBind()
                    } else {
                        this.bind()
                    }
                }
            },
            bind(){
                individual.bindGoogleAuth({googleCode:this.googleCode},res=>{
                    Tip({type: 'success', message: this.$t(`error_code.BIND_SUCCESS`)})
                    this.getInfo()
                },msg=>{
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    this.lock = true
                })
            },
            openBind(){
                individual.unbindGoogleAuth({googleCode:this.googleCode},res=>{
                    Tip({type: 'success', message: this.$t(`error_code.RELEASE_SUCCESS`)})
                    this.getInfo()
                },msg=>{
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    this.lock = true
                })
            },
            getInfo(){
                userApi.userInfo(res => {
                    this.setUserInfo(res);
                    this.$router.push({name:'safe'})
                },msg=>{
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    this.lock = true
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .google-cont {
        margin: 0.3rem 0;

        .google {
            width: 3rem;
            height: 3rem;
            background: url("../../../assets/img/ear.png");
            background-size: 3rem 3rem;
            margin: 0.3rem auto;
            overflow: hidden;

            & > div {
                background: #ffffff;
                width: 2.6rem;
                height: 2.6rem;
                margin: 0.2rem;
                padding: 0.1rem;
            }
            /deep/ canvas{
                max-width: 100%;
            }
            /deep/ img {
                max-width: 100%;
            }
        }
    }

    .google-box {
        background: #2A2A34;
        padding: 0.2rem;
        border-radius: 0.1rem;
        margin-top: 0.2rem;
        div {
            p {
                padding: 0.2rem 0;
            }

            label {
                height: 0.45rem;
                display: flex;
                position: relative;
            }
        }

        .addres {
            small {
                border-bottom: 0.04rem solid #43434E;
                flex-grow: 1;
            }

            span {
                background: #00A0E9;
                padding: 0 0.2rem;
                border-radius: 0.1rem;
                line-height: 0.45rem;
            }
        }

        .inout {
            margin-bottom: 0.3rem;
            label {
                input {
                    width: 100%;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    background: none;
                    border: 0;
                    outline: 0;
                    font-size: 0.32rem;
                    color: #ffffff;
                    font-weight: 600;
                    letter-spacing: 0.69rem;
                    text-indent: 0.2rem;
                }
                ul{
                    width: 5rem;
                    display: flex;
                    position: absolute;
                    left: 0;
                    bottom: -0.2rem;
                    justify-content: space-between;
                    li{
                        width: 0.7rem;
                        height: 0.04rem;
                        background: #cccccc;
                    }
                    .active{
                        background: #00A0E9;
                    }
                }
            }
        }
    }
    .btn{
        margin-top: 0.4rem;
    }
</style>
