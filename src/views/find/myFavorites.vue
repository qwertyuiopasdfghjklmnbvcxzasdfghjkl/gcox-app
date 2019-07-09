<template>
	<div class="page">
		<top-back>{{$t('find.favorites')}}</top-back>
		<div class="page-main">
			<ul class="dapps">
	    		<li v-for="dapp in dapps">
	    			<img :src="dapp.img">
	    			<div>
	    				<div>
	    					<p class="ellipsis f32 mt10">{{dapp.name}}</p>
	    					<p class="ellipsis ft-c-lightGray mt10">{{dapp.desc}}</p>
	    				</div>
	    				<i class="icon_favorite active"></i>
	    			</div>
	    		</li>
	    	</ul>
		</div>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  	name: 'myFavorites',
  	data(){
  		return {
  			dapps:[
				{id:1, name:'王者荣耀', desc:'新的征途大陆', img:require('@/assets/img/dapps_04@2x.png')},
				{id:2, name:'王者荣耀', desc:'新的征途大陆', img:require('@/assets/img/dapps_04@2x.png')},
				{id:3, name:'王者荣耀', desc:'新的征途大陆', img:require('@/assets/img/dapps_04@2x.png')},
				{id:4, name:'王者荣耀', desc:'新的征途大陆', img:require('@/assets/img/dapps_04@2x.png')},
				{id:1, name:'王者荣耀', desc:'新的征途大陆', img:require('@/assets/img/dapps_04@2x.png')},
				{id:2, name:'王者荣耀', desc:'新的征途大陆', img:require('@/assets/img/dapps_04@2x.png')},
				{id:3, name:'王者荣耀', desc:'新的征途大陆', img:require('@/assets/img/dapps_04@2x.png')},
				{id:4, name:'王者荣耀', desc:'新的征途大陆', img:require('@/assets/img/dapps_04@2x.png')},
				{id:1, name:'王者荣耀', desc:'新的征途大陆', img:require('@/assets/img/dapps_04@2x.png')},
				{id:2, name:'王者荣耀', desc:'新的征途大陆', img:require('@/assets/img/dapps_04@2x.png')},
				{id:3, name:'王者荣耀', desc:'新的征途大陆', img:require('@/assets/img/dapps_04@2x.png')},
				{id:4, name:'王者荣耀', desc:'新的征途大陆', img:require('@/assets/img/dapps_04@2x.png')},
			]
  		}
  	}
}
</script>

<style lang="less" scoped="">
.dapps {
	padding-left: 0.3rem;
	padding-right: 0.3rem;
	background-color: #fff;
	li{ 
		padding-top: 0.25rem;
		padding-bottom: 0.25rem; 
		display: flex;
		border-bottom: 1px solid #E7E7E7;
		img {width: 0.96rem; height: 0.96rem; object-fit: cover; object-position: center;}
		> div {
			flex: 1; display: flex; margin-left: 0.3rem; 
			> div {flex: 1;}
		}
		.icon_favorite {
			width: 0.4rem;
			height: 0.4rem;
			background-image: url('../../assets/img/i_nc@2x.png');
			margin-top: 0.27rem;
			&.active {
				background-image: url('../../assets/img/i_sc@2x.png');
			}
		}
		&:last-of-type {
			border-bottom:none;
		}
	}
}
</style>