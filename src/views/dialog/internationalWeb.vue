<template>
    <div class="international">
        <p>{{vm.$t('user.no_sg_user')}}
            <a href="https://m.gcox.sg">{{vm.$t('user.gcox_sg')}}</a>
        </p>
        <p style="text-align: center">{{vm.$t('user.go_main_soon')}} （{{timer}}s）</p>
    </div>
</template>

<script>
    export default {
        name: "internationalWeb",
        data() {
            const vm = window.vm
            return {
                vm: vm,
                timer: 10,
                interval: null
            }
        },
        watch: {
            timer() {
                if (this.timer === 0) {
                    clearInterval(this.interval)
                    window.open('https://m.gcox.sg')
                }
            }
        },
        created() {
            this.interval = setInterval(() => {
                this.timer--
            }, 1000)
        },
        beforeDestroy() {
            clearInterval(this.interval)
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
    }

    .international p {
        color: #2A2A34;
        font-size: 0.3rem;
        padding: 0.3rem;
        line-height: 0.4rem;
        margin-top: 0.4rem;
    }

    .international p a {
        color: #00a0e9;
    }
</style>
