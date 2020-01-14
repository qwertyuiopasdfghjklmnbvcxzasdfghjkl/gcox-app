<template>
    <div class="select">
        <p @click="com()">{{vm.$t('user.gcox_com')}}</p>
        <p @click="sg()">{{vm.$t('user.gcox_sg')}}</p>
    </div>
</template>

<script>
    export default {
        name: "selectWeb",
        data() {
            const vm = window.vm
            return {
                vm: vm
            }
        },
        created() {

        },
        methods: {
            sg(){
                window.open('https://m.gcox.sg','_self')
            },
            com(){
                this.$emit('removeDialog')
            }
        }
    }
</script>

<style scoped lang="less">
.select{
    position: fixed;
    width: 90vw;
    height: 4rem;
    background: #ffffff;
    top: 50%;
    margin-top: -2rem;
    left: 5vw;
    border-radius:0.1rem;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-flow: column;
    p{
        display: block;
        text-align: center;
        background: #2A2A34;
        width: 90%;
        height: 1.2rem;
        line-height: 1.2rem;
    }
}
</style>
