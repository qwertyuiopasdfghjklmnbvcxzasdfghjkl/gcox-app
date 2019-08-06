<template>
    <div class="page">
        <top-back>{{title | tit}}</top-back>
        <div class="page-main">
            <iframe :src="url" class="iframe" allow="camera"></iframe>
            <loading v-if="loading" class="loading"></loading>
        </div>
    </div>
</template>

<script>
    import Loading from "../components/common/loading";
    export default {
        components: {Loading},
        data(){
            return{
                title: null,
                url:null,
                loading: true
            }
        },
        created() {
            this.title = this.$route.query.id
            if(this.title === 1){
                this.url = 'https://gcoxgroup.com/wallet_tnc.html'
            }else if(this.title === 2){
                this.url = 'https://gcoxgroup.com/privacy_policy.html'
            }else{
                this.url = 'https://gcoxgroup.com/terms_of_use.html'
            }
        },
        methods:{

        },
        filters:{
            tit(id){
                let data = [window.vm.$t('home.home25'),window.vm.$t('home.home26'),window.vm.$t('home.home27')]
                return data[id-1]
            }
        }
    }
</script>

<style scoped>
    .page-main{
        padding: 0;
        overflow: hidden;
    }
.iframe{
    width: 100vw;
    height: calc(100vh - 0.9rem);
    border: none;
    position: relative;
    z-index: 9
}
    .loading{
        position: fixed;
        top: 40%;
        left: 50%;
        margin-left: -0.5rem;
        z-index: 1;
    }
</style>
