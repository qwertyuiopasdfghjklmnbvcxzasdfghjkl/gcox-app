<template>
    <div class="international">
        <p>{{vm.$t('user.no_sg_user')}}{{vm.$t('user.gcox_sg')}} App</p>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "internationalWeb",
        data() {
            const vm = window.vm
            return {
                vm: vm,
            }
        },
        computed:{
            ...mapGetters(['getSysParams']),
        },
        watch:{
            getSysParams(e) {
                let status = e['maintain']['value']
                if( status === '1'){
                    this.$emit('removeDialog')
                }
            }
        },
        created() {

        },
        methods: {}
    }
</script>

<style scoped>
    .international {
        position: fixed;
        width: 90vw;
        height: 4rem;
        background: #ffffff;
        top: 50%;
        margin-top: -2rem;
        left: 5vw;
        border-radius: 0.1rem;
        display: flex;
        align-items: center;
    }

    .international p {
        font-size: 0.36rem;
        padding: 0.5rem;
        line-height: 0.6rem;
        color: #e74c3c;
    }

    .international p a {
        color: #00a0e9;
    }
</style>
