<template>
	<div class="page">
		<top-back>
			{{game.name}}
			<span slot="right"><i class="icon-dots-three-horizontal vam"></i></span>
		</top-back>
		<div class="page-main">
			<section class="info">
				<div class="name">
					<img :src="game.icon||''" @error="setDefaultIcon($event)">
					<div>
						<p class="ellipsis f34 mt10">{{game.name}}</p>
						<p class="ellipsis ft-c-lightGray mt10">{{game.createdAt}}</p>
					</div>
				</div>
				<div class="mt25 ft-c-deepGray">{{game.profile}}</div>
				<div class="enter mt40">
					<div>
						<span class="f34 ft-c-main">{{game.totalScore}}{{$t('find.score')}}</span>
						<span class="ft-c-lightGray ml40">{{game.totalScorePeople}}{{$t('find.personRating')}}</span>
					</div>
					<mt-button type="primary" size="small" class="circle" v-tap="{methods:$root.routeTo, to:'gameSupport', params:game}" v-if="game.gameUrl">{{$t('find.enterGame')}}</mt-button>
            		<mt-button type="primary" :disabled="true" size="small" class="circle" v-else>{{$t('find.notopen')}}</mt-button>
				</div>
			</section>
			<section class="statistic mt20">
				<p class="f32">{{$t('find.statistic')}}</p>
				<div class="items mt35 ft-c-deepGray">
					<span>{{$t('find.activeUser24h')}}</span>
					<span>{{$t('find.transNumber24h')}}</span>
					<span>{{$t('find.turnover24h')}}</span>
				</div>
				<div class="items mt15 ft-c-deepGray">
					<span>{{game.activeUser24h}}</span>
					<span>{{game.tradeCount24h}}</span>
					<span>{{game.volume24h}}</span>
				</div>
				<div class="items mt35 ft-c-deepGray">
					<span>{{$t('find.transNumber7d')}}</span>
					<span>{{$t('find.turnover24h')}}</span>
					<span></span>
				</div>
				<div class="items mt15 ft-c-deepGray">
					<span>{{game.tradeCount7d}}</span>
					<span>{{game.volume7d}}</span>
					<span></span>
				</div>
			</section>
			<section class="grade mt20 mb20">
				<p class="f32">{{$t('find.currentScore')}}</p>
				<div class="grade-detail">
					<div>
						<div class="star-mark mt70" v-html="getMarkStar"></div>
						<div class="grade-info">
							<span class="f34 ft-c-main">{{game.totalScore}}{{$t('find.score')}}</span>
							<span class="ft-c-lightGray ml40">{{game.totalScorePeople}}{{$t('find.personRating')}}</span>
						</div>
					</div>
					<div class="grade-percent">
						<div class="star-mark text-right">
							<span class="icon_star active"></span><span class="icon_star active"></span><span class="icon_star active"></span><span class="icon_star active"></span><span class="icon_star active"></span><span class="percent ft-c-deepGray">{{game.scorePercent5}}</span>
						</div>
						<div class="star-mark text-right">
							<span class="icon_star active"></span><span class="icon_star active"></span><span class="icon_star active"></span><span class="icon_star active"></span><span class="percent ft-c-deepGray">{{game.scorePercent4}}</span>
						</div>
						<div class="star-mark text-right">
							<span class="icon_star active"></span><span class="icon_star active"></span><span class="icon_star active"></span><span class="percent ft-c-deepGray">{{game.scorePercent3}}</span>
						</div>
						<div class="star-mark text-right">
							<span class="icon_star active"></span><span class="icon_star active"></span><span class="percent ft-c-deepGray">{{game.scorePercent2}}</span>
						</div>
						<div class="star-mark text-right">
							<span class="icon_star active"></span><span class="percent ft-c-deepGray">{{game.scorePercent1}}</span>
						</div>
					</div>
				</div>
				<div class="sepline mt40"></div>
				<div class="mt35 giveMark">
					<div>
						<span class="icon_ mt2 f32">{{$t('find.giveMark')}}</span>
						<p class="ml40 star-mark" id="giveMark" v-html="giveMark"></p>
					</div>
					<mt-button type="primary" class="mini circle" v-if="!game.currentScore" v-tap="{methods:submitGiveMark}">{{$t('public0.submit')}}</mt-button>
				</div>
			</section>
		</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { MessageBox } from 'mint-ui'
import findApi from '@/api/find'
import DappDefault from '@/assets/img/dapp_none.png'

