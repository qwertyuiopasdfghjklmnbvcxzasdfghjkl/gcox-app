<template>
    <div class="page">
        <top-back>{{$t('user.set')}}</top-back>
        <div class="mt20">
            <rail-bar :item="data1" class="hr" @on-click="clear()"></rail-bar>
        </div>
        <!--<div class="cont mt20">-->
            <!--<rail-bar :item="data2" class=""></rail-bar>-->
            <!--<mt-switch v-model="switchT" class="switchT"></mt-switch>-->
        <!--</div>-->
        <div class="cont mt20">
            <rail-bar :item="data3"></rail-bar>
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
                data1:
                    {
                        route: '',
                        name: this.$t('home.home13'),
                        disabled: true
                    },
                    // {
                    //     route: 'net',
                    //     name: this.$t('home.home14'),
                    // }

                data2: {
                        route: '',
                        name: this.$t('home.home15'),
                        rightIcon: true,
                    },
                data3: {
                        route: 'set-lang',
                        name: this.$t('user.lang'),
                    },
                size: '0'
            }
        },
        watch:{
            // size(){
            //
            // }
        },
        created(){
            let userinfo = window.localStorage.userInfo
            let isfirst = window.localStorage.isFirst
            let userwallets = window.localStorage.userWallets || 0
            let lang = window.localStorage.lang || 'en'
            let langbag = window.localStorage[lang]
            var sizeStore = 0;
            if(window.localStorage) {
                for(let item in window.localStorage) {
                    if(window.localStorage.hasOwnProperty(item)) {
                        sizeStore += window.localStorage.getItem(item).length || 0;
                    }
                }
            }
            sizeStore = sizeStore - (userinfo.length || 0) - (isfirst.length || 0) - (lang.length || 0) - (langbag.length || 0)
                - (userwallets.length || 0)
            this.size = (sizeStore / 1024).toFixed(2)+'kb'
            this.data1.small = `<span style="color:#aaaaaa">${this.size}</span>`
        },
        methods: {
            sw(){
                console.log(this.switchT)
            },
            clear(){
                let userinfo = window.localStorage.userInfo
                let isfirst = window.localStorage.isFirst
                let userwallets = window.localStorage.userWallets
                let lang = window.localStorage.lang || 'en'
                let langbag = window.localStorage[lang]
                window.localStorage.clear()
                window.localStorage.userInfo = userinfo
                window.localStorage.isFirst = isfirst
                window.localStorage.userWallets = userwallets
                window.localStorage.lang = lang
                window.localStorage[lang] = langbag
                this.size = '0kb'
                this.data1 = {
                    route: '',
                    name: this.$t('home.home13'),
                    disabled: true,
                    small: `<span style="color:#aaaaaa">${this.size}</span>`
                }
                Tip({type: 'success', message: this.$t('home.home13')+this.$t(`usercontent.user78`)})
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
            top: 0.18rem;
            z-index: 999;
        }
    }
</style>
