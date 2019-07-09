<template>
    <div class="page">
        <!--<search-bar class="mt10" @change="setSearch"></search-bar>-->
        <banner></banner>
        <div class="page-main" :class="{nodata:!adsense.length}">
            <!--<ul class="adsense">-->
                <!--<li v-for="game in filterAdsense">-->
                    <!--<img :src="game.recommendImage"-->
                         <!--v-tap="{methods:$root.routeTo, to:'dappDetail', params:{gameId:game.gameId}}">-->
                    <!--<p>-->
                        <!--<span class="ellipsis">{{game.name}}</span>-->
                        <!--<mt-button type="primary" size="small" class="circle"-->
                                   <!--v-tap="{methods:$root.routeTo, to:'gameSupport', params:game}" v-if="game.gameUrl">-->
                            <!--{{$t('find.enterGame')}}-->
                        <!--</mt-button>-->
                        <!--<mt-button type="primary" :disabled="true" size="small" class="circle" v-else>-->
                            <!--{{$t('find.notopen')}}-->
                        <!--</mt-button>-->
                    <!--</p>-->
                <!--</li>-->
            <!--</ul>-->
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import {mapGetters, mapActions} from 'vuex'
    import findApi from '@/api/find'
    import searchBar from './index/search_bar'
    import JsCookies from 'js-cookie'
    import banner from './index/banner'

    export default {
        name: 'find',
        components: {
            searchBar,
            banner
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
        beforeRouteEnter(to, from, next) {
            let api_token = JsCookies.get('api_token'),
                isFirstLogin = localStorage.getItem('isFirstLogin') ? false : true
            if (!api_token && isFirstLogin) {
                next({
                    name: 'init'
                })
            } else {
                next()
            }
        },
        created() {
            this.getRecommendGames()
        },
        methods: {
            ...mapActions(['setAdsense']),
            setSearch(key) {
                this.searchKey = key.toLowerCase()
            },
            getRecommendGames() {
                if (this.getAdsense.length) {
                    return
                }
                findApi.getRecommendGames({size: 1}, res => {
                    this.setAdsense(res.ad)
                }, msg => {
                    Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
                })
            }
        }

    }
</script>

<style lang="less" scoped="">
    .page-main {
        top: 0rem;
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
</style>
