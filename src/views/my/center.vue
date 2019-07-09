<template>
    <div class="page">
        <top-back>
            <span>{{$t('user.center')}}<!--个人中心--></span>
        </top-back>

        <div class="page-main">
            <section class="item-section">
                <p><span>{{$t('account.user_center_account')}}<!--账号--></span><span>{{username}}</span></p>
            </section>
            <section class="item-section">
                <p><span>{{$t('user.nickname')}}<!--昵称--></span><span>{{updateNickname}}</span>
                    <span class="nikename" v-if="!getQuickLoginInfo" v-tap="{methods:nikenamefun,par:'isShowRegDialog'}">
                        （{{$t('public0.public40')}}）<!--修改昵称--></span></p>
            </section>
            <section class="item-section">
                <p>
                    <span>{{$t('account.user_center_avatar')}}<!--头像--><i>（{{$t('account.user_center_set_photo')}}）<!--头像仅限修改一次--></i></span>
                    <span class="usericon"><img :src="avatarUrl||''"  @error="setDefaultIcon($event)"/></span>
                </p>
                <form v-if="!isExistUserAvatar" ref="form">
                    <input class="file" type="file" name="source" title=" " accept="image/*" capture="camera" @change="uploadImage"/>
                </form>
            </section>
        </div>

        <my-dialog :show="isShowRegDialog" :isgray="true" @hide="closeDialog('isShowRegDialog')" class="mask">
            <nike-name-form :nikename="userState.nickname" @on-close-all="closeDialog('isShowRegDialog')" @okCallback="okCallback"></nike-name-form>
        </my-dialog>

    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    import config from '@/api/config'
    import utils from '@/assets/js/utils'
    import userUtils from '@/api/individual'
    import nikeNameForm from '@/components/nikeNameForm' // 修改昵称
    import myDialog from '@/components/common/mask' // 遮罩组件
    import avatar from '@/assets/img/user_img@2x.png'
    export default {
        name: 'page-myInfo',
        components: {
            myDialog,
            nikeNameForm
        },
        data () {
            return {
                avatarUrl: avatar,
                isShowRegDialog: false,
                uicon: require("../../assets/img/i_o.png"),
                username: null,
                userState: { // 用户状态信息
                    coinState: 0,
                    googleState: 0,
                    nickname: null,
                    verifyState: 0,
                    verifyTimes: 0
                },
                isUseBarkPay: false,
            }
        },
        computed: {
            ...mapGetters(['getUserInfo', 'getLang', 'getQuickLoginInfo']),
            isExistUserAvatar () {
                return this.avatarUrl !== avatar
            },
            updateNickname () {
                return this.userState.nickname
            },
        },
        created () {
            this.fnUserState()
            this.fnDownloadHeader();
            console.log(window.localStorage.userInfo)
            this.username= JSON.parse(window.localStorage.userInfo).username
        },
        methods: {
            ...mapActions(['setApiToken', 'setLang', 'setUserInfo']),
             setDefaultIcon(e){
              let tar = e.currentTarget
              tar.src = avatar
            },
            fnDownloadHeader () {
                // 下载当前用户头像
                userUtils.downloadHeader((url) => {
                    this.avatarUrl = url
                    window.localStorage.headerImg = url
                })
            },
            uploadImage (e) {
                // 上传头像
                var target = e.target
                if (config.imageType.test(target.files.item(0).name) === false) {
                    return Tip({type: 'danger', message: this.$t('public0.public43')}) // 请上传JPG、PNG、JPEG、BMP格式的图片
                }
                let isTrue = utils.limitUploadImage(target, (msg) => {
                    Tip({type: 'danger', message: this.$t(msg)})
                }, 1)
                if (!isTrue) {
                    target.value = ''
                    return
                }
                this.avatarUrl = window.URL.createObjectURL(target.files.item(0))
                var formData = new FormData(this.$refs.form)
                userUtils.uploadHeader(formData, (msg) => {
                    Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                    this.fnDownloadHeader();
                }, (msg) => {
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
            okCallback (aNickName) {
                let userInfo = JSON.parse(window.localStorage.userInfo)
                userInfo.nickname = aNickName
                // window.localStorage.userInfo = userInfo
                this.setUserInfo(userInfo)
                this.userState.nickname = aNickName
            },
            nikenamefun (args) {
                this[args.par] = true
            },
            closeDialog (attr) {
                this[attr] = false
            },
            fnUserState () {
                // 获取当前用户状态信息
                userUtils.getUserState((data) => {
                    this.userState = {
                        coinState: data.coinState,
                        googleState: data.googleState,
                        nickname: data.nickname,
                        verifyState: data.verifyState,
                        verifyTimes: data.verifyTimes
                    }
                    this.isUseBarkPay = data.coinState === 1
                }, (msg) => {
                    console.error(msg)
                })
            }
        }
    }
</script>

<style lang="less" scoped>
.page-main {padding-left: 0; padding-right: 0;}
.item-section{
    padding: 0 0.3rem;
    background-color: #fff;
    font-size: .32rem;
    border-bottom: 1px solid #eeeeee;
    p{
        color: #222222;
        line-height: 1rem;
        span{
            i.circular{
                color: red;
                margin-left:.1rem;
            }
            &:nth-of-type(1){
                i{
                    font-size: .24rem;
                    color: #aaaaaa;
                    font-style: normal;
                }
            }
            &:nth-of-type(2){
                float: right;
                font-size: .3rem;
                color: #aaaaaa;
            }
        }
    }
}
.item-section:nth-of-type(2){
    p{
        span.nikename{
            font-size: .28rem;
            color: #4AC6C3;
        }
    }
}
.item-section:nth-of-type(3){
    position: relative;
    form{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1rem;
        input{
            width: 100%;
            height: 100%;
            opacity: 0;
        }
    }
}

.item-section:last-of-type{
    margin-top: .2rem;
}
.one{
    background-color: #292929;
    display: flex;
    padding: .3rem .65rem;
    li:first-child{
        i{
            margin-top: .1rem;
        }
        font-size: .42rem;
        width: 1.2rem;
    }
    li:last-child{
        font-size: .28rem;
        p:first-child{
            span:first-child{
                font-size: .44rem;
            }
            span:last-child{
                margin-left: .36rem;
                font-size: .28rem;
                padding: .05rem;
                background-color: #409cf2;
                border-radius: .03rem;
                position: relative;
                top: -.06rem;
            }
        }
        p:last-child{
            line-height: .4rem;
            color:#8089a3;
        }
    }

}
.usericon{
    img{
        width: 100%;
        height: 100%;
    }
    i{
        color: white;
        position: relative;
        top: -0.2rem;
    }
    position: relative;
    top: .2rem;
    text-align: center;
    width: .64rem;
    height: .64rem;
    display: inline-block;
    overflow: hidden;
    border-radius: 50%;
    border: 0;
}
.header{
    font-size: .36rem;
    color: #cbd4ec;
}
.mask{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
