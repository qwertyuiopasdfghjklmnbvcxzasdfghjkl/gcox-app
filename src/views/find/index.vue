<template>
    <div class="page">
        <!--<search-bar class="mt10" @change="setSearch"></search-bar>-->
        <banner></banner>
        <div>
            <label class="flex">
                <i class="ico"><img src="../../assets/img/notice.png"></i>
                <notice></notice>
                <router-link to="#">更多</router-link>
            </label>
        </div>
        <data-box></data-box>
        <data-list></data-list>

        <!--<div class="page-main" :class="{nodata:!adsense.length}">-->

        <!--</div>-->
    </div>
</template>

<script>
    // @ is an alias to /src
    import {mapGetters, mapActions} from 'vuex'
    import findApi from '@/api/find'
    import searchBar from './index/search_bar'
    import JsCookies from 'js-cookie'
    import banner from './index/banner'
    import notice from './index/notice'
    import dataBox from './index/data_box'
    import dataList from './index/data_list'

    export default {
        name: 'find',
        components: {
            searchBar,
            banner,
            notice,
            dataBox,
            dataList
        },
        data() {
            return {
                adsense: [],
                searchKey: ''
            }
        },
        computed: {
            ...mapGetters(['getAdsense']),
            filterAdsense() {
                return this.getAdsense.filter(item => {
                    return item.name.toLowerCase().includes(this.searchKey)
                })
            }
        },
        // beforeRouteEnter(to, from, next) {
        //     let api_token = JsCookies.get('api_token'),
        //         isFirstLogin = localStorage.getItem('isFirstLogin') ? false : true
        //     if (!api_token && isFirstLogin) {
        //         next({
        //             name: 'login'
        //         })
        //     } else {
        //         next()
        //     }
        // },
        created() {
            // this.getRecommendGames()
        },
        methods: {
            ...mapActions(['setAdsense']),
            setSearch(key) {
                this.searchKey = key.toLowerCase()
            },
            // getRecommendGames() {
            //     if (this.getAdsense.length) {
            //         return
            //     }
            //     findApi.getRecommendGames({size: 1}, res => {
            //         this.setAdsense(res.ad)
            //     }, msg => {
            //         Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
            //     })
            // }
        }

    }
</script>

<style lang="less" scoped="">
    .page-main {
        top: 0rem;
    }
.page{
    overflow-y: auto;
}
    .icon_logo {
        height: 0.5rem;
        width: 100%;
        background-image: url('../../assets/logo.png');
        background-size: auto 100%;
        background-position: center;
    }

    .adsense {
        width: 100%;

        li {
            margin-bottom: 0.5rem;
            background-color: #fff;
            border-radius: 0.15rem;
            box-shadow: 0 0.02rem 0.1rem rgba(0, 0, 0, .1);
            overflow: hidden;

            img {
                width: 100%;
                height: 3.2rem;
                object-fit: cover;
                object-position: center;
            }

            p {
                line-height: 1.1rem;
                font-size: 0.36rem;
                padding-left: 0.3rem;
                padding-right: 0.3rem;
                display: flex;
                justify-content: space-between;

                span {
                    min-width: 0;
                    flex: 1;
                }

                /deep/ button {
                    margin-top: 0.22rem;
                    margin-left: 0.3rem;
                }
            }
        }
    }
    .flex{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3rem 0.32rem;
        & > div{
            flex-shrink: 1;
            flex-grow: 1;
        }
        .ico{
            width: 0.52rem;
            height: 0.4rem;
            padding-right: 0.12rem;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
</style>
