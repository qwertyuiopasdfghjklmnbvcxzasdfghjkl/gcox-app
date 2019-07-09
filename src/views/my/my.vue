<template>
    <div class="page">
        <div class="page-main user">
            <div class="user_head">
                <div class="info" @click="routeTo()">
                    <label>
                        <img :src="avatarUrl||''" @error="setDefaultIcon($event)">
                    </label>
                    <p>
                        <span>{{getUserInfo.nickname || '设置昵称'}}<img src="../../assets/img/ic_edit@3x.png"></span>
                        <span class="tell">{{getUserInfo.username}}</span>
                    </p>
                </div>
                <img src="../../assets/img/userBanner@2x.png" class="bg">
            </div>
            <div>
                <rail-bar v-for="data in data1" :item="data" class="hr"></rail-bar>
            </div>
            <div class="mt20">
                <rail-bar v-for="data in data2" :item="data" class="hr"></rail-bar>
            </div>
            <div class="mt20">
                <rail-bar v-for="data in data3" :item="data" class="hr" v-tap="{methods:data.method}"></rail-bar>
            </div>
            <label class="exit mt20" v-tap="{methods: loginOut}">{{$t('user.quit')}}</label>
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
                userState: { // 用户状态信息
                    coinState: 0,
                    googleState: 0,
                    nickname: null,
                    verifyState: 0,
                    verifyTimes: 0
                },
                data1: [
                    {
                        route: 'realName',
                        icon: require('@/assets/img/ic_smrz@3x.png'),
                        name: this.$t('user.realName'),
                        small: `<span style="color:#aaaaaa"></span>`
                    },
                    {
                        route: 'message',
                        icon: require('@/assets/img/ic_xx@3x.png'),
                        name: this.$t('user.msg'),
                        small: ''
                    },
                    {
                        route: 'set',
                        icon: require('@/assets/img/ic_sz@3x.png'),
                        name: this.$t('user.set'),
                    },
                ],
                data2: [
                    {
                        route: 'safe',
                        icon: require('@/assets/img/ic_aqzx@3x.png'),
                        name: this.$t('user.safety')
                    },
                    {
                        route: '',
                        icon: require('@/assets/img/ic_hdtg@3x.png'),
                        name: this.$t('user.activity'),
                        disabled:true
                    },
                    {
                        route: 'help',
                        icon: require('@/assets/img/ic_bzzx@3x.png'),
                        name: this.$t('user.help'),
                    },
                ],
                data3: [
                    {
                        route: 'about',
                        icon: require('@/assets/img/ic_gy@3x.png'),
                        name: this.$t('user.about'),
                        method:()=>{

                        }
                    },
                    {
                        route: '',
                        icon: require('@/assets/img/ic_bbh@3x.png'),
                        name: '',
                        method:()=>{
                            // 检测全量更新
                            this.$parent.$parent.$refs.update.getLatestVersion(true)
                        }
                    },
                ],
            }
        },
        computed: {
            ...mapGetters(['getUserInfo','getVersion']),
        },
        created() {
            this.data3[1].name = this.$t('user.versions').format(this.getVersion)
            this.fnUserState()
            this.fnDownloadHeader()
            this.getMessageList();
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
            fnDownloadHeader() {
                // 下载当前用户头像
                let img = window.localStorage.headerImg
                if(!img){
                    userInfoApi.downloadHeader((url) => {
                        this.avatarUrl = url
                        window.localStorage.headerImg = url
                    })
                }else{
                    this.avatarUrl = img
                }

            },
            fnUserState() {
                // 获取当前用户状态信息
                userInfoApi.getUserState((data) => {
                    this.userState = {
                        coinState: data.coinState,
                        googleState: data.googleState,
                        nickname: data.nickname,
                        verifyState: data.verifyState,
                        verifyTimes: data.verifyTimes
                    }
                    this.showState();
                    this.isUseCDCCPay = (data.coinState === 1)
                    this.data1[0].route = this.showVerifyState(0)?'realName':''
                }, (msg) => {
                    console.error(msg)
                })

            },
            showVerifyState(targetVerifyState) { // 实名验证状态
                console.log(this.userState.verifyTimes)
                if (this.userState.verifyTimes <= 3) {
                    if (this.userState.verifyTimes === 3) {
                        if (this.userState.verifyState === 0) {
                            return targetVerifyState === 3
                        } else {
                            return targetVerifyState === this.userState.verifyState
                        }
                    } else {
                        return targetVerifyState === this.userState.verifyState
                    }
                } else {
                    return targetVerifyState === 3
                }
            },
            showState() {
                switch (true) {
                    case this.showVerifyState(0):
                        this.data1[0].small = `<span style="color:#aaaaaa">${this.$t('account.user_Real_name_verification')}</span>`;
                        break
                    case this.showVerifyState(1):
                        this.data1[0].small = `<span style="color:#f6d41b">${this.$t('public0.public37')}</span>`;
                        break
                    case this.showVerifyState(2):
                        this.data1[0].small = `<span style="color:#4AC6C3">${this.$t('public0.public38')}</span>`;
                        break
                    case this.showVerifyState(3):
                        this.data1[0].small = `<span style="color:#ff6812">${this.$t('public0.public39')}</span>`;
                        break
                    case this.showVerifyState(4):
                        this.data1[0].small = `<span style="color:#f6d41b">${this.$t('public0.public151')}</span>`;
                        break
                }
            },
            getMessageList () {
                // if (!this.isLogin) {
                //     this.messageList = []
                //     this.unReadLength = 0
                //     return
                // }
                // 参数为空时获取所有未读消息
                userInfoApi.getMessages({}, (res) => {
                    this.messageList = res.rst
                    if(this.messageList){
                        this.data1[1].small = `<span style="color: #fff;display: inline-block;border-radius: 50%;
                        font-size: 0.2rem;line-height: 0.3rem;width: 0.3rem;height: 0.3rem;text-align:center;
                        background: #4AC6C3;">${this.messageList}</span>`
                    }
                })
            },
            loginOut () {
                // 确认退出当前帐号吗？
                MessageBox({
                    title: this.$t('public0.public242'),
                    message: this.$t('account.user_center_logout_confirm'),
                    confirmButtonText: this.$t('public0.ok'),
                    showCancelButton: true,
                    cancelButtonText: this.$t('public0.no')
                }).then(action => {
                    if (action === 'confirm') {
                        this.setApiToken(null);
                        localStorage.removeItem('userInfo')
                        localStorage.removeItem('headerImg')
                        this.$router.push({name: 'find'})
                    }
                })
            },
        }
    }
</script>
<style lang="less" scoped="">
.page-main {top: 0; padding-left: 0; padding-right: 0;}
.user {
    .user_head {
        position: relative;
        overflow: hidden;
        height: 2.2rem;

        .info {
            position: absolute;
            padding-left: 0.3rem;
            padding-right: 0.3rem;
            left: 0;
            bottom: 0.4rem;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            label {
                width: 0.8rem;
                height: 0.8rem;
                border-radius: 50%;
                overflow: hidden;
                border: 0.02rem solid #ffffff;
                img{
                    height: 100%;
                    width: 100%;
                }
            }

            p {
                color: #ffffff;
                font-size: 0.34rem;
                padding-left: 0.2rem;
                line-height: 0.45rem;

                span {
                    display: block;

                    img {
                        width: 0.45rem;
                        height: 0.25rem;
                        padding-left: 0.2rem;
                    }
                }

                .tell {
                    font-size: 0.28rem;
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
            width: calc(100% - 0.88rem);
            bottom: 0;
            right: 0;
            background: #f7f7f7;
            height: 1px;
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
</style>
