<template>
    <mt-tabbar v-model="selected" :fixed="true">
        <mt-tab-item id="find" v-tap="{methods:$root.routeTo, to:'find', replace:true}">
            <img slot="icon" src="../../assets/img/icon_home_a@3x.png">
            <img slot="icon" src="../../assets/img/icon_home_b@3x.png">
            <p>{{$t('nav.home')}}</p>
        </mt-tab-item>
        <mt-tab-item id="market" v-tap="{methods:$root.routeTo, to:'market', replace:true}">
            <img slot="icon" src="../../assets/img/icon_markt_a@3x.png">
            <img slot="icon" src="../../assets/img/icon_markt_b@3x.png">
            <p>{{$t('nav.market')}}</p>
        </mt-tab-item>
        <mt-tab-item id="exchange" v-tap="{methods:$root.routeTo, to:'exchange', replace:true}">
            <img slot="icon" src="../../assets/img/icon_trade_a@3x.png">
            <img slot="icon" src="../../assets/img/icon_trade_b@3x.png">
            <p>{{$t('nav.trade')}}</p>
        </mt-tab-item>
        <mt-tab-item id="ucenter" v-tap="{methods:$root.routeTo, to:'ucenter', replace:true}">
            <img slot="icon" src="../../assets/img/icon_account_a3x.png">
            <img slot="icon" src="../../assets/img/icon_account_b3x.png">
            <p>{{$t('nav.my')}}</p>
        </mt-tab-item>
    </mt-tabbar>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: 'nav-footer',
        data() {
            return {
                selected: 'find'
            }
        },
        mounted() {
            this.setTab()
        },
        watch: {
            $route() {
                this.setTab()
            }
        },
        computed: {
            ...mapGetters([]),
        },
        methods: {
            setTab() {
                if (this.$route.path.indexOf('find') > -1) {
                    this.selected = 'find'
                } else if (this.$route.path.indexOf('exchange') > -1) {
                    this.selected = 'exchange'
                } else if (this.$route.path.indexOf('market') > -1) {
                    this.selected = 'market'
                } else if (this.$route.path.indexOf('ucenter') > -1) {
                    this.selected = 'ucenter'
                } else {
                    this.selected = 'find'
                }
            }
        },
    }

</script>
<style lang="less">
    #app .mint-tabbar {
        background-color: #272731;
        background-image: none;

        > .mint-tab-item {
            color: #999;
            padding: 0.13rem 0;
            background-color: #272731;

            .mint-tab-item-icon {
                width: 0.48rem;
                height: 0.48rem;
                margin-bottom: 0;

                img {
                    object-fit: contain;
                }
            }

            img:last-of-type {
                display: none;
            }

            &.is-selected {
                background-color: #272731;
                color: #00A0E9;

                img:first-of-type {
                    display: none;
                }

                img:last-of-type {
                    display: block;
                }
            }

            .mint-tab-item-label {
                font-size: 0.2rem;
            }
        }

    }

    .red-dot {
        position: absolute;
        right: 0.4rem;
        top: 0.2rem;
        background-color: red;
        width: 5px;
        height: 5px;
        border-radius: 50%;
    }
</style>
