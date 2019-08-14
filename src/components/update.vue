<template>
	<mask-layer :show="show" :isgray="true">
		<div class="update-container">
			<div class="top"></div>
			<div class="content">
				<p class="f36 ft-c-deepGray text-center">{{$t('update.findUpdate')}}</p>
				<p class="mt15 f24 ft-c-deepGray text-center">{{$t('update.version')}} V{{version}}</p>
				<div class="log ft-c-gray" v-html="updateIntro"></div>
			</div>
			<div class="bottom">
				<mt-button type="default"  class="circle" v-tap="{methods:()=>{show = false}}">{{$t('public0.no')}}</mt-button>
				<mt-button type="primary"  class="circle ml50" v-tap="{methods:update}">{{$t('update.update')}}</mt-button>
			</div>
		</div>
	</mask-layer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import api from '@/api/wallet'
import Config from '@/api/config'
export default {
	name:'update',
	data(){
		return {
			show: false,
			info: {},
			platform: this.$root.getPhonePlatform() === 'android' ? 'android' : 'apple'
		}
	},
	computed:{
		...mapGetters(['getLang','getVersion']),
		version(){
			return this.info[`${this.platform}Version`] || ''
		},
		url(){
			return (this.platform==='android'?`${Config.url}${this.info.androidPath}`:this.info.appleUrl) || ''
		},
		updateIntro(){
			let lang = this.getLang==='zh-CN'?'zh':this.getLang
			let intro = JSON.parse(this.info[`${this.platform}UpdateIntro`] || '{}')
			return intro[lang]
		},
		promptUpdate(){
			return this.info[`${this.platform}PromptUpdate`]==='1'
		}
	},
	created(){
		this.getLatestVersion()
	},
	methods:{
		getLatestVersion(key){
			let delay =30000
			if(key){
				delay = 0
			}
			setTimeout(()=>{
				api.getLatestVersion(res=>{
					this.info = res
					console.log(res)
					if(this.promptUpdate && this.version>this.getVersion){
						this.show = true
					} else if(key) {
						Tip({type:'info', message:this.$t('update.latestVersion')})
					}
				}, msg=>{
					Tip({type:'error', message:this.$t(`error_code.${msg}`)})
				})
			},delay)
		},
		cancel(){
			this.show = false
		},
		update(){
			if(this.platform==='android'){
				window['AppUpdate'] && window.AppUpdate.downloadAndInstallApk(msg=>{
					Tip({type:'success', message:msg})
				}, msg=>{
					Tip({type:'error', message:msg})
				}, this.url);
			} else if(this.platform==="apple"){
				if(/\.apple$/.test(this.url)){
					location.href="itms-services://?action=download-manifest&url="+this.url;
				} else {
					this.$root.openURL(this.url);
				}
			}else {
				this.$root.openURL(this.url);
			}
			this.show = false
		}
	}
}
</script>

<style lang="less" scoped="">
.update-container {
	position: absolute;
	left: 50%;
	top: 50%;
	width: 6rem;
	background-color: #fff;
	transform: translate(-50%, -50%);
	border-radius: 4px;
	.top {
		height: 2.32rem;
		background: url('../assets/img/updata_bg.png') no-repeat center top;
		background-size:100% auto;
	}
	.bottom {
		padding-top:0.4rem;
		padding-bottom: 0.9rem;
		padding-left:0.72rem;
		padding-right:0.72rem;
		display: flex;
		justify-content: space-between;
		/deep/ button {flex: 1;}
	}
	.content {
		padding-left:0.72rem;
		padding-right:0.72rem;
		margin-top: 0.2rem;
		.log {
			margin-top: 0.2rem;
			line-height: 0.48rem;
			max-height: calc(~'100vh - 7.24rem');
			overflow-y: auto;
		}
	}
}
</style>
