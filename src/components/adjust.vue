<template>
    <div class="price-adjust">
        <div><i class="icon-minus" v-tap="{methods:down}"></i></div>
        <div class="cont">
            <span v-if="!inputValue">{{tip}}</span>
            <numberbox v-model="inputValue" :accuracy="accuracy"></numberbox>
        </div>
        <div><i class="icon-plus" v-tap="{methods:up}"></i></div>
    </div>
</template>

<script>
    import numberbox from '@/components/numberInput'
    import numUtils from '@/assets/js/numberUtils'

    export default {
        name: 'cp-adjust',
        props: ['value', 'accuracy','tip'],
        components: {
            numberbox
        },
        data() {
            return {
                inputValue: '',
                fixed: 8
            }
        },
        watch: {
            inputValue() {
                this.updateFixed()
                this.$emit('input', this.inputValue)
            },
            value() {
                this.inputValue = this.value
                this.updateFixed()
            }
        },
        created() {
            this.inputValue = this.value
            this.updateFixed()
        },
        methods: {
            updateFixed() {
                let arr = (this.inputValue || '').split('.')
                this.fixed = arr[1] ? arr[1].length : 3
            },
            up() {
                let val = this.toFixed(numUtils.max([numUtils.add(this.inputValue, 1 / Math.pow(10, this.fixed)), 0]))
                this.inputValue = val
            },
            down() {
                let val = this.toFixed(numUtils.max([numUtils.minus(this.inputValue, 1 / Math.pow(10, this.fixed)), 0]))
                this.inputValue = val
            },
            toFixed(value, fixed) {
                return numUtils.BN(value || 0).toFixed(fixed === undefined ? this.fixed : fixed, 1)
            }
        }
    }
</script>

<style lang="less" scoped>
    @c_board: #B9D0CF;
    .price-adjust {
        display: flex;
        height: 0.8rem;
        background: #2A2A34;;

        > div {
            display: flex;
        }
        .cont{
            position: relative;
            &>span{
              position: absolute;
                font-size: 0.24rem;
                width: 100%;
                text-align: center;
                height: 0.8rem;
                line-height: 0.8rem;
            }
        }
        > div:nth-of-type(2) {
            flex: 1;
            min-width: 0;
        }

        > div:nth-of-type(1) {
            width: 0.7rem;
            height: 0.8rem;
            background: #43434E;
        }

        > div:nth-of-type(3) {
            width: 0.7rem;
            height: 0.8rem;
            background: #43434E;
        }

        i {
            font-size: 0.36rem;
            color: #d8d8d8;
            line-height: 0.8rem;
            text-align: center;
            flex: 1;
            position: relative;
        }

        input {
            width: 100%;
            text-align: center;
            font-size: 0.24rem;
            background-color: transparent;
            border: none;
            color: #ffffff;
            position: relative;
            z-index: 6;
        }
    }
</style>
