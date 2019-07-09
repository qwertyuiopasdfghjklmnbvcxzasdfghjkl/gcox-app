<template>
    <div class="page">
        <top-back>{{$t('user.set')}}</top-back>
        <div class="page-main">
            <rail-bar v-for="data in data1" :item="data" class="hr"></rail-bar>
        </div>
    </div>
</template>

<script>
    import railBar from '../../components/RailBar'
    export default {
        name: "set",
        components: {
            railBar
        },
        data(){
            return{
                data1: [
                    {
                        route: 'setLang',
                        name: this.$t('user.lang'),
                        small: `<span style="color:#aaaaaa">${this.$t('user.chinese')}</span>`
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
