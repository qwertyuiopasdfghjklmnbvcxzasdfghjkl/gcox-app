<template>
  <div class="page">
    <mask-layer :show="popupLogin" :isgray="true" @hide="closePopupLogin">
      <div class="popupLogin">
        <p class="title"><img :src="game.icon||''" @error="setDefaultIcon($event)"><span class="ellipsis ml15 f32">{{game.name}}</span></p>
        <p class="tip-text mt40 f44">{{$t('find.authorizeTip')}}</p>
        <div class="user mt40">
          <img :src="getUserInfo.headerImagePath||''"  @error="setDefaultHead($event)">
          <div class="ml25">
            <p class="f36 mt10">{{$t('public0.userInfo')}}</p>
            <p class="f30 ft-c-lightGray mt5">{{getUserInfo.nickname || getUserInfo.username}}</p>
          </div>
        </div>
        <div class="action mt65">
          <mt-button type="default"  v-tap="{methods:authorize, status:false}">{{$t('public0.refuse')}}</mt-button>
          <mt-button type="primary" :disabled="lockedLogin" v-tap="{methods:authorize, status:true}">{{$t('public0.allows')}}</mt-button>
        </div>
      </div>
    </mask-layer>

    <mask-layer :show="popupPayment" :isgray="true" @hide="closePopupPayment">
      <div class="popupPayment">
        <i class="icon-cross f44 ft-c-lightGray" v-tap="{methods:closePopupPayment}"></i>
        <p class="f34 text-center input-tip">{{$t('find.enterPayPwd')}}</p>
        <div class="sepline mt30"></div>
        <p class="mt35 text-center f32 amount">{{displayNumber(Number($root.toFixed(orderData.amount)))}} {{orderData.symbol}}</p>
        <div class="login-form unselected">
          <div class="password-display"><span :class="{active:getActive(1)}">&nbsp;</span><span :class="{active:getActive(2)}">&nbsp;</span><span :class="{active:getActive(3)}">&nbsp;</span><span :class="{active:getActive(4)}">&nbsp;</span><span :class="{active:getActive(5)}">&nbsp;</span><span :class="{active:getActive(6)}">&nbsp;</span></div>
          <number-keyboard :value="password" @change="setPassword" :maxlength="6" class="mt60"></number-keyboard>
        </div>
      </div>
    </mask-layer>

    <mask-layer :show="popupWalletSelect" :isgray="true" @hide="closePopupWalletSelect">
      <div class="walletList">
        <div class="controls">
          <span v-tap="{methods:closePopupWalletSelect}">{{$t('public0.no')}}</span>
          <span v-tap="{methods:submitWallet}">{{$t('public0.ok')}}</span>
        </div>
        <mt-picker :slots="pickerWallets" :showToolbar="true" :visibleItemCount="7" :itemHeight="40" @change="selectWallet">
          <p class="selectTip">
            <span>{{$t('find.selectWallet')}}</span>
            <span>{{$t('public0.availableBalance')}}：{{getUserWallets[selectWalletIndex]&&getUserWallets[selectWalletIndex].availableBalance}} {{getUserWallets[selectWalletIndex]&&getUserWallets[selectWalletIndex].accountName}}</span>
          </p>
        </mt-picker>
      </div>
    </mask-layer>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import JsCookies from 'js-cookie'
