<template>
	<div class="mydapps" v-if="getApiToken">
		<div class="title f32">
			<router-link to="" tag="span" class="ft-c-black">{{$t('find.myDapps')}}</router-link>
			<router-link :to="{name:'myDapps'}" tag="span" class="ft-c-gray f30">{{$t('public0.more')}}<i class="icon-chevron-small-right f36 vam"></i></router-link>
		</div>
		<ul class="list mt15">
			<li v-for="dapp in games" v-tap="{methods:$root.routeTo, to:'dappDetail', params:{gameId:dapp.gameId}}">
				<img :src="dapp.icon||''" @error="setDefaultIcon($event)">
				<p>{{dapp.name}}</p>
			</li>
		</ul>
	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import findApi from '@/api/find'
import DappDefault from '@/assets/img/dapp_none.png'
export default{
	data(){
	    return {
	    	games:[]
	    }
	},
	computed: {
	    ...mapGetters(['getApiToken']),
	},
	created() {
	    this.getApiToken && this.getMyGames()
	},
	methods:{
		setDefaultIcon(e){
		  let tar = e.currentTarget
		  tar.src = DappDefault
		},
	    getMyGames(){
	    	findApi.getMyGames({size:5},res=>{
				this.games = res
			},msg=>{
				Tip({type:'error', message:this.$t(`error_code.${msg}`)})
			})
	    }
	}
}
</script>
<style lang="less" scoped="">
.mydapps {
	.title {
		display: flex;
		justify-content: space-between;
		line-height: 0.4rem;
	}
	.list {
		display: flex;
		justify-content: space-between;
		li {
			width: 0.96rem;
			img {display: block; width: 0.96rem; height: 0.96rem; object-fit: cover; object-position: center; border-radius: 0.1rem; overflow: hidden;}
			p {
				margin-top: 0.12rem;
				line-height: 0.3rem;
				text-align: center;
				display: -webkit-box;
				text-overflow: ellipsis;
				-webkit-line-clamp:2;
				-webkit-box-orient:vertical;
				white-space: normal;
				overflow: hidden;
			}
		}
	}
}
</style>