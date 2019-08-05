<template>
    <div class="page">
        <top-back>{{$t('user.set')}}</top-back>
        <div class="mt20">
            <rail-bar v-for="data in data1" :item="data" class="hr"></rail-bar>
        </div>
        <div class="cont mt20">
            <rail-bar :item="data2" class=""></rail-bar>
            <mt-switch v-model="switchT" class="switchT"></mt-switch>
            <!--<mt-switch v-model="switchT"></mt-switch>-->
        </div>
    </div>
</template>

<script>
    import railBar from '../../../components/RailBar'

    export default {
        name: "set",
        components: {
            railBar
        },
        data() {
            return {
                switchT: null,
                data1: [
                    {
                        route: 'setLang',
                        name: this.$t('home.home13'),
                        small: `<span style="color:#aaaaaa">0KB</span>`
                    },
                    {
                        route: 'setLang',
                        name: this.$t('home.home14'),
                    }
                ],
                data2: {
                        route: '',
                        name: this.$t('home.home15'),
                        rightIcon: true,
                    }
            }
        },
        methods: {
            sw(){
                console.log(this.switchT)
            }
        }
    }
</script>

<style scoped lang="less">
    .page-main {
        padding-left: 0;
        padding-right: 0;
    }

    .hr {
        position: relative;

        &:after {
            content: '';
            display: block;
            position: absolute;
            z-index: 9;
            /*width: calc(100% - 0.88rem);*/
            bottom: 0;
            right: 0.3rem;
            left: 0.3rem;
            background: #43434E;
            height: 0.02rem;
        }

        &:last-child:after {
            display: none;
        }
    }
    .cont{
        position: relative;
        .switchT{
            position: absolute;
            right: 0.3rem;
            top: 0.14rem;
            z-index: 999;
        }
    }
</style>
