<template>
  <div class="page">
    <top-back></top-back>
    <div class="page-main">
      <div class="minInner">
        <h3 class="login-title">{{$t('public0.login')}}</h3>
        <div class="login-form mt35">
          <div class="login-content-input username">
            <input type="tel" maxlength="11" name="username" v-model="formData.username" :placeholder="$t('public0.mobile')" v-focus><!--手机号-->
          </div>
          <div class="login-content-input password">
            <input type="text" name="password" :class="!showpwd?'disc-input':''" v-model="formData.password" :placeholder="$t('public0.password')" maxlength="16"><!--密码-->
            <i class="icon_showpwd" :class="{active:showpwd}" v-tap="{methods: ()=>{showpwd = !showpwd}}"></i>
          </div>
          <div class="login-content-button mt80">
            <mt-button type="primary" class="circle" :disabled="locked||gtLocked" size="large" v-tap="{methods:login}">{{$t('public0.login')}}<!--登录--></mt-button>
          </div>
          <p class="ft-c-main mt45 text-center"><router-link tag="span" :to="{name:'findpwd'}">{{$t('public0.forgetPassword')}}<!--忘记密码--></router-link></p>
          <p class="no-account ft-c-lightGray f32">{{$t('public0.noAccount').format(brand)}} <router-link class="ft-c-main" :to="{name:'register'}">{{$t('public0.registerNow')}}</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import utils from '@/assets/js/utils'
import userApi from '@/api/user'
import myAPi from '@/api/individual'
import config from '@/api/config'

export default {
  name: 'login',
  data () {
    return {
      brand: config.brand.toUpperCase(),
      curl:'', //登录回调地址
      showpwd: false,
      locked: false, // 锁
      gtLocked: false,
      formData: {
        username: '',
        password: ''
      },
      account: '',
      password: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm=>{
      vm.curl = to.query.curl || '/ucenter'
    })
  },
  created () {

  },
  methods: {
    ...mapActions(['setApiToken', 'setUserInfo','setQuickLoginInfo']),
    login (args) {
      $('input').blur()
      if (!this.$root.trim(this.formData.username,1)) {
        Tip({type: 'danger', message: this.$t('public0.input')+this.$t('public0.mobile')})
        $('.login-form input[name=username]').focus()
        return
      }
      if (!this.formData.password) {
        Tip({type: 'danger', message: this.$t('public0.input')+this.$t('public0.password')})
        $('.login-form input[name=password]').focus()
        return
      } else {
        if (this.locked) {
          return
        }
        this.gtLocked = true
        utils.gtValidate((gtParams) => {
          this.locked = true
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
            userApi.login(formData, (apiToken, res) => {
              if (apiToken) {
                this.setApiToken(apiToken)
                this.setQuickLoginInfo(null) //正常登录清除快速登录信息
                myAPi.addLoginHistory()
                this.getInfo()
                Tip({type: 'success', message: this.$t(`user.loginSuccess`)})
                if(this.curl){
                  this.$router.replace({path:this.curl})
                } else {
                  this.$router.replace({path: '/'})
                }
                return
              }
              // 二次验证
              this.$router.push({
                name: 'twoverify',
                params: {
                  username: this.formData.username,
                  type: res.type,
                  countryCode: res.countryCode,
                  mobile: res.mobile
                },
                query:{curl:this.curl}
              })
            }, (msg, rst) => {
              this.locked = false
              Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
              /*if (rst === 300) {
                this.$router.push({name: 'sendemail', params: {email: this.formData.username}})
                console.log(this.formData.username)
              }*/
            })
          }, () => {
            this.locked = false
          })
        }, () => {
          this.gtLocked = false
        })
      }
    },
    getInfo(){
        userApi.userInfo(res => {
            this.setUserInfo(res);
        })
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
  min-height: 1rem;
  margin-top: 0.1rem;
  padding-top: 0.25rem;
  border-bottom: 1px solid #ccc;
  position: relative;
  input {
    height: 0.5rem;
    width: 100%;
    font-size: 0.32rem;
    color: #333333;
    border:none;
    background-color: transparent;
  }
  .icon_showpwd {
    position: absolute;
    right: 0;
    top: 50%;
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
</style>
