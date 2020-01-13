<template>
    <div class="banner">
        <swiper :options="swiperOption">
            <!-- 幻灯内容 -->
            <swiper-slide v-for="(item,index) in adsense" :key="index">
                <a :href="item.gameAdvertisementLink">
                    <img :src="item.gameAdvertisementImage">
                </a>
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>
</template>

<script>
    import findApi from '@/api/find'
    import config from "../../../api/config"

    export default {
        data() {
            return {
                adsense: [
                    // {
                    //     gameAdvertisementLink: 'javascript:;',
                    //     gameAdvertisementImage: require('@/assets/img/banner01@3x.png')
                    // },
                    // {
                    //     gameAdvertisementLink: 'javascript:;',
                    //     gameAdvertisementImage: require('@/assets/img/banner02@3x.png')
                    // }
                ],
                swiperOption: {
                    // 所有配置均为可选（同Swiper配置）

                    autoplay: true,
                    speed: 400,
                    observer: true,
                    pagination: {
                        el: '.swiper-pagination',
                    },
                },
                lang: window.localStorage.lang || 'en'
            }
        },
        created() {
            this.getAdsense()
        },
        methods: {
            getAdsense() {
                findApi.getBanner({type:2}, res => {
                    let enAdsense = [];
                    res.filter(next=>{
                        if(next.siteType === 1){
                            let data ={}
                            if(this.lang === 'zh-CN'){
                                data.gameAdvertisementImage =config.url+next.activityImgUrl;
                            }else{
                                data.gameAdvertisementImage =config.url+next.activityImgUrlEn;
                            }
                            data.gameAdvertisementLink =next.jumpAddress;
                            enAdsense.push(data)
                        }
                    })
                    if(enAdsense.length>0){
                        this.adsense = enAdsense
                    }
                }, msg => {
                    Tip({type: 'error', message: this.$t(`error_code.${msg}`)})
                })
            }
        }
    }
</script>
<style lang="less" scoped="">
    .banner {
        padding-top: 36.2%;
        position: relative;
        height: 3.74rem;
        /*border-radius: 0.1rem;*/
        overflow: hidden;

        .swiper-container {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
            }
        }

        /deep/ .swiper-pagination-bullet {
            background: #fff;
            opacity: 0;
        }

        /deep/ .swiper-pagination-bullet-active {
            background-color: #4AC6C3;
            opacity: 0;
        }
    }

</style>
