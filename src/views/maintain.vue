<template>
    <div>
            <div class="head">
                <img class="logo" src="../assets/img/LOGo@3x.png">
            </div>

        <main class="main">
            <p class="tc f-c-main title" style="margin-top: 60px;"><strong>Site Maintenance</strong></p>
            <p class="tc f-c-main title" style="margin-top: 10px;"><strong>系统维护</strong></p>
            <p class="tc f-c-main content" style="margin-top: 60px;">{{time}}</p>
        </main>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    export default {
        name: "maintain",
        data() {
            return {}
        },
        computed:{
            ...mapGetters(['getSysParams']),
            time(){
                return this.getSysParams['maintain']['value2']
            }
        },
        created() {

        },
        methods: {}
    }
</script>

<style scoped lang="less">
.head{
    padding:0.2rem;
    background: #000;
    img{
        height: 1rem
    }
}
    .title{
        font-size: .6rem;
    }
</style>
