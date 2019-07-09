<template>
	<div class="page">
		<top-back>{{$t('find.searchResult')}}</top-back>
		<div class="page-main dapps" :class="{nodata:!dapps.length}">
			<ul class="list">
				<li v-for="dapp in dapps" v-tap="{methods:$root.routeTo, to:'dappDetail', params:{gameId:dapp.gameId}}">
					<img :src="dapp.icon||''" @error="setDefaultIcon($event)">
					<div>
						<div>
							<p class="ellipsis f32 mt10">{{dapp.name}}</p>
							<p class="ellipsis ft-c-lightGray mt10">{{dapp.profile}}</p>
						</div>
						<i class="icon-dots-three-horizontal ft-c-lightGray mt40"></i>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import findApi from '@/api/find'
import DappDefault from '@/assets/img/dapp_none.png'

export default{
	data(){
	    return {
	    	dapps:[],
	    }
	},
	created(){
		this.getGames()
	},
	mounted() {
	},
	methods:{
		getGames(){
			Indicator.open()
			findApi.getGames({keyword:this.$route.query.key},res=>{
				this.dapps = res
				Indicator.close()
			},msg=>{
				Indicator.close()
				Tip({type:'error', message:this.$t(`error_code.${msg}`)})
			})
		},
		setDefaultIcon(e){
		  let tar = e.currentTarget
		  tar.src = DappDefault
		},
	}
}
</script>
<style lang="less" scoped="">
.dapps {
	background-color: #fff;
	border-radius:0.1rem;
	box-shadow: 0 0.02rem 0.1rem rgba(0,0,0,.1);
	padding-left:0.4rem;
	padding-right:0.4rem;
	.list {
		padding-top: 0.4rem;
		padding-bottom: 0.4rem;
		li{ 
			padding-top: 0.25rem;
			display: flex;
			img {display: block; width: 0.96rem; height: 0.96rem; border-radius:0.1rem; object-fit: cover; object-position: center;}
			> div {
				flex: 1; display: flex; margin-left: 0.3rem; padding-bottom: 0.25rem; border-bottom: 1px solid #E4E4E4;
				> div {flex: 1;}
			}
			&:first-of-type {padding-top: 0;}
		}
	}
}
</style>