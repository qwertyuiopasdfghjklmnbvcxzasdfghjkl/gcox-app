<template>
    <div class="page">
        <banner></banner>
        <div>
            <label class="flex">
                <i class="ico"><img src="../../assets/img/notice.png"></i>
                <notice></notice>
                <router-link :to="{name: 'notice'}">更多</router-link>
            </label>
        </div>
        <data-box></data-box>
        <data-list></data-list>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import banner from './index/banner'
    import notice from './index/notice'
    import dataBox from './index/data_box'
    import dataList from './index/data_list'

    export default {
        name: 'find',
        components: {
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
        },
        created() {

        },
        methods: {
            ...mapActions(['setAdsense']),
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
