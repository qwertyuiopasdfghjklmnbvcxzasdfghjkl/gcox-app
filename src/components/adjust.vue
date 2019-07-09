<template>
  <div class="price-adjust">
    <div><numberbox v-model="inputValue" :accuracy="accuracy"></numberbox></div>
    <div><i class="icon-minus" v-tap="{methods:down}"></i></div>
    <div><i class="icon-plus" v-tap="{methods:up}"></i></div>
  </div>
</template>

<script>
import numberbox from '@/components/numberInput'
import numUtils from '@/assets/js/numberUtils'
export default {
  name: 'cp-adjust',
  props: ['value','accuracy'],
  components: {
    numberbox
  },
  data () {
    return {
      inputValue: '',
      fixed: 8
    }
  },
  watch: {
    inputValue () {
      this.updateFixed()
      this.$emit('input', this.inputValue)
    },
    value () {
      this.inputValue = this.value
      this.updateFixed()
    }
  },
  created () {
    this.inputValue = this.value
    this.updateFixed()
  },
  methods: {
    updateFixed () {
      let arr = (this.inputValue || '').split('.')
      this.fixed = arr[1] ? arr[1].length : 0
    },
    up () {
      let val = this.toFixed(numUtils.max([numUtils.add(this.inputValue, 1 / Math.pow(10, this.fixed)), 0]))
      this.inputValue = val
    },
    down () {
      let val = this.toFixed(numUtils.max([numUtils.minus(this.inputValue, 1 / Math.pow(10, this.fixed)), 0]))
      this.inputValue = val
    },
    toFixed (value, fixed) {
      return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixed : fixed, 1)
    }
  }
}
</script>

<style lang="less" scoped>
@c_board:#B9D0CF;
.price-adjust {
  display: flex;
  height: 0.8rem;
  border:1px solid @c_board;
  > div{display:flex;}
  > div:nth-of-type(1) {
    flex: 1;
    min-width: 0;
  }
  > div:nth-of-type(2) {
    width: 0.9rem;
    min-width: 0;
    border-left: 1px solid @c_board;
    i:after {
      position: absolute;
      content: '';
      height: 0.3rem;
      border-right:1px solid @c_board;
      right: 0;
      top: 0.25rem;
    }
  }
  > div:nth-of-type(3) {
    width: 0.9rem;
    min-width: 0;
  }
  i {font-size: 0.36rem; color: #91A4A3; line-height: 0.8rem; text-align: center; flex: 1; position: relative;}  
  input {
    width: 100%;
    text-align: center;
    font-size: 0.3rem;
    background-color: transparent;
    border: none;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
  }
}
</style>
