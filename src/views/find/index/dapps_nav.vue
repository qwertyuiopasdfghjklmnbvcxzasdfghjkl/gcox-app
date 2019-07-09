<template>
	<div class="dapps_nav">
		<div class="navigation">
			<swiper :options="navOption">
			    <swiper-slide v-for="(item,index) in nav">
			    	<span :class="{active:currentIndex===index}" v-tap="{methods:setCurrent, index:index}">{{item.name}}</span>
			    </swiper-slide>
			</swiper>
		</div>
		<div class="dapps mt15 mb30">
			<swiper :options="dappsOption" ref="dappsSwiper">
			    <swiper-slide v-for="item in nav">
			    	<ul class="list">
			    		<li v-for="dapp in (navDapps[item.gameCategoryId]&&navDapps[item.gameCategoryId]['data']||[])" v-tap="{methods:$root.routeTo, to:'dappDetail', params:{gameId:dapp.gameId}}">
			    			<img :src="dapp.icon||''" @error="setDefaultIcon($event)">
			    			<div>
			    				<div>
			    					<p class="ellipsis f32 mt10">{{dapp.name}}</p>
			    					<p class="ellipsis ft-c-lightGray mt10">{{dapp.desc}}</p>
			    				</div>
			    				<i class="icon-dots-three-horizontal ft-c-lightGray mt40"></i>
			    			</div>
			    		</li>
			    	</ul>
			    	<p class="mt10 pb40 f32 ft-c-main text-center" v-tap="{methods:loadMore, id:item.gameCategoryId}">{{$t('public0.viewMore')}}</p>
			    </swiper-slide>
			</swiper>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
import findApi from '@/api/find'
import DappDefault from '@/assets/img/dapp_none.png'
export default{
	data(){
	    return {
	    	size:4,
	    	nav:[],
	    	navDapps:{},
	    	navOption: {
	    	    freeMode : true,
	    	    slidesPerView: 'auto',
	    	    observer:true,
	    	},
	    	dappsOption: {
	    		autoHeight:true,
	    	    observer:true,
	    	},
	    	currentIndex:0,
	    }
	},
	computed: {
	    dappsSwiper() {
          return this.$refs.dappsSwiper.swiper
        },
	},
	created(){
		this.getGameCategories()
	},
	mounted() {
		let self = this
		this.dappsSwiper.on('slideChangeTransitionEnd',function(){
			self.currentIndex = this.activeIndex
		})
	},
	methods:{
		loadMore(args){
			this.getGames(args.id)
		},
		setCurrent(args){
			this.currentIndex = args.index
			this.dappsSwiper.slideTo(args.index, 300, false)
		},
	    getGameCategories(){
	    	findApi.getGameCategories({},res=>{
				this.nav = res
				for(let item of this.nav) {
					this.getGames(item.gameCategoryId)
		    	}
			},msg=>{
				Tip({type:'error', message:this.$t(`error_code.${msg}`)})
			})
	    },
	    getGames(gameCategoryId){
	    	let offset = (this.navDapps[gameCategoryId] && this.navDapps[gameCategoryId].page * this.size) || 0
			findApi.getGames({category:gameCategoryId, offset:offset, size:this.size},res=>{
				if(!res.length){return}
				if(this.navDapps[gameCategoryId]){
					this.navDapps[gameCategoryId].page += 1
					this.navDapps[gameCategoryId].data = this.navDapps[gameCategoryId].data.concat(res)
				} else {
					Vue.set(this.navDapps, gameCategoryId, {page:1, data:res})
				}
			},msg=>{
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
.navigation {
	height: 0.5rem;
	/deep/ .swiper-container {
		height: 100%;
		.swiper-slide {
			width: auto;
			color: #999;
			margin-right: 0.5rem;
			letter-spacing: 2px;
			&:last-of-type {
				margin-right: 0;
			}
			span.active {
				display: inline-block;
				font-size: 0.32rem;
				color: #4AC6C3;
				padding-bottom: 0.01rem;
				border-bottom: 0.04rem solid #4AC6C3;
				
			}
		}
	}
}
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
			img {display: block; width: 0.96rem; height: 0.96rem; object-fit: cover; object-position: center;}
			> div {
				flex: 1; display: flex; margin-left: 0.3rem; padding-bottom: 0.25rem; border-bottom: 1px solid #E4E4E4;
				> div {flex: 1;}
			}
			&:first-of-type {padding-top: 0;}
		}
	}
}
</style>