import findApi from '@/api/find'
import utils from '@/assets/js/utils'
import userApi from '@/api/user'
import numUtils from '@/assets/js/numberUtils'
import userUtils from '@/api/wallet'
import DappDefault from '@/assets/img/dapp_none.png'
import HeadDefault from '@/assets/img/user_img@2x.png'
export default {
  name: 'gameSupport',
  data(){
    return {
      game:{},

      popupLogin:false,
      lockedLogin:false,
      gameData:{},

      popupPayment:false,
      password:'',
      payData:{},
      orderData:{},

      popupWalletSelect:false,
      selectWalletIndex:null,
      walletName:null,

    }
  },
  watch:{
    password(n, o){
      if(this.password.length==6){
        this.submitPayment()
      }
    },
  },
  computed:{
    ...mapGetters(['getUserInfo','getUserWallets','getQuickLoginInfo']),
    pickerWallets(){
      let values = [] 
      for(let wallet of this.getUserWallets || []){
        values.push(wallet.accountName)
      }
      return [{values: values}]
    },
  },
  beforeRouteEnter (to, from, next) {
    let game
    if(to.params.name){
      window.gameDetail = to.params
      game = to.params
    } else {
      game = window['gameDetail'] || {}
      game.cache = true
    }
    // console.log(game.gameUrl)
    if(!window['hasOpen']){
      window['cordova'] && cordova.exec(()=>{}, ()=>{
        Tip({type:'error', message:vm.$t('find.gameLoadError')})
      }, "XPlatform", "openUrl", [game.gameUrl])
      window.hasOpen = true
    }
    next(vm=>{
      // console.log('enter')
      vm.game = game
    })
  },
  created(){
    window.gameSupport = this
    X.paymentCB && X.paymentCB('Informal users')
    this.$nextTick(()=>{
      this.checkCache()
    })
    /*X.pay({data:'{"appid":"2222","out_trade_no":"013","prepay_id":"157194639755968512"}'}, (msg, data)=>{
      console.log('res==',msg, data)
    })*/
    /*if(!window['on']){
      alert(111)
      X.login({"appid":"2222"}, (msg, data)=>{
        console.log('res==',msg, data)
      })
    }*/
    /*X.selectAccount({}, (msg, data)=>{
      console.log('res==',msg, data)
    })*/
  },
  methods:{
    ...mapActions(['setUserWallets']),
    displayNumber(number){
      let result = String(number);
      if (result.indexOf('-') >= 0) {
         result = '0' + String(Number(result) + 1).substr(1);
      }
      return result
    },
    getWallets(){
      return new Promise((resolve, reject)=>{
        if(this.getUserWallets.length){
          resolve()
          return
        }
        userUtils.myAssets({}, (resSet) => {
          resSet = resSet.filter(item=>{
             return item.type===1
          })
          resSet.forEach((item) => {
            item.frozenBalance = numUtils.add(item.frozenBalance, item.adFrozenBalance).add(item.loanBalance).toString()
          })
          this.setUserWallets(resSet)
          resolve()
        }, (msg) => {
          Tip({type:'error', message:this.$t(`error_code.${msg}`)})
          resolve()
        })
      })
    },
    setPassword(value){
      this.password = value
    },
    selectWallet(picker, values){
      this.walletName = values
      let walletNames = []
      for(let wallet of this.getUserWallets){
        walletNames.push(wallet.accountName)
      }
      this.selectWalletIndex = walletNames.indexOf(values[0])
    },
    submitWallet(args){
      this.popupWalletSelect = false
      X.WalletSelectCB(null,{
        accountId: this.getUserWallets[this.selectWalletIndex]['accountId'],
        symbol: this.walletName[0]
      })
      this.removeCache('selectAccount')
      console.log('所选钱包=', this.walletName[0])
    },
    
    closePopupWalletSelect(){
      X.WalletSelectCB('Cancel',null)
      this.removeCache('selectAccount')
      this.popupWalletSelect = false
    },
    closePopupLogin(){
      X.authorizeCB('Refused',null)
      this.removeCache('login')
      this.popupLogin = false
    },
    closePopupPayment(){
      X.paymentCB('Cancel')
      X.paymentCB = null
      this.removeCache('pay')
      this.popupPayment = false
    },
    getActive(len){
      return this.password.length>=len? true: false
    },
    submitPayment(args){
      if(this.getQuickLoginInfo){
        Tip({type:'error', message:this.$t('public0.mobielBindTip'), delay:5000})
        this.$router.replace({
          name:'register',
          query:{ac:'bind'}
        })
        return
      }
      let data = {
        outTradeNo: this.orderData.outTradeNo,
        state: 1,
        prepayId: this.orderData.prepayId
      }
      userApi.getRsaPublicKey((rsaPublicKey) => {
          data.paidPwd = utils.encryptPwd(rsaPublicKey, this.password)
          data.publicKey = rsaPublicKey
          findApi.postPaymentOrder(this.orderData.appId, data, res=>{
            X.paymentCB(null)
            X.paymentCB = null
            this.removeCache('pay')
            this.popupPayment = false
            this.password = ''
            Tip({type:'success', message:this.$t('error_code.ORDER_PAY_SUCCESS')})
          }, msg=>{
            this.password = ''
            Tip({type:'error', message:this.$t(`error_code.${msg}`)})
          })
      }, () => {
          this.password = ''
      })
      console.log('提交支付')
    },
    authorize(args){
      if(args.status){
        this.getGameAauthorizeUser()
      } else {
        X.authorizeCB('Refused',null)
        this.removeCache('login')
      }
      this.popupLogin = false
    },
    setDefaultIcon(e){
      let tar = e.currentTarget
      tar.src = DappDefault
    },
    setDefaultHead(e){
      let tar = e.currentTarget
      tar.src = HeadDefault
    },
    getGameAauthorizeUser(){
      this.lockedLogin = true
      findApi.getGameAauthorizeUser(this.gameData.appid,res=>{
        window.X.authorizeCB(null,res)
        this.removeCache('login')
        this.lockedLogin = false
      },msg=>{
        Indicator.close()
        Tip({type:'error', message:this.$t(`error_code.${msg}`)})
        this.lockedLogin = false
      })
    },
    queryPaymentOrder(){
      findApi.queryPaymentOrder(this.payData.appid, {outTradeNo:this.payData.out_trade_no}, res=>{
        this.orderData = res
        this.popupPayment = true
      },msg=>{
        Tip({type:'error', message:this.$t(`error_code.${msg}`)})
      })
    },
    cacheMethod(type, data){
      let cache = window['supportCache'] || {}
      cache[type] = data
      window.supportCache = cache
    },
    removeCache(type){
      let cache = window['supportCache'] || {}
      delete cache[type]
      window.supportCache = cache
    },
    checkCache(){
      if(!this.game.cache){
        return
      }
      // console.log('cache')
      let cache = window['supportCache'] || {}
      let type = Object.keys(cache)
      if(type.includes('login')){
        X.login(cache['login'], X.authorizeCB)
      }
      if(type.includes('pay')){
        X.pay(cache['pay'], X.paymentCB)
      }
      if(type.includes('selectAccount')){
        X.selectAccount(cache['selectAccount'], X.WalletSelectCB)
      }
    }
  }
  
}

