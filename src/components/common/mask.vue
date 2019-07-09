<template>
  <transition enter-active-class="animated short fadeIn" leave-active-class="animated short fadeOut">
    <div class="mask" :class="{gray:isgray}" v-if="show" @click.self="$emit('hide')">
      <slot></slot>
    </div>
  </transition>
</template>
<script>

export default {
  name:'maskLayer',
  props:{
    show:{
      type: Boolean,
      default:false
    },
    isgray:{
      type: Boolean,
      default:false
    }
  },
  methods:{
    
  }
}

</script>
<style lang="less" scoped="">
.mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    &.gray {
      background: rgba(0,0,0,.3);
    }
}
</style>