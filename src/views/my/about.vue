<template>
    <div class="page">
        <top-back>{{$t('user.about')}}</top-back>
        <div class="page-main">
            <rail-bar v-for="data in data1" :item="data" class="hr"></rail-bar>
        </div>
    </div>
</template>

<script>
    import railBar from '../../components/RailBar'
    export default {
        components: {
            railBar
        },
        data(){
            return{
                data1: [
                    {
                        route: '',
                        name: this.$t('user.rate'),
                        disabled:true
                    },
                    {
                        route: '',
                        name: this.$t('user.statement'),
                        disabled:true
                    },
                    {
                        route: '',
                        name: this.$t('user.protocol'),
                        disabled:true
                    },
                    {
                        route: '',
                        name: this.$t('user.aboutUs'),
                        disabled:true
                    }
                ]
            }
        }
    }
</script>

<style scoped lang="less">
.page-main {padding-left: 0; padding-right: 0;}
.hr {border-bottom: 1px solid #eeeeee;}
</style>
