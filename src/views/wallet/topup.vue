<template>
  <div class="page">
    <top-back> {{$t('exchange.collection')}} </top-back>
    <div class="page-main">
      <section class="wallet-contant">
        <div class="box item">
          <div class="inner">
            <div ref="qrcode" class="qrcode" id="picture"></div>
            <p class="first-child"><a v-tap="{methods:savePic}">{{$t('account.user_save_QRcode')}}<!--保存二维码到相册--></a></p>
            <p class="addres">{{$t('referral.address')}}</p>
            <p class="two f26">{{getAddress}}</p>
            <p class="three" v-tap="{methods:copy}">{{$t('referral.copy')}}<!--复制--></p>
            <template v-if="symbol==='EOS'">
              <div class="header mt80">
                <p class="text-center"><span>{{symbol}} {{$t('account.recharge_memo')}}<!--充值备注--></span></p>
              </div>
              <div ref="memoQrcode" class="qrcode" id="pictureMemo"></div>
              <p class="first-child"><a v-tap="{methods:savePicMemo}" >{{$t('account.user_save_QRcode')}}<!--保存二维码到相册--></a></p>
              <p class="addres">{{$t('referral.address')}}</p>
              <p class="two">{{symbolInfo.address}}</p>
              <p class="three" v-tap="{methods:copyMemo}">{{$t('referral.copy')}}<!--复制--></p>
            </template>
            <section>
              <div class="inner">
                <h1>{{$t('public0.public243')}}：<!--温馨提示--></h1>
                <ul>
                  <li>1. {{$t('account.user_prompt1').format(symbol)}}<!--禁止向{0}地址充值除{0}之外的资产，任何充入{0}地址的非{0}资产将不可找回。--></li>
                  <li>2. {{$t('account.user_prompt2').format(symbol, symbolInfo.blockConfirm)}}<!--使用{0}地址充值需要{1}个区块确认才能到账。--></li>
                  <li>3. {{$t('account.user_prompt10').format(symbol, symbolInfo.blockConfirm)}}<!--充值完成后，你可以进入历史记录页面跟踪进度。--></li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Toast } from 'mint-ui'
import utils from '@/assets/js/utils'
import userUtils from '@/api/wallet'
import cordovaUtils from '@/assets/js/cordovaUtils'
export default {
  name: 'page-topup',
  data () {
    return {
      symbol: '',
      EOS_MEMO:''
    }
  },
  computed: {
    ...mapGetters(['getUserWallets']),
    getAddress(){
      return this.symbol==='EOS'?this.EOS_MEMO:this.symbolInfo.address
    },
    symbolInfo () {
      let datas = this.getUserWallets, symbolInfo = {}
      for (let i = 0; i < datas.length; i++) {
        let d = datas[i]
        if (this.$route.params.symbol === d.symbol) {
          symbolInfo = d
          break
        }
      }
      return symbolInfo
    },
  },
  watch: {
    symbolInfo () {
      this.createQRCode()
      this.createMQRCode()
    },
    getAddress(){
      this.createQRCode()
    }
  },
  created () {
    this.symbol = this.$route.params.symbol
    if(this.symbol==='EOS' && !this.EOS_MEMO){
      this.getEosAddress()
    }
  },
  mounted(){
    this.createQRCode()
    this.createMQRCode()
  },
  methods: {
    getEosAddress(){
      userUtils.getEosAddress(data=>{
        this.EOS_MEMO = data
      })
    },
    createQRCode () {
      if (!this.symbolInfo.address) {
        return
      }
      this.$nextTick(() => {
        utils.qrcode(this.$refs.qrcode, {
          text: this.getAddress,
          width: 373,
          height: 373
        })
      })
    },
    createMQRCode () {
      if (!this.symbolInfo.address) {
        return
      }
      this.$nextTick(() => {
        utils.qrcode(this.$refs.memoQrcode, {
          text: this.symbolInfo.address,
          width: 373,
          height: 373
        })
      })
    },
    savePic () { // 保存图片
      cordovaUtils.saveImage(this.$refs.qrcode.querySelector('img').src)
    },
    savePicMemo(){ //保存备注图片
      cordovaUtils.saveImage(this.$refs.memoQrcode.querySelector('img').src)
    },
    copy () {
      utils.copyText(this.getAddress)
      Toast(this.$t('public0.public33')) // 复制成功
    },
    copyMemo() {
      utils.copyText(this.symbolInfo.address)
      Toast(this.$t('public0.public33')) // 复制成功
    }
  }
}
</script>

<style lang="less" scoped>
  @font_color_transparent:#cbd4ec;
  @fs_24:.28rem;
  @f_c_2:#8089a3;

  .padding-top-bottom-10{
    padding: .1rem 0;
  }
  .selected-title {
    font-size: 0.4rem;
    &:after{
      content: '';
      display: inline-block;
      border-top: 0.15rem  solid #cbd4ec;
      border-left: 0.13rem solid transparent;
      border-right: 0.13rem solid transparent;
      margin-left: 0.12rem;
      padding-bottom: 0.05rem;
    }
  }

  .wallet-list {
    width: 50%;
    margin:auto;
    color:#8089a3;
    li {
      line-height: 0.9rem;
      background-color: #181b2a;
      font-size: 0.36rem;
      text-align: center;
      border-bottom: 1px solid #262a42;
      &:hover {
        background-color: #E5E5E5;
      }
      &:last-of-type {
        border-bottom: none;
      }
    }
  }

  .header{
    font-size: .32rem;
  }

  /*内容*/
  .wallet-contant{
    padding-bottom:0.3rem;
    .item{
      text-align: center;
      background: #ffffff;
      border-radius: 0.2rem;
      >.inner{
        p.first-child{
          margin-top:0;
          font-size: .3rem;
          a{
            color: #4AC6C3;
            display: inline-block;
            background:rgba(74,198,195,.1);
            border-radius:0.1rem;
            text-decoration: none;
            text-align: center;
            padding:0.15rem 0.2rem 0.13rem;
          }
        }
        p.two{
          margin-top: .3rem;
        }
        p.three{
          display: inline-block;
          padding:0.12rem 0.16rem 0.1rem;
          background:rgb(241,241,241);
          border-radius:0.1rem;
          color: #999999;
          text-align: center;
          margin-top: 0.3rem;
        }
      }
      .addres{
        margin-top: 0.3rem;
        color: #aaaaaa;
        display: block;
      }
      section{
        margin-left: -0.3rem;
        margin-right: -0.3rem;
        margin-top: .4rem;
        border-top:1px solid #eeeeee;
        padding: 0.35rem;
        >.inner{
          padding:.1rem;
        }
        h1{
          text-align: left;
          font-size: .28rem;
          color: #222222;
          font-weight: bold;
        }
        ul li{
          font-size: .28rem;
          text-align: left;
          line-height: .36rem;
          padding-top: 0.15rem;
        }
      }
    }

    .qrcode{
      display: inline-block;
      width: 3rem;
      height: 3rem;
      margin: 0.8rem auto;
      padding: 0;
      background: #fff;
      /deep/ canvas {
        max-width: 100%;
      }
    }

    .bottom{
      padding: .15rem 0rem;
      font-size: .26rem;
      display: flex;
      justify-content: space-between;
      color: #cbd4ec;
      span{
        width: 1.75rem;
        text-align: left;
      }
    }
  }
</style>
