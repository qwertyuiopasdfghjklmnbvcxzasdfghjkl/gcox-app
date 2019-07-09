<template>
  <div class="no-data" :style="`background-color:${bgColor};`">
    <i :style=""></i>
    <span :style="`font-size:${fontSize}rem;`">{{text || $t('public0.public50')}}<!--{{text}}||暂无相关数据--></span>
  </div>
</template>

<script>
export default {
  props: {
    iconSize: {
      type: Number,
      default: 0.6
    },
    fontSize: {
      type: Number,
      default: 0.24
    },
    text: {
      type: String,
      default: ''
    },
    bgColor: {
      type: String,
      default: 'transparent'
    }
  }
}
</script>

<style scoped>
.no-data{background-color: transparent;}
.no-data i{display: block;margin-top: 0.5rem;height: 1.2rem;background: url(../../assets/img/icon-null.png) no-repeat center bottom / 1.4rem .92rem}
.no-data span{display: block;height: 1.2rem;font-size: .24rem;line-height: .6rem;color: #BFCDCD;text-align: center;}
</style>