export default {
  	name: 'dappDetail',
  	data(){
  		return {
  			game:{
  				score:0,
  			},
  			markScore:0
  		}
  	},
  	computed:{
  		...mapGetters(['getApiToken']),
  		markArray(){
  			return ['<span class="icon_star active"></span>','<span class="icon_star active"></span>','<span class="icon_star active"></span>','<span class="icon_star active"></span>','<span class="icon_star active"></span>','<span class="icon_star"></span>','<span class="icon_star"></span>','<span class="icon_star"></span>','<span class="icon_star"></span>','<span class="icon_star"></span>']
  		},
  		getMarkStar(){
  			return this.markArray.slice(5-this.game.score,10-this.game.score).join('')
  		},
  		giveMark(){
  			return this.markArray.slice(5-this.markScore,10-this.markScore).join('')
  		}
  	},
  	beforeRouteEnter (to, from, next) {
  		Indicator.open()
  		findApi.getGameDetail({gameId:to.params.gameId},res=>{
  			Indicator.close()
  			next(vm=>{
  				vm.game = res
  				if(!vm.game.currentScore){
  					vm.initGiveMark()
  				} else {
  					vm.markScore = vm.game.currentScore
  				}
  			})
  		},msg=>{
  			Indicator.close()
  			Tip({type:'error', message:vm.$t(`error_code.${msg}`)})
  		})
  	},
  	mounted(){

  	},
  	methods:{
  		submitGiveMark(){
  			if(!this.getApiToken){
  				MessageBox.confirm(`${this.$t('public0.not_logged')}, ${this.$t('public0.goLogin')}`,{
  				  title:this.$t('public0.tip'),
  				  confirmButtonText: this.$t('public0.ok'),
  				  cancelButtonText: this.$t('public0.no')
  				}).then(state=>{
  				  this.$router.push({path:'/login'})
  				})
  			} else {
  				if(!this.markScore){
  					Tip({type:'error', message:this.$t('find.giveMark')})
  					return
  				}
  				findApi.postGameScore({gameId:this.game.gameId, score:this.markScore},res=>{
  					this.game.currentScore = this.markScore
  					$('#giveMark .icon_star').off('touchend')
  					this.getGameDetail()
  					Tip({type:'success', message:this.$t('find.markSuccess')})
  				},msg=>{
  					Tip({type:'error', message:this.$t(`error_code.${msg}`)})
  				})
  			}
  		},
  		getGameDetail(){
  			findApi.getGameDetail({gameId:this.$route.params.gameId},res=>{
  				this.game = res
  			},msg=>{
  				Tip({type:'error', message:this.$t(`error_code.${msg}`)})
  			})
  		},
  		initGiveMark(){
  			let self = this
  			$('#giveMark').on('touchend','.icon_star',function(e){
  				let index = $('#giveMark .icon_star').index(this)
  				self.markScore = index+1
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
.info, .statistic, .grade {
	background-color: #fff;
	border-radius:0.1rem;
	box-shadow: 0 0.02rem 0.1rem rgba(0,0,0,.1);
	padding: 0.4rem;
}
.info {
	.name {
		display: flex;
		img {display: block; width: 0.96rem; height: 0.96rem; border-radius:0.1rem; object-fit: cover; object-position: center;}
		> div {
			flex: 1; margin-left: 0.2rem; 
		}
	}
	.enter {
		display: flex; justify-content: space-between;
	}
}
.statistic {
	.items {
		display: flex;
		span {flex: 1; min-width: 0;}
	}
}
.grade {
	.grade-detail {
		display: flex; justify-content: space-between; position: relative;
	}
	.star-mark {
		/deep/ .icon_star {
			height: 0.4rem;
			width: 0.4rem;
			margin-right: 0.1rem;
			background-image: url('../../assets/img/i_nc_light@2x.png');
			&.active {
				background-image: url('../../assets/img/i_sc@2x.png');
			}
		}
	}
	.grade-percent .star-mark {margin-top: 0.15rem;}
	.grade-percent .star-mark /deep/ .icon_star {
		height: 0.2rem;
		width: 0.2rem;
		margin-right: 0.05rem;
	}
	.grade-percent .percent {display: inline-block; width: 0.7rem; margin-left: 0.15rem; vertical-align: middle;}
	.grade-info {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.sepline {
		border-bottom: 1px solid #E1E1E1; font-size: 0; height: 0; line-height: 0;
	}
	.giveMark {display: flex; justify-content: space-between;}
	.giveMark p {display: inline-block;}
}

</style>