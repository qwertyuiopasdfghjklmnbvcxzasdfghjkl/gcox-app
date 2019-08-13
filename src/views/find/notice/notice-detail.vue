<template>
    <div class="page">
        <top-back>{{$t('home.announcement')}}</top-back>
        <div class="page-main">
            <div class="cont">
                <h2 class="title">{{lang === 'en'?detail.titleEn:detail.titleCn}}</h2>
                <small class="time">{{new Date(detail.updatedAt).format()}}</small>
                <div v-html="lang === 'en'?detail.bodyEn:detail.bodyCn"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import find from '../../../api/find'
    export default {
        data(){
            return{
                id: null,
                detail:{
                    titleCn: null,
                    updatedAt: null,
                    bodyCn: null,
                    bodyEn: null,
                    titleEn: null,
                },
                lang: window.localStorage.lang || 'en'
            }
        },
        created() {
            this.id = this.$route.query.id
            this.getDetail()
        },
        methods:{
            getDetail(){
                find.getCmsDetail(this.id,res=>{
                    this.detail = res
                })
            }
        }
    }
</script>

<style scoped lang="less">
.cont{
    .title{
        font-size: 0.4rem;
        line-height: 0.46rem;
        padding: 0.2rem 0;
        text-align: center;
    }
    .time{
        text-align: center;
        margin-bottom: 0.3rem;
        display: block;
    }
}
</style>
