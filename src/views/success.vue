<template>
    <div class="cont">
        <div>
            <img src="../assets/img/success.png">
            <p>{{$t('usercontent.success')}}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'error'
    }
</script>

<style scoped lang="less">
    .cont{
        position: fixed;
        width: 100vw;
        height: 100vh;
        background: #ffffff;
        text-align: center;
        top: 0;
        left: 0;
        z-index: 99999;
        display: flex;
        justify-content: center;
        align-items: center;
        p{
            font-size: 18px;
            color: #3dc469;
        }
    }
</style>
