<template>
	<transition leave-active-class="animated fadeOut">
	<div class="banner unselected" v-if="isFirst">
		<swiper :options="swiperOption" ref="initSwiper">
		    <!-- 幻灯内容 -->
		    <swiper-slide v-for="(item,index) in slides" :key="index" v-tap="{methods:start}">
                <div class="img"  :style="{backgroundImage:'url(' + item + ')'}"></div>
		    </swiper-slide>
		    <div class="swiper-pagination"  slot="pagination"></div>
		</swiper>
	</div>
	</transition>
</template>

<script>
export default{
	data(){
	    return {
	    	isFirst:localStorage.getItem('isFirst') ? false : true,
	    	canStart:false,
	    	slides:[require('@/assets/img/slides/landing-page.jpg')],
	        swiperOption: {
	            speed: 400,
	            observer:true,
	            pagination: {
	                el: '.swiper-pagination',
	            },
	        }
	    }
	},
	computed: {
	    swiper() {
          return (this.$refs.initSwiper && this.$refs.initSwiper.swiper)
        },
	},
	mounted() {
		let self = this
		this.swiper && this.swiper.on('slideChangeTransitionEnd',function(){
			if(self.slides.length === (this.activeIndex + 1)){
				self.canStart = true
			}
		});
		if(this.slides.length === 1){
			setTimeout(()=>{this.start()},3000)
		}
	},
	methods:{
	    start(){
	    	localStorage.setItem('isFirst', true)
			this.isFirst = false
	    	// if(this.canStart){
	    	// }
	    }
	}
}
</script>
<style lang="less" scoped="">
.banner {
	position: fixed;
	z-index: 999999;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background-color: #fff;
	overflow: hidden;
	.img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
        background-position: center;
        background-size: cover;
	}
	.swiper-pagination {bottom: 0.8rem;}
	/deep/ .swiper-pagination-bullet {
		background-color: #4AC6C3;
		opacity: 0.3;
	}
	/deep/ .swiper-pagination-bullet-active {
		opacity: 1;
	}
}
.swiper-container{
    width: 100%;
    height: 100%;
}
</style>
