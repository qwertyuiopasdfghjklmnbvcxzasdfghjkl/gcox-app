<template>
    <div class="page">
        <top-back>{{$t('account.user_center_contact')}}</top-back>
        <div class="page-main">
            <div class="cont">
                <div v-for="item in data" class="mt20">
                    <rail-bar :item="item" v-tap="{methods:()=>{show=true;actionData= item}}"></rail-bar>
                </div>
            </div>
        </div>
        <div class="flex" :class="{'popup':show}">
            <div class="content" :class="{'active':show}">
                <div class="box">
                    <p class="title">{{actionData.name}}</p>
                    <label v-tap="{methods: copy}">{{$t('home.copy-link')}}</label>
                    <a :href="actionData.link">{{actionData.link}}</a>
                </div>
                <div class="box mar">
                    <label v-tap="{methods:()=>{show=false}}">{{$t('public0.no')}}</label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import RailBar from "../../../components/RailBar";
    import utils from '@/assets/js/utils'
    import {Toast} from 'mint-ui'

    export default {
        name: "bar",
        components: {RailBar},
        data() {
            return {
                data: [{
                    disabled: true,
                    icon: require('@/assets/img/about01.png'),
                    name: this.$t('home.web'),
                    small: 'gcox.com',
                    link: 'http://gcox.com'
                },{
                    disabled: true,
                    icon: require('@/assets/img/about02.png'),
                    name: this.$t('home.mail'),
                    link: 'exchange@gcox.com'
                },{
                    disabled: true,
                    icon: require('@/assets/img/about03.png'),
                    name: 'Twitter',
                    link: 'https://twitter.com/GCOX_Official'
                },{
                    disabled: true,
                    icon: require('@/assets/img/about04.png'),
                    name: 'Facebook',
                    link: 'https://www.facebook.com/GCOX.Official'
                },{
                    disabled: true,
                    icon: require('@/assets/img/about05.png'),
                    name: this.$t('home.e-mail'),
                    link: 'https://t.me/gcoxlink'
                },{
                    disabled: true,
                    icon: require('@/assets/img/about06.png'),
                    name: 'Medium',
                    link: 'https://medium.com/@gcoxchange'
                },{
                    disabled: true,
                    icon: require('@/assets/img/about07.png'),
                    name: this.$t('home.linkedin'),
                    link: 'https://www.linkedin.com/company/gcox-official/'
                },{
                    disabled: true,
                    icon: require('@/assets/img/about08.png'),
                    name: 'YouTube',
                    link: 'https://www.youtube.com/c/GCOXOfficial'
                },{
                    disabled: true,
                    icon: require('@/assets/img/about09.png'),
                    name: 'Vimeo',
                    link: 'https://vimeo.com/gcox'
                }],
                actionData: {
                    name:null,
                    link: null
                },
                show: false
            }
        },
        methods:{
            copy(){
                utils.copyText(this.actionData.link)
                Toast(this.$t('public0.public33')) // 复制成功
                this.show = false
            }
        }
    }
</script>

<style scoped lang="less">
    .page-main {
        padding-left: 0;
        padding-right: 0;
    }
    .cont{
        margin-top: 0.3rem;
    }
    .flex{
        .content{
            position: absolute;
            bottom: -4.6rem;
            left: 0.3rem;
            width: calc(100vw - 0.6rem);
            transition: bottom 0.3s;
            .box{
                background: #ffffff;
                border-radius:0.2rem;
                overflow: hidden;
                text-align: center;
                padding: 0;
                font-size: 0.3rem;
                p{
                    padding: 0.2rem;
                    background: #d6d6d6;
                    color: #404040;
                }
                label{
                    padding: 0.3rem 0;
                    display: block;
                    color: #408ebe;
                }
                a{
                    padding: 0.3rem 0;
                    display: block;
                    color: #408ebe;
                    border-top: 0.02rem solid #cccccc;
                }
            }
            .mar{
                margin: 0.2rem 0;
            }
            &.active{
                bottom: 0;
            }
        }
        &.popup{
            display: block;
            position: fixed;
            height: calc(100% - 0.9rem);
            width: 100vw;
            z-index: 9;
            background: rgba(0,0,0,0.1);
        }
    }
</style>
