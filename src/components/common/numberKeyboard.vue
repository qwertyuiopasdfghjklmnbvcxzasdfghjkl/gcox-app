<template>
	<div class="keyboard" ref="target">
	  <span v-tap="{methods:inputNum, number:1}">1</span>
	  <span v-tap="{methods:inputNum, number:2}">2</span>
	  <span v-tap="{methods:inputNum, number:3}">3</span>
	  <span v-tap="{methods:inputNum, number:4}">4</span>
	  <span v-tap="{methods:inputNum, number:5}">5</span>
	  <span v-tap="{methods:inputNum, number:6}">6</span>
	  <span v-tap="{methods:inputNum, number:7}">7</span>
	  <span v-tap="{methods:inputNum, number:8}">8</span>
	  <span v-tap="{methods:inputNum, number:9}">9</span>
	  <span class="blank"></span>
	  <span v-tap="{methods:inputNum, number:0}">0</span>
	  <span v-tap="{methods:eraseNum}" class="blank"><i class="icon-erase"></i></span>
	</div>
</template>

<script>
export default {
	name:'number-keyboard',
	props:['value','maxlength'],
	methods:{
		inputNum(args){
			let number = this.value
			if(this.maxlength){
				if(number.length < this.maxlength){
					number += args.number
				}
			} else {
				number += args.number
			}
			let $tar = $(args.event.currentTarget)
			$tar.addClass('active')
			setTimeout(()=>{
			$tar.removeClass('active')
			},100)
			this.$emit('change', number)
		},
		eraseNum(args){
			let number = this.value
			if(number.length>0){
				number = number.slice(0, number.length-1)
			}
			let $tar = $(args.event.currentTarget)
			$tar.addClass('active')
			setTimeout(()=>{
			$tar.removeClass('active')
			},100)
			this.$emit('change', number)
		},
	}
}
</script>

<style lang="less" scoped="">
.keyboard {
  margin-left: -0.3rem;
  margin-right: -0.3rem;
  display: flex;
  flex-wrap: wrap;
  border-top: 1px solid #E9F3F2;
  span {
    width: 33.3%;
    height: 1.25rem;
    line-height: 1.25rem;
    font-size: 0.5rem;
    text-align: center;
    border-right: 1px solid #E9F3F2;
    border-top: 1px solid #E9F3F2;
    &:nth-of-type(1), &:nth-of-type(2), &:nth-of-type(3) {
      border-top: none;
    }
    &:nth-of-type(3n) {
      width: auto;
      flex: 1;
      border-right: none;
    }
    &.active {
      color: #fff;
      background-color:#4AC6C3;
    }
    &.blank {
      color: #8F8E8E;
      background-color:#F6FDFD;
      &.active {
        color: #fff;
        background-color:#4AC6C3;
      }
    }
  }
}
</style>
<style type="text/css">
  @media screen and (min-aspect-ratio: 13/9) {
  	.keyboard {
  		border: 1px solid #E9F3F2;
  	}
  	.keyboard span {
  		height: 0.5rem!important;
  		line-height: 0.5rem!important;
  		font-size: 0.26rem!important;
  	}
  }
</style>