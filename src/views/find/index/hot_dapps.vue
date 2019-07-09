<template>
	<div>
		<div class="hotDapps">
			<div class="title f32">
				<router-link to="" tag="span" class="ft-c-black">{{$t('find.hotDapps')}}</router-link>
			</div>
			<ul class="list mt15" v-for="group in factoryGames">
				<li v-for="dapp in group" v-tap="{methods:$root.routeTo, to:'dappDetail', params:{gameId:dapp.gameId}}">
					<template v-if="dapp.gameId">
						<img :src="dapp.icon||''" @error="setDefaultIcon($event)">
						<p>{{dapp.name}}</p>
					</template>
				</li>
			</ul>
		</div>
		<adsense class="mt25" :adsense="adsense"></adsense>
	</div>
</template>

<script>
import findApi from '@/api/find'
import adsense from './adsense'
import DappDefault from '@/assets/img/dapp_none.png'
export default{
	components:{
	  adsense,
	},
	data(){
	    return {
	    	games:[],
	    	adsense:[],
	    }
	},
	computed: {
	    factoryGames(){
	    	let tempList = [], blankList = [{},{},{},{}]
	    	for(let n=0; n<this.games.length; n=n+5){
	    		let _t =  this.games.slice(n,n+5)
	    		_t = _t.concat(blankList.slice(0,5-_t.length))
	    		tempList.push(_t)
	    	}
	    	return tempList
	    }

	},
	created() {
		this.getRecommendGames()
	},
	methods:{
	    setDefaultIcon(e){
		  let tar = e.currentTarget
		  tar.src = DappDefault
		},
	    getRecommendGames(){
	    	findApi.getRecommendGames({size:10},res=>{
				this.games = res.recommend
				this.adsense = res.ad
			},msg=>{
				Tip({type:'error', message:this.$t(`error_code.${msg}`)})
			})
	    }
	}
}
</script>
<style lang="less" scoped="">
.hotDapps {
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