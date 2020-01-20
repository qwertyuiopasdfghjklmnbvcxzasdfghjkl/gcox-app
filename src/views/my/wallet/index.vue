<template>
  <div class="page">
    <div class="wallet-bar">
      <i class="icon_my" tag="i" v-tap="{methods:setMyActive}"></i>
      <i class="icon_wallet"></i>
      <i></i>
    </div>
    <div class="page-main">
      <ul v-for="(data,index) in sortedDatas" class="wallets" @click="goWalletDetail(data)" :key="data.accountId">
        <li>
          <div><img :src="`data:image/png;base64,${data.iconBase64}`"/></div>
          <div class="ml40">
            <p class="f34">{{data.symbol}}</p>
            <p class="ft-c-lightGray">{{data.caption}}</p>
          </div>
          <div class="ellipsis f30">{{data.totalBalance}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import numUtils from '@/assets/js/numberUtils'
import userUtils from '@/api/wallet'

export default {
  name: 'page-wallet',
  data () {
    return {
      accountType:1,
      sort:'asc'
    }
  },
  computed: {
    ...mapGetters(['getBTCValuation', 'getUSDCNY', 'getUserWallets']),
    sortedDatas () {
      let ndatas = this.getUserWallets.sort((item1, item2) => {
        let m1 = numUtils.BN(item1.totalBalance)
        let m2 = numUtils.BN(item2.totalBalance)
        if (m1.equals(m2)) {
          return item1.symbol < item2.symbol ? -1 : 1
        }
        return this.sort === 'desc' ? (m1.lt(m2) ? -1 : 1) : (m1.gt(m2) ? -1 : 1)
      })
      return ndatas
    },
  },
  created () {
    this.getList()
  },
  methods: {
    ...mapActions(['setUserWallets']),
    setMyActive(args){
      let _tar = $(args.event.currentTarget)
      _tar.addClass('active')
      setTimeout(()=>{
        _tar.removeClass('active')
        this.$router.push({name:'my'})
      },200)
    },
    goWalletDetail(data){
      if(this.accountType===1){
        this.$router.push({name:'page-trading', params:{symbol: data.symbol, symbolType: data.symbolType, index:data.index}})
      }
    },
    getList () {
      // if(this.getUserWallets.length){
      //   return
      // }
      Indicator.open()
      userUtils.myAssets({}, (resSet) => {
        Indicator.close()
        resSet = resSet.filter(item=>{
           return item.type===1
        })
        resSet.forEach((item) => {
          item.frozenBalance = numUtils.add(item.frozenBalance, item.adFrozenBalance).add(item.loanBalance).toString()
        })
        this.setUserWallets(resSet)
      }, (msg) => {
        Indicator.close()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.wallet-bar {
  padding:0 0.3rem;
  display: flex;
  justify-content: space-between;
  i {
    width: 0.7rem;
    height: 0.8rem;
    background-size: auto 0.6rem;
  }
  i.icon_my {
    background-image: url('../../../assets/img/icon_wd_a@3x.png');
    background-position: left center;
    &.active {
      background-image: url('../../../assets/img/icon_wd_b@3x.png');
    }
  }
  i.icon_wallet {
    /*background-image: url('../../assets/img/icon_sc_b@3x.png');*/
    background-position: right center;
  }
}
.wallets {
  padding:0.3rem;
  background-color: #fff;
  border-radius: 0.1rem;
  margin-bottom: 0.2rem;
  li {
    display: flex;
    div:last-of-type {
      flex: 1;
      text-align: right;
      min-width: 0;
      line-height: 0.7rem;
    }
    img {width: 0.7rem; height: 0.7rem; object-fit: contain; object-position: center;}
  }
}
</style>
