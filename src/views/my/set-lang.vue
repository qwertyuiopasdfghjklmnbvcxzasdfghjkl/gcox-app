<template>
    <div class="page">
        <top-back>{{$t('user.set')}}</top-back>
        <div  class="page-main cont">
            <label v-for="(item, index) in languages" v-tap="{methods: setLanguage, itemId: item.id}">
                <span>{{item.name}}</span>
                <img v-if="getCurLang.id === item.id" src="../../assets/img/ic_dg@3x.png">
            </label>
        </div>
    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import utils from '@/assets/js/utils'
    import langApi from '@/api/language'
    export default {
        name: "set-lang",
        data(){
            return{
                languages:[
                    {id: 'en', name: 'English', n: 4},
                    // {id: 'cht', name: '中文繁體', n: 2},
                    {id: 'zh-CN', name: '中文简体', n: 2}
                ]
            }
        },
        computed: {
            ...mapGetters([ 'getLang']),
            getCurLang () {
                var lang = this.languages[0]
                this.languages.forEach((item) => {
                    if (item.id === this.getLang) {
                        lang = item
                    }
                })
                return lang
            }
        },
        methods:{
            ...mapActions([ 'setLang']),
            setLanguage (lang) {
                console.log(lang)
                let language = lang.itemId
                this.setLang(language)
                if (!utils.isPlainEmpty(this.$i18n.getLocaleMessage(language))) {
                    this.$i18n.locale = language
                    return
                }
                langApi.getLanguage(language, (res) => {
                    this.$i18n.locale = language
                    this.$i18n.setLocaleMessage(language, res)
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.page-main {padding-left: 0; padding-right: 0;}
.cont{
    label{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3rem;
        font-size: 0.32rem;
        background-color: #fff;
        border-bottom: 1px solid #eeeeee;
        img{
            width: 0.26rem;
            height: 0.18rem;
        }
    }
}
</style>
