<template>
<div class="page">
    <top-back :back="!isConfirm"><i class="btn-back" v-show="isConfirm" v-tap="{methods:()=>{isConfirm = false,password = ''}}"></i></top-back>
	<div class="page-main">
		<h3 class="register-title">{{$t('public0.payPwd')}}</h3>
		<template v-if="!isConfirm">
		<p class="mt70 f32 ft-c-deepGray">{{$t('find.setPayPwd')}}</p>
		<div class="password-display"><span :class="{active:getActive(1)}">&nbsp;</span><span :class="{active:getActive(2)}">&nbsp;</span><span :class="{active:getActive(3)}">&nbsp;</span><span :class="{active:getActive(4)}">&nbsp;</span><span :class="{active:getActive(5)}">&nbsp;</span><span :class="{active:getActive(6)}">&nbsp;</span></div>
		<div class="popKeyboard">
			<number-keyboard :value="password" @change="setPassword" :maxlength="6"></number-keyboard>
		</div>
		</template>
		<template v-if="isConfirm">
		<p class="mt70 f32 ft-c-deepGray">{{$t('find.setConfirmPayPwd')}}</p>
		<div class="password-display"><span :class="{active:getConfirmActive(1)}">&nbsp;</span><span :class="{active:getConfirmActive(2)}">&nbsp;</span><span :class="{active:getConfirmActive(3)}">&nbsp;</span><span :class="{active:getConfirmActive(4)}">&nbsp;</span><span :class="{active:getConfirmActive(5)}">&nbsp;</span><span :class="{active:getConfirmActive(6)}">&nbsp;</span></div>
		<div class="mt70">
			<mt-button type="primary" size="large" class="circle" :disabled="!getConfirmActive(6)" v-tap="{methods:checkPayPwd}">{{$t('public0.finish')}}</mt-button>
		</div>
		<div class="popKeyboard">
			<number-keyboard :value="confirmPassword" @change="setConfirmPassword" :maxlength="6"></number-keyboard>
		</div>
		</template>
	</div>
	
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import utils from '@/assets/js/utils'
import userApi from '@/api/user'
export default {
	name:'',
	data(){
		return {
			locked:false,
			password:'',
			confirmPassword:'',
			isConfirm:false,
			formData:{},
		}
	},
	computed: {
	  ...mapGetters(['getApiToken']),
	  isBind(){
	    return this.$route.query.ac === 'bind' && this.getApiToken ? true :false
	  },
	},
	watch:{
	  password(n, o){
	    if(this.password.length==6){
	      this.isConfirm = true
	      this.confirmPassword = ''
	    }
	  },
	},
	created(){
		if(JSON.stringify(this.$route.params) === '{}'){
			this.$router.replace({name:'register'})
		} else {
			this.formData = this.$route.params
			console.log(this.formData)
		}
	},
	methods:{
		...mapActions(['setUserInfo','setQuickLoginInfo']),
		checkPayPwd(){
			if (this.locked) {
			  return
			}
			if(this.password!==this.confirmPassword){
				Tip({type:'error', message:this.$t('find.payPwdNotSame')})
			} else {
				this.formData.paidCheck = true
				this.locked = true
				userApi.getRsaPublicKey((rsaPublicKey) => {
					this.formData.rsaPublicKey = rsaPublicKey
					this.formData.password = utils.encryptPwd(rsaPublicKey, this.formData.password)
					this.formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, this.formData.passwordConfirm)
					this.formData.paidPwd = utils.encryptPwd(rsaPublicKey, this.password)
					this.formData.paidPwdConfirm = utils.encryptPwd(rsaPublicKey, this.confirmPassword)
					let method = this.isBind?'updateGameFastRegister':'register'
					userApi[method](this.formData, (msg) => {
					  this.locked = false
					  let _tip = this.isBind?'updateUserSucess':'registerSucess'
					  Tip({type: 'success', message: this.$t(`find.${_tip}`)})
					  if(this.isBind){
					  	userApi.userInfo(res => {
					  	    this.setUserInfo(res);
					  	})
					  	this.setQuickLoginInfo(null) //绑定为正式用户，清除快速登录信息
					  }
					  setTimeout(() => {
					    this.$router.replace({name: this.isBind?'find':'login'})
					  }, 1500)
					}, (msg) => {
					  this.locked = false
					  Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
					})
				}, () => {
				  this.locked = false
				})
			}
		},
		getActive(len){
		  return this.password.length>=len? true: false
		},
		getConfirmActive(len){
		  return this.confirmPassword.length>=len? true: false
		},
		setPassword(value){
	      this.password = value
	    },
	    setConfirmPassword(value){
	      this.confirmPassword = value
	    },
	}

}
</script>

<style lang="less" scoped="">
.register-title {
  margin-top: 0.5rem;
  color: #9DAAAA;
  font-size: 0.52rem;
}
.popKeyboard {
	position: fixed;
	left: 0;
	right: 0;
	bottom:0;
	background-color:#fff;
	z-index: 1200;
	box-shadow: 0 -0.03rem 0.12rem rgba(0,0,0,.1);
}
.password-display{
  position: relative;
  margin-top: 0.3rem;
  text-align: center;
  display: flex;
  border: 1px solid #ccc;
  border-radius:0.08rem;
  background-color: #fff;
  span {
    flex: 1;
    height: 1rem;
    border-right: 1px solid #ccc;
    line-height: 1rem;
    &:last-of-type {
      border-right: none;
    }
    &.active:after {
      display: inline-block;
      content: '';
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background-color: #333;
      vertical-align: middle;
    }
  }
}
.btn-back {
  position: absolute;
  width: 15vw;
  height: 0.5rem;
  left: 0;
  background: url('../assets/img/icon_back_b@3x.png') no-repeat 0.3rem center;
  background-size: 0.4rem auto;
}
</style>