window.X = {
  login(data, cb) {
    setTimeout(()=>{
      gameSupport.cacheMethod('login',data)
      gameSupport.popupLogin = true
      gameSupport.gameData = data
      X.authorizeCB = cb
    },100)
  },
  pay(data, cb) {
    gameSupport.cacheMethod('pay',data)
    gameSupport.payData = JSON.parse(data.data)
    gameSupport.queryPaymentOrder()
    X.paymentCB = cb
  },
  selectAccount(data, cb) {
    gameSupport.cacheMethod('selectAccount',data)
    gameSupport.getWallets().then(()=>{
      gameSupport.popupWalletSelect = true
      X.WalletSelectCB = cb
    })
  },
  onCloseApp(){
    gameSupport.$router.back()
    window.hasOpen = false
  }
}

</script>

<style lang="less" scoped="">
.page {
  background-color: transparent;
  .mint-popup-bottom {
    width: 100vw;
    border-top-left-radius: 0.15rem;
    border-top-right-radius: 0.15rem;
    overflow: hidden;
  }
}
.popupLogin, .popupPayment, .walletList{
  position: fixed;
  left: 0;
  right: 0;
  bottom:0;
  background-color:#fff;
  z-index: 1200;
}
.popupLogin {
  padding: 0.3rem 0.3rem 0.9rem;
  .title {display: flex;}
  .title img {
    width: 0.4rem;
    height: 0.4rem;
    object-fit: cover;
    object-position: center;
    vertical-align: middle;
    margin-top: 0.04rem;
    border-radius:0.04rem;
  }
  .title span {flex: 1;}
  .user {
    display: flex;
    img {
      width: 1rem;
      height: 1rem;
      object-fit: cover;
      object-position: center;
      vertical-align: middle;
      border-radius:100%;
      border:1px solid #ccc;
    }
  }
  .action {
    display: flex;
    button {flex: 1;}
    button:last-of-type {margin-left: 0.3rem;}
  }
}

