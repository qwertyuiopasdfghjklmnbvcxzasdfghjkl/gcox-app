<template>
  <div class="page">
    <top-back></top-back>
    <div class="page-main">
      <div class="minInner">
        <h3 class="register-title">
          <template v-if="isBind">{{$t('public0.mobielBind')}}</template>
          <template v-else>{{$t('public0.mobielRegister')}}</template>
        </h3>
        <div class="register-form mt35">
          <div class="register-content-input mobile-container">
            <div class="countryCode">
              <input type="tel" name="countryCode" :value="formData.countryCode" disabled="">
              <select v-model="formData.countryCode">
                <option v-for="item in areaCodeList" :value="item.code">{{$t(item.key)}}&nbsp;{{item.code}}</option>
              </select>
            </div>
            <div class="mobile">
              <input type="tel" name="mobile" maxlength="11" v-model="formData.mobile" v-validate="'required|telphone'" :placeholder="$t('public0.mobile')" v-focus><!--手机号-->
            </div>
          </div>
          <div class="register-content-input SMSCode">
            <input name="smsCode" maxlength="4" v-model="formData.smsCode" v-validate="'required'" :placeholder="$t('public0.smsCode')"><!--短信验证码-->
            <mt-button type="primary" class="mini sendSmsCode" :disabled="disabled" v-tap="{methods:sendSMSCode}">{{$t('public0.sendSmsCode')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</mt-button>
          </div>

          <div class="register-content-input password">
            <input type="text" uid="common-password" name="password" :class="!showpwd?'disc-input':''" v-model="formData.password" v-validate="'required|password'" :placeholder="$t('public0.password')" maxlength="16"><!--密码-->
            <i class="icon_showpwd" :class="{active:showpwd}" v-tap="{methods: ()=>{showpwd = !showpwd}}"></i>
          </div>
          <div class="register-content-input confirmPassword">
            <input type="text" name="passwordConfirm" :class="!showpwd?'disc-input':''" v-model="formData.passwordConfirm" v-validate="'required|passwordAgain'" :placeholder="$t('public0.passwordConfirm')" maxlength="16"><!--确认密码-->
          </div>
          <div class="register-content-input invitation" v-show="!isBind">
            <input name="ref" v-model="formData.ref" :placeholder="`${$t('public0.invitation')}（${$t('public0.optional')}）`"><!--邀请码-->
          </div>
          <div class="service text-center mt40" v-show="!isBind">
            <label for="service">
              <input id="service" type="checkbox" name="service" v-model="checked">
              <i type="checkbox"></i>
            </label>
            <span>
              <label for="service" class="ft-c-lightGray ml10">{{$t('public0.agreeService')}}<!--我已阅读并同意--></label>
              <a class="ft-c-main underline" :href="getAgreementUrl" target="_blank"> {{$t('public0.brandService').format(brand)}}<!--Xgame服务条款--></a>
            </span>
          </div>
          <div class="register-content-button mt80">
            <mt-button class="circle" :class="{disabled: locked || gtLocked}" type="primary" size="large" v-tap="{methods: register}">
              <template v-if="isBind">{{$t('public0.next')}}<!--下一步--></template>
              <template v-else>{{$t('public0.register')}}<!--注册--></template>
            </mt-button>
          </div>
          <p class="has-account ft-c-lightGray f32 unselected" @touchstart="toggleConsole" @touchend="clearLoop" v-show="!isBind">{{$t('public0.hasAccount').format(brand)}} <router-link class="ft-c-main" :to="{name:'login'}">{{$t('public0.login')}}</router-link></p>
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
import VConsole   from 'vconsole'

export default {
  name: 'register',
  data () {
    return {
      showPay:true,
      showpwd:false,
      areaCodeList: countryCode.areaCodeList,
      brand: config.brand.toUpperCase(),
      checked: false,
      locked: false, // 锁
      gtLocked: false,
      disabled: false,
      formData: {
        countryCode: countryCode.defaultCode,
        registerType: 1,
        mobile: '',
        smsCode: '',
        username: '',
        email: '',
        password: '',
        passwordConfirm: '',
        ref: ''
      },
      time: 60,
      loop:null
    }
  },
  computed: {
    ...mapGetters(['getApiToken']),
    isBind(){
      return this.$route.query.ac === 'bind' && this.getApiToken ? true :false
    },
    msgs () {
      return {
        mobile: {required: this.$t('public0.input') + this.$t('public0.mobile')}, // 请输入手机号
        smsCode: {required: this.$t('public0.input') + this.$t('public0.smsCode')}, // 请输入验证码
        password: {required: this.$t('public0.input') + this.$t('public0.password')}, // 请输入密码
        passwordConfirm: {required: this.$t('public0.input') + this.$t('public0.passwordConfirm')} // 请再次输入密码
      }
    },
    getAgreementUrl () {
      if (this.getLang === 'zh-CN' || this.getLang === 'cht') {
        return '#'
      } else {
        return '#'
      }
    }
  },
  watch: {
    'formData.registerType' () {
      this.$validator.reset()
    },
    $route () {
      this.formData.ref = utils.getUrlHashParams().ref
    }
  },
  created () {
    this.formData.ref = utils.getUrlHashParams().ref
    if(this.getApiToken && this.$route.query.ac !== 'bind'){
      this.$router.replace({path:'/'})
    }
  },
  methods: {
    ...mapActions(['setApiToken', 'setUserInfo']),
    sendSMSCode () {
      if (this.disabled) {
        return
      }
      if (!this.formData.mobile) {
        Tip({type: 'danger', message: this.$t('public0.public6')})
        return
      }
      this.disabled = true
      userApi.sendSMSCode({
        countryCode: this.formData.countryCode,
        phoneNumber: this.formData.mobile
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
        Tip({type: 'success', message: msg})
      })
    },
    register () {
      $('input').blur()
      var formData = {}
      for (let i in this.formData) {
        formData[i] = this.formData[i]
      }
      if (Number(formData.registerType) === 0) { // 邮箱注册
        delete formData.mobile
        delete formData.smsCode
        delete formData.countryCode
        formData.username = formData.email
      } else {
        formData.username = formData.mobile
        delete formData.email
      }
      this.$validator.validateAll(formData).then((validResult) => {
        if (!validResult) {
          let items = this.errors.items
          if (items && items.length && items[0]) {
            let name = items[0].field
            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
            Tip({type: 'danger', message: msg})
          }
          return
        }
        if (!this.isBind && !this.checked) {
          Tip({type: 'danger', message: this.$t('public0.public122')})
          return
        }
        if (this.locked) {
          return
        }
        this.gtLocked = true
        utils.gtValidate((gtParams) => {
          for (let i in gtParams) {
            formData[i] = gtParams[i]
          }
          this.locked = true
          userApi.getRsaPublicKey((rsaPublicKey) => {
            formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
            formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
            formData.rsaPublicKey = rsaPublicKey
            formData.paidCheck = false
            let method = this.isBind?'updateGameFastRegister':'register'
            userApi[method](formData, (msg) => {
              this.locked = false
              formData.password = this.formData.password
              formData.passwordConfirm = this.formData.passwordConfirm
              this.$router.push({name: 'paymentSet', params:formData, query:{ac:'bind'}})
            }, (msg) => {
              this.locked = false
              Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
            })
          }, () => {
            this.locked = false
          })
        }, () => {
          this.gtLocked = false
        })
      })
    },
    toggleConsole(event) { //激活、隐藏调试器
      clearInterval(this.loop);//再次清空定时器，防止重复注册定时器
      this.loop=setTimeout(()=>{
        if(!window['vConsole']){
          window.vConsole = new VConsole()
        } else {
          $('#__vconsole').remove()
          window.vConsole = null
        }
      },5000);
    },
    clearLoop(args) {
        clearInterval(this.loop);
    },
  }
}
</script>

<style lang="less" scoped>
.register-title {
  margin-top: 0.5rem;
  color: #9DAAAA;
  font-size: 0.52rem;
}
.register-content-input {
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
.has-account {
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
}
.countryCode {
  width: 0.8rem;
  position: relative;
  input {
    background: url('../assets/img/ic_up@2x.png') no-repeat right center;
    background-size: 0.15rem auto;
  }
  select {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 1;
  }
}
.mobile-container {
  display: flex;
  .mobile {flex: 1; margin-left: 0.2rem;}
}
.sendSmsCode {position: absolute; right: 0; background-color: transparent!important; color: #4AC6C3; padding-right: 0;}
.sendSmsCode:disabled {color: #999;}
.mint-button.sendSmsCode::after {background-color: transparent;}
.service {
  > label {
    display: inline-block;
    width: .26rem;
    height: .26rem;
    vertical-align: top;
    input {
      display: none;
      &:checked {
        + i {
          background-color: #4AC6C3;
          border-color:#4AC6C3;
          &::before {
            border-color: #fff;
          }
        }
      }
    }
    i {
      position: relative;
      display: block;
      width: .26rem;
      height: .26rem;
      border: 2px solid #999;
      border-radius: 2px;
      margin-top: 0.04rem;
      overflow: hidden;
      &::before {
        content: "";
        position: absolute;
        top: -0.07rem;
        left: -0.03rem;
        width: .2rem;
        height: .2rem;
        border-width: 0 2px 2px 0;
        border-style: solid;
        border-color: transparent;
        border-radius: 2px;
        transform: rotate(45deg);
      }
    }
  }
}
</style>
