<template>
  <div class="page">
    <top-back>{{$t('user.changePaymentPassword')}}</top-back>
    <div class="page-main">
      <div class="change-form mt60">
        <p class="f32 mb40">{{getUserInfo.countryCode}} {{getUserInfo.username|encrypt}}</p>
        <div class="change-content-input">
          <input type="tel" name="password" :class="!showpwd?'disc-input':''" v-model="formData.password" :placeholder="$t('find.setPayPwd')" maxlength="6" autocomplete="off" oninput = "value=value.replace(/[^\d]/g,'')" v-focus><!--密码-->
          <i class="icon_showpwd" :class="{active:showpwd}" v-tap="{methods: ()=>{showpwd = !showpwd}}"></i>
        </div>
        <div class="change-content-input">
          <input type="tel" name="passwordConfirm" :class="!showpwd?'disc-input':''" v-model="formData.passwordConfirm" :placeholder="$t('find.setConfirmPayPwd')" maxlength="6" autocomplete="off" oninput = "value=value.replace(/[^\d]/g,'')"><!--确认密码-->
        </div>
        <div class="change-content-input">
          <input type="text" name="loginPassword" :class="!showpwd?'disc-input':''" v-model="formData.loginPassword" :placeholder="$t('user.enterLoginPwd')" maxlength="16"><!--登录密码-->
        </div>
        <div class="change-content-input">
          <input type="text" name="smsCode" v-model="formData.smsCode" :placeholder="$t('public0.smsCode')" maxlength="6"><!--短信验证码-->
          <mt-button type="primary" class="mini sendSmsCode" :disabled="disabled" v-tap="{methods:sendSMSCode}">{{$t('public0.sendSmsCode')}}<!--发送验证码-->{{disabled ? `（${time}s）` : ''}}</mt-button>
        </div>
        <div class="change-content-button mt80">
          <mt-button type="primary" class="circle" :disabled="formData.password.length!==6 || gtLocked" size="large" v-tap="{methods:setPayPwd}">{{$t('public0.finish')}}<!--完成--></mt-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import utils from '@/assets/js/utils'
import userApi from '@/api/user'
import myAPi from '@/api/individual'
export default {
  name: 'changePaymentPassword',
  data () {
    return {
      showpwd: false,
      locked:false,
      gtLocked: false,
      disabled: false,
      time: 60,
      formData:{
        loginPassword:'',
        password:'',
        passwordConfirm:'',
        smsCode:''
      },
    }
  },
  computed:{
    ...mapGetters(['getUserInfo']),
  },
  created () {

  },
  methods: {
    setPayPwd(){
      if(this.locked){
        return
      }
      if(this.formData.passwordConfirm===''){
        Tip({type:'error', message:this.$t('find.setConfirmPayPwd')})
        return
      }
      if(this.formData.password!==this.formData.passwordConfirm){
        Tip({type:'error', message:this.$t('find.payPwdNotSame')})
        return
      }
      if(this.formData.loginPassword===''){
        Tip({type:'error', message:this.$t('user.enterLoginPwd')})
        return
      }
      if(this.formData.smsCode===''){
        Tip({type:'error', message:this.$t('public0.input') + this.$t('public0.smsCode')})
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
              formData.phoneNumber = this.getUserInfo.username
              formData.loginPassword = utils.encryptPwd(rsaPublicKey, formData.loginPassword)
              formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
              formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
              formData.rsaPublicKey = rsaPublicKey
              userApi.resetTransactionPwd(formData, (msg) => {
                  this.locked = false
                  Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                  this.$router.replace({name: 'ucenter'})
              }, (msg) => {
                  this.locked = false
                  Tip({
                      type: 'danger',
                      message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)
                  })
              })
          }, () => {
              this.locked = false
          })
      }, () => {
          this.gtLocked = false
      })
    },
    sendSMSCode () {
      if (this.disabled) {
        return
      }
      this.disabled = true
      myAPi.sendAuthSMSCode({
        countryCode: this.getUserInfo.countryCode,
        phoneNumber: this.getUserInfo.username
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
  }
}
</script>

<style lang="less" scoped>
.change-content-input {
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
    background-image: url('../../assets/img/eye_closed@2x.png');
    &.active {
      background-image: url('../../assets/img/eye_open@2x.png');
    }
  }
}
.sendSmsCode {position: absolute; right: 0; background-color: transparent!important; color: #4AC6C3; padding-right: 0;}
.sendSmsCode:disabled {color: #999;}
.mint-button.sendSmsCode::after {background-color: transparent;}

</style>
