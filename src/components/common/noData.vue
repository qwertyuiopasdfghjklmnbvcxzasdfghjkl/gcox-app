<template>
    <div class="no-data" :style="`background-color:${bgColor};`">
        <img src="../../assets/img/nodata.png"/>
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
    .no-data {
        background-color: transparent;
        text-align: center;
        margin: 0.6rem auto;
    }
    .no-data img{
        width: 3.45rem;
    }

    .no-data span {
        display: block;
        height: 1.2rem;
        font-size: .28rem;
        line-height: .6rem;
        color: #A7ACB9;
        text-align: center;
    }
</style>
