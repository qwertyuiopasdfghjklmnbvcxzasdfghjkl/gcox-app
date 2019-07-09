<template>
  <div class="search-bar">
  	<i class="icon_my" tag="i" v-tap="{methods:setMyActive}"></i>
    <div>
    	<input type="search" name="search" :placeholder="$t('find.searchPlaceHold')" v-model="search" @input="$emit('change', search)">
    </div>
    <i class="icon_scanner" v-tap="{methods:scanQRCode}"></i>
  </div>
</template>

<script>
import cordovaUtils from '@/assets/js/cordovaUtils'
export default {
  data(){
  	return {
  		search:''
  	}
  },
  computed:{
  	show(){
  		return $.trim(this.search).length>0
  	}
  },
  methods:{
  	scanQRCode() {
  	    cordovaUtils.scanQRCode((data) => {
  	        console.log(data)
  	    })
  	},
  	setMyActive(args){
  		let _tar = $(args.event.currentTarget)
  		_tar.addClass('active')
  		setTimeout(()=>{
  			_tar.removeClass('active')
  			this.$router.push({name:'my'})
  		},200)
  	}
  }
}
</script>

<style lang="less" scoped="">
.search-bar {
	padding:0 0.3rem;
	display: flex;
	justify-content: space-between;
	.icon_my {
		width: 0.7rem;
		height: 0.8rem;
		background-image: url('../../../assets/img/icon_wd_a@3x.png');
		background-size: auto 0.6rem;
		background-position: left center;
		&.active {
			background-image: url('../../../assets/img/icon_wd_b@3x.png');
		}
	}
	.icon_scanner {
		width: 0.7rem;
		height: 0.8rem;
		background-image: url('../../../assets/img/scanner.png');
		background-size: auto 0.6rem;
		background-position: right center;
	}
	div {flex: 1;}
	input {
		border:none;
		border-radius:0.08rem;
		box-shadow: 0 0 0.06rem rgba(0,0,0,.1);
		width: 100%;
		height:0.8rem;
		line-height: 0.8rem;
		padding-left: 0.6rem;
		padding-right: 0.2rem;
		background:url('../../../assets/img/i_search@2x.png') #fff no-repeat 0.2rem center;
		background-size: 0.32rem auto;
		font-size: 0.3rem;
		color: #999;
	}
}
</style>
