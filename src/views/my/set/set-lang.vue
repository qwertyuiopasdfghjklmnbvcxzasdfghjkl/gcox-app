<template>
    <div class="page">
        <top-back>{{$t('user.lang')}}</top-back>
        <div class="page-main">
            <div class="cont">
                <ul>
                    <li v-for="item in options"
                        v-tap="{methods: setLang, lang:item.value}"
                        :class="{active: lang === item.value}">{{item.label}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import langApi from '@/api/language'
    export default {
        name: "set-lang",
        data(){
            return{
                lang: window.localStorage.lang || 'en',
                options: [
                    {
                        label: '中文',
                        value: 'zh-CN'
                    },
                    {
                        label: 'English',
                        value: 'en'
                    }
                ]
            }
        },
        methods:{
            setLang(parme){

                langApi.getLanguage(parme.lang,res=>{
                    this.lang = parme.lang
                    this.$i18n.locale = parme.lang
                    this.$i18n.setLocaleMessage(parme.lang, res)
                    window.localStorage[parme.lang] = JSON.stringify(res)
                    window.localStorage.lang = this.lang

                    console.log(parme,res)
                })
            }
        }
    }
</script>

<style scoped lang="less">
.cont{
    margin: 0.2rem -0.3rem;
    ul{
        display: flex;
        flex-flow: column;
        background: #2A2A34;
        padding: 0 0.3rem;
        li{
            padding: 0.3rem 0;
            border-bottom:  0.02rem solid #43434E;
            &:last-child{
                border-bottom: none;
            }
            &.active{
                background: url("../../../assets/img/ic_dg@3x.png") no-repeat right center;
                background-size: 0.3rem;
            }
        }
    }
}
</style>
