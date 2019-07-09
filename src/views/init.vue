<template>
  <div class="page">
    <div class="page-main">
      <i class="icon_logo"></i>
      <div class="actions">
        <mt-button type="primary" size="large" class="circle" :disabled="locked" v-tap="{methods:fastRegister}">{{$t('find.oneClickReg')}}</mt-button>
        <mt-button type="primary" size="large" class="circle mt50" v-tap="{methods:$root.routeTo, to:'register'}">{{$t('find.newReg')}}</mt-button>
        <mt-button type="danger" size="large" class="circle mt50" v-tap="{methods:$root.routeTo, to:'login'}">{{$t('find.loginNow')}}</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import userApi from '@/api/user'
import utils from '@/assets/js/utils'
import md5 from 'js-md5'
export default {
  name: 'init',
  data(){
    return {
      locked:false
    }
  },
  computed:{
    ...mapGetters([]),
    
  },
  created(){
    
  },
  methods:{
    ...mapActions(['setApiToken','setUserInfo','setQuickLoginInfo']),
    fastRegister(){
      let device = window['device'] || {"available":true,"platform":"Android","version":"7.0","uuid":"1ce8fede7c8784d7","cordova":"8.0.0","model":"KNT-AL10","manufacturer":"HUAWEI","isVirtual":false,"serial":"69DDU16515023463"}, time = new Date().getTime(), md5String = md5(`${JSON.stringify(device)}${time}`)
      this.locked = true
      Indicator.open()
      this.getRsaPublicKey().then(rsaPublicKey=>{
        if(rsaPublicKey){
          let dataStr = JSON.stringify({device:JSON.stringify(device), time:time, md5:md5String}), encryptedData = [], divNum = 117
          for(let n=0; n<Math.ceil(dataStr.length/divNum); n++){
            encryptedData.push(utils.encryptPwd(rsaPublicKey, dataStr.slice(n*divNum,(n+1)*divNum)))
          }
          userApi.fastRegister({rsaPublicKey:rsaPublicKey, encryptedData:encryptedData}, res=>{
            Indicator.close()
            this.setApiToken(res.apiToken)
            this.setUserInfo(res)
            this.setQuickLoginInfo(res)
            this.$router.replace({path:'/'})
            Tip({type:'success', message:this.$t('find.registerSucess')})
          }, msg=>{
            this.locked = false
            Indicator.close()
            Tip({type:'error', message:this.$t(`error_code.${msg}`)})
          })
        } else {
          this.locked = false
          Indicator.close()
          Tip({type:'error', message:this.$t('error_code.RSA_PUBLIC_KEY_ERROR')})
        }
      })

    },
    getRsaPublicKey(){
      return new Promise((resolve, reject)=>{
        userApi.getRsaPublicKey((rsaPublicKey) => {
          resolve(rsaPublicKey)
        },()=>{
          resolve('')
        })
      })
    },
  }
  
}
</script>

<style lang="less" scoped="">
.page-main {
  top: 0;
  background:-webkit-linear-gradient(#FFF, #DAD8D8);
  background:linear-gradient(#FFF, #DAD8D8);
}
.icon_logo {
  position:absolute;
  top: 1.9rem;
  left: 50%;
  height: 1.61rem;
  width: 2.35rem;
  margin-left: -1.17rem;
  background-image:url('../assets/img/logo_full.png');
}
.actions {
  position: absolute;
  left: 0.55rem;
  right: 0.55rem;
  bottom: 1.2rem;
}
</style>