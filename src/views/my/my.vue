<template>
    <div class="page">
        <top-back :back="false" class="top">
            {{$t('nav.my')}}
            <span slot="right" class="right">
                <router-link to="/ucenter/set">
                    <img src="../../assets/img/ic_sz@3x.png">
                </router-link>
            </span>
        </top-back>
        <div class=" user">
            <div class="user_head">
                <div class="info" @click="routeTo()">
                    <label>
                        <img :src="avatarUrl||''" @error="setDefaultIcon($event)">
                    </label>
                    <p>
                        <span class="tell">{{getUserInfo.username}}</span>
                    </p>
                    <span>
                        <img src="../../assets/img/i_rig_c@3x.png">
                    </span>
                </div>
            </div>
            <div class="mt20">
                <rail-bar v-for="data in data1" :item="data" class="hr"></rail-bar>
            </div>
            <div class="mt20">
                <rail-bar v-for="data in data2" :item="data" class="hr"></rail-bar>
            </div>
            <div class="mt20">
                <rail-bar v-for="data in data3" :item="data" class="hr"></rail-bar>
            </div>
            <div class="mt20">
                <rail-bar v-for="data in data4" :item="data" class="hr" @on-click="share()"></rail-bar>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex'
    import railBar from '../../components/RailBar'
    import userApi from '@/api/user'
    import avatar from '@/assets/img/user_img@2x.png'
    import userInfoApi from '@/api/individual'
    import {MessageBox} from 'mint-ui'

    export default {
        components: {
            railBar
        },
        data() {
            return {
                avatarUrl: avatar,
                user: {},
                isUseCDCCPay: false,
                messageList: null,
                title: null,
                userState: { // 用户状态信息
                    coinState: 0,
                    googleState: 0,
                    nickname: null,
                    verifyState: 0,
                    verifyTimes: 0
                },
                data1: [
                    {
                        route: 'trading',
                        icon: require('@/assets/img/wall@3x.png'),
                        name: this.$t('exchange.exchange_wallet'),
                    },
                ],
                data2: [
                    {
                        route: 'safe',
                        icon: require('@/assets/img/ic_aqzx@3x.png'),
                        name: this.$t('user.safety')
                    },
                ],
                data3: [
                    {
                        route: 'message',
                        icon: require('@/assets/img/ic_xx@3x.png'),
                        name: this.$t('user.msg'),
                    },
                ],
                data4: [
                    {
                        disabled: true,
                        icon: require('@/assets/img/ic_fx@3x.png'),
                        name: this.$t('home.home07'),
                        method: ()=>{

                        }
                    },
                    {
                        route: 'about',
                        icon: require('@/assets/img/ic_gy@3x.png'),
                        name: this.$t('user.about'),
                        small: `<span style="color:#ffffff">V1.0.0</span>`,
                        method:()=>{

                        }
                    }
                ]
            }
        },
        computed: {
            ...mapGetters(['getUserInfo']),
        },
        created() {
            // this.getMessageList();
        },
        methods: {

            ...mapActions(['setApiToken']),
            setDefaultIcon(e){
              let tar = e.currentTarget
              tar.src = avatar
            },
            routeTo() {
                this.$router.push('center')
            },
            share(){
                // GCOX全球领先的数字资产交易平台
                //
                this.title = this.$t('home.shar-title')
                console.log(this.title, this.$t('home.shar-title'))
                navigator.share(this.title+'\nhttps://exchange.gcox.com',this.$t('home.shar-title'))
            }
            // getMessageList () {
            //     // if (!this.isLogin) {
            //     //     this.messageList = []
            //     //     this.unReadLength = 0
            //     //     return
            //     // }
            //     // 参数为空时获取所有未读消息
            //     userInfoApi.getMessages({}, (res) => {
            //         this.messageList = res.rst
            //         if(this.messageList){
            //             this.data1[1].small = `<span style="color: #fff;display: inline-block;border-radius: 50%;
            //             font-size: 0.2rem;line-height: 0.3rem;width: 0.3rem;height: 0.3rem;text-align:center;
            //             background: #4AC6C3;">${this.messageList}</span>`
            //         }
            //     })
            // }
        }
    }
</script>
<style lang="less" scoped="">
.page-main {top: 0; padding-left: 0; padding-right: 0;}
.top{
    background: #2A2A34;
}
.user {
    .user_head {
        position: relative;
        overflow: hidden;
        height: 2.24rem;
        background: #2A2A34;
        .info {
            position: absolute;
            padding-left: 0.3rem;
            padding-right: 0.3rem;
            left: 0;
            bottom: 0.92rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            label {
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
                overflow: hidden;
                flex-shrink: 0;
                img{
                    height: 100%;
                    width: 100%;
                }
            }

            p {
                color: #ffffff;
                padding-left: 0.32rem;
                line-height: 0.45rem;
                width: 5.72rem;
                flex-shrink: 0;

                span {
                    display: block;

                    img {
                        width: 0.45rem;
                        height: 0.25rem;
                        padding-left: 0.2rem;
                    }
                }

                .tell {
                    font-size: 0.3rem;
                }
            }

            &>span{
                img{
                    width: 0.15rem;
                    height: 0.24rem;
                }
            }
        }
    }

    .hr {
        position: relative;

        &:after {
            content: '';
            display: block;
            position: absolute;
            z-index: 9;
            bottom: 0;
            right: 0.3rem;
            left:0.3rem;
            background: #43434E;
            height: 0.02rem;
        }

        &:last-child:after {
            display: none;
        }
    }
    .exit {
        display: block;
        text-align: center;
        line-height: 1rem;
        background: #ffffff;
        color: #4AC6C3;
    }
}
.msg{
    color: #fff;display: inline-block;border-radius: 50%;font-size: 0.24rem;line-height: 0.2rem;
    width: 0.3rem;height: 0.3rem;text-align:center;background: #4AC6C3;
}
    .right{
        img{
            width: 0.34rem;
            height: 0.34rem;
            vertical-align: middle;
        }
    }
</style>
