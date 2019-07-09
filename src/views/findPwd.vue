<template>
  <div class="page">
    <top-back></top-back>
    <div class="page-main">
      <h3 class="register-title">{{$t('public0.findpwd')}}</h3>
      <div class="register-form mt35">
        <div class="register-content-input mobile-container">
          <div class="countryCode">
            <input type="tel" name="countryCode" :value="countryCode" disabled="">
            <select v-model="countryCode">
              <option v-for="item in areaCodeList" :value="item.code">{{$t(item.key)}}&nbsp;{{item.code}}</option>
            </select>
          </div>
          <div class="mobile">
            <input type="tel" name="phoneNumber" maxlength="11" v-model="mobileFormData.phoneNumber" v-validate="'required|telphone'" :placeholder="$t('public0.mobile')" v-focus><!--手机号-->
          </div>
        </div>
        <div class="register-content-input SMSCode">
          <input name="smsCode" maxlength="6" v-model="mobileFormData.smsCode" v-validate="'required'" :placeholder="$t('public0.smsCode')"><!--短信验证码-->
          <mt-button type="primary" class="mini sendSmsCode" :disabled="disabled" v-tap="{methods:sendSMSCode}">{{$t('public0.sendSmsCode')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</mt-button>
        </div>

        <div class="register-content-input password">
          <input type="text" uid="common-password" name="password" :class="!showpwd?'disc-input':''" v-model="mobileFormData.password" v-validate="'required|password'" :placeholder="$t('public0.password')" maxlength="16"><!--密码-->
          <i class="icon_showpwd" :class="{active:showpwd}" v-tap="{methods: ()=>{showpwd = !showpwd}}"></i>
        </div>
        <div class="register-content-input confirmPassword">
          <input type="text" name="passwordConfirm" :class="!showpwd?'disc-input':''" v-model="mobileFormData.passwordConfirm" v-validate="'required|passwordAgain'" :placeholder="$t('public0.passwordConfirm')" maxlength="16"><!--确认密码-->
        </div>

        <div class="register-content-button mt80">
          <mt-button class="circle" :class="{disabled: locked || gtLocked}" type="primary" size="large" v-tap="{methods: updatePwd}">{{$t('public0.ok')}}<!--确定--></mt-button>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import countryCode from '@/api/countryCode'
import utils from '@/assets/js/utils'
import userApi from '@/api/user'
import myAPi from '@/api/individual'

export default {
  name: 'findpwd',
  data () {
    return {
      showpwd:false,
      areaCodeList: countryCode.areaCodeList,
      countryCode: countryCode.defaultCode,
      locked: false,
      gtLocked: false,
      findpwdType: 1,
      mobileFormData: {
        phoneNumber: '',
        smsCode: '',
        password: '',
        passwordConfirm: ''
      },
      disabled: false,
      time: 60
    }
  },
  computed: {
    msgs () {
      return {
        phoneNumber: {required: this.$t('public0.input') + this.$t('public0.mobile')}, // 请输入手机号
        smsCode: {required: this.$t('public0.input') + this.$t('public0.smsCode')}, // 请输入验证码
        password: {required: this.$t('public0.input') + this.$t('public0.password')}, // 请输入密码
        passwordConfirm: {required: this.$t('public0.input') + this.$t('public0.passwordConfirm')} // 请再次输入密码
      }
    }
  },
  watch: {
    findpwdType () {
      this.$nextTick(() => {
        this.$validator.reset()
      })
    }
  },
  created () {
    
  },
  methods: {
    ...mapActions(['setApiToken', 'setUserInfo']),
    updatePwd () {
      if (this.locked) {
        return
      }
      console.log(this.mobileFormData)
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
        utils.gtValidate((gtParams) => {
          this.locked = true
          let formData = {}
          for (let i in this.mobileFormData) {
            formData[i] = this.mobileFormData[i]
          }
          for (let i in gtParams) {
            formData[i] = gtParams[i]
          }
          userApi.getRsaPublicKey((rsaPublicKey) => {
            formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
            formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
            formData.rsaPublicKey = rsaPublicKey
            userApi.mobileResetPwd(formData, () => {
              Tip({type: 'success', message: this.$t('public0.successful')}) // 操作成功
              setTimeout(() => {
                this.locked = false
                this.$router.push({name: 'login'})
              }, 1500)
            }, (msg) => {
              this.locked = false
              Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
            })
          }, () => {
            this.locked = false
          })
        })
      })
    },
    sendSMSCode () {
      if (this.disabled) {
        return
      }
      if (!this.mobileFormData.phoneNumber) {
        Tip({type: 'danger', message: this.$t('public0.public6')}) // 请输入手机号
        return
      }
      this.disabled = true
      myAPi.sendAuthSMSCode({
        countryCode: this.countryCode,
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
        setTimeout(timeOut, 1000)
        Tip({type: 'success', message: this.$t('error_code.SEND_CODE_SUCCESS')})
      }, (msg) => {
        this.disabled = false
        Tip({type: 'success', message: msg})
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

</style>
