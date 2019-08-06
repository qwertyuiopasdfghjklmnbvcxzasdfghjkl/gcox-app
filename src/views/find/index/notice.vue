<template>
    <div class="notice">
        <swiper :options="swiperOption">
            <!-- 切换公告 -->
            <swiper-slide v-for="(item,index) in adsense" :key="index">
                <router-link :to="{name:'notice-detail', query:{id:item.cmsInfoId}}">
                    <p>{{item.titleCn}}</p>
                </router-link>
            </swiper-slide>
            <div class="swiper-pagination-p" slot="pagination"></div>
        </swiper>
    </div>
</template>

<script>
    import findApi from '@/api/find'

    export default {
        data() {
            return {
                adsense: [],
                swiperOption: {
                    // 所有配置均为可选（同Swiper配置）

                    autoplay: true,
                    speed: 1000,
                    observer: true,
                    direction : 'vertical',
                    pagination: {
                        el: '.swiper-pagination-p',
                    },
                }
            }
        },
        created() {
            this.getAdsense()
        },
        methods: {
            getAdsense() {
                let data = {
                    firstLevel: 1,
                    secondLevel: 1,
                    page: 1,
                    size: 3
                }
                findApi.getCmsList(data, res => {
                    this.adsense = res.data
                }, msg => {
                    Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
                })
            }
        }
    }
</script>
<style lang="less" scoped="">
    .notice {
        /*padding-top: 36.2%;*/
        position: relative;
        height: 0.4rem;
        /*border-radius: 0.1rem;*/
        overflow: hidden;

        .swiper-container {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
        }

        /deep/ .swiper-pagination-bullet {
            background: #fff;
            opacity: 0;
        }

        /deep/ .swiper-pagination-bullet-active {
            background-color: #4AC6C3;
            opacity: 0;
        }

        p{
            color: #A7ACB9;
            font-size: .28rem;
            line-height: 0.4rem;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }

</style>
