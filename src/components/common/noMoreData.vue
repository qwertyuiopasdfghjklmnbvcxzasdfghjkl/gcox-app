<template>
  <div class="no-more-data" :style="`font-size:${fontSize}rem;color:${color};background-color:${bgColor};`">
    <i :style="`background-color:${color};`"></i>
    <span :style="`background-color:${bgColor};`">{{text || $t('public0.public121')}}<!--{{text}}||已无更多数据--></span>
  </div>
</template>

<script>
export default {
  props: {
    fontSize: {
      type: Number,
      default: 0.24
    },
    color: {
      type: String,
      default: '#AAAAAA'
    },
    bgColor: {
      type: String,
      default: '#0d0d0d'
    },
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.no-more-data{position: relative;height: .8rem;font-size: .24rem;line-height: .8rem;color: #8089a3;text-align: center;background-color: #0d0d0d;}
.no-more-data i{position: absolute;top: 50%;left: 10%;width: 80%;height: 1px;background-color: #8089a3;opacity: .5;}
.no-more-data span{position: relative;padding-left: .2rem;padding-right: .2rem;background-color: #0d0d0d;}
</style>