.popupPayment {
  padding: 0.3rem 0.3rem 0;
  i.icon-cross {
    position: absolute;
    left: 0.3rem;
    top: 0.3rem;
  }
  .sepline {height: 0; line-height: 0;font-size: 0;border-bottom: 1px solid #F2F2F2; margin-left: -0.3rem; margin-right: -0.3rem;}
}
.login-form {
  position: relative;
  margin: auto;
  text-align: center;
  .password-display{
    position: relative;
    margin-top: 0.3rem;
    text-align: center;
    margin-left: 0.6rem;
    margin-right: 0.6rem;
    display: flex;
    border: 1px solid #ccc;
    border-radius:0.08rem;
    span {
      flex: 1;
      height: 0.95rem;
      border-right: 1px solid #ccc;
      line-height: 0.95rem;
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
}

.walletList {
  .controls {
    display: flex;
    border-bottom:1px solid #eaeaea;
    span {
      flex: 1;
      text-align: center;
      line-height: 0.8rem;
      font-size: 0.36rem;
      color: #26a2ff;
      &:first-of-type{
        border-right:1px solid #eaeaea;
      }
    }
  }

}
.selectTip {
  display: flex;
  justify-content: space-between;
  font-size: 0.32rem;
  line-height: 40px;
  padding: 0 0.3rem;
  color: #666;
  text-align: center;
  span:last-of-type {
    color: #999;
  }
}
</style>
<style type="text/css">
  @media screen and (min-aspect-ratio: 13/9) {
    .popupLogin, .popupPayment, .walletList {
      width: 4.2rem;
      margin-left: auto;
      margin-right: auto;
    }
    .popupLogin {
      padding: 0.17rem 0.17rem 0.3rem !important;
    }
    .popupLogin .title span {font-size: 0.24rem!important;}
    .popupLogin .title img {width: 0.3rem!important; height: 0.3rem!important; margin-top: 0.02rem!important;}
    .popupLogin .tip-text {margin-top: 0.15rem!important; font-size: 0.26rem!important;}
    .popupLogin .user {margin-top: 0.2rem!important;}
    .popupLogin .user img{width: 0.6rem!important; height: 0.6rem!important;}
    .popupLogin .user > div {margin-left: 0.15rem!important;}
    .popupLogin .user > div p:first-of-type {font-size:0.24rem!important; margin-top: 0!important;}
    .popupLogin .user > div p:last-of-type {font-size:0.22rem!important;}
    .popupLogin .action {margin-top: 0.3rem!important;}
    .popupLogin .action button{font-size: 0.24rem!important; height: 0.54rem!important;}

    .popupPayment {
      padding: 0.15rem 0.3rem 0!important;
    }
    .popupPayment .keyboard {margin-top: 0.3rem!important;}
    .login-form .password-display {
      margin-top: 0.15rem!important;
      margin-left: 0.3rem!important;
      margin-right: 0.3rem!important;
      border-radius:0.04rem!important;
    }
    .login-form .password-display span {
      height: 0.45rem!important;
      line-height: 0.45rem!important;
    }
    .popupPayment .amount {font-size: 0.2rem!important; margin-top: 0.15rem!important;}
    .popupPayment .sepline {margin-top: 0.15rem!important;}
    .popupPayment i.icon-cross {
      left: 0.15rem!important;
      top: 0.2rem!important;
      font-size: 0.22rem!important;
    }
    .popupPayment .input-tip {font-size: 0.22rem!important;}

    .selectTip {
      font-size: 0.18rem!important;
      line-height: 40px!important;
      padding: 0 0.15rem!important;
    }
    .walletList .controls span {
      line-height: 0.5rem!important;
      font-size: 0.18rem!important;
    }
  }
</style>