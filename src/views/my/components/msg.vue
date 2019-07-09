<template>
    <div class="box">
        <i :class="classObj"></i>
        <p :class="{'hui':this.data.stats !== 1}">{{data.content}}</p>
        <small>{{data.time}}</small>
    </div>
</template>

<script>
    export default {
        props: ['data'],
        name: "msg",
        computed: {
            classObj: function () {
                return {
                    'green': this.data.stats === 1
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../style";
.box{
    background: #ffffff;
    border-radius:0.1rem;
    position: relative;
    padding: 0.4rem;
    margin-top: 0.2rem;
    i{
        width: 0.1rem;
        height:0.1rem;
        background: #cccccc;
        border-radius: 50%;
        position: absolute;
        top: 0.2rem;
        left: 0.2rem;
    }
    .green{
        background: #4AC6C3;
    }
    p{
        font-size: 0.26rem;
        line-height: 0.38rem;
        color: #333;
    }
    small{
        display: block;
        text-align: right;
        color: @f_t_c;
    }
    .hui{
        color: @f_t_c;
    }
}
</style>
