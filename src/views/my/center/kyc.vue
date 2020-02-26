<template>
    <div class="page">
        <top-back :back-page="'center'">{{$t('home.home16')}}</top-back>
        <div class="page-main">
            <div class="cont">
                <img :src="imgSrc[getUserInfo.kycState]"/>
                <div v-if="getUserInfo.kycState === 0">
                    <p>{{$t('usercontent.user85')}}</p>
                    <span @click="submitKYC()" style="cursor: pointer" v-html="$t('usercontent.user48')"></span>
                </div>

                <div v-if="getUserInfo.kycState === 1">
                    <p class="f-c-green">{{$t('usercontent.user42')}}</p>
                    <span>{{$t('usercontent.user43')}}</span>
                </div>

                <div v-if="getUserInfo.kycState === 2">
                    <p class="f-c-green">{{$t('usercontent.user46')}}</p>
                    <span>{{$t('usercontent.user47')}}</span>
                </div>
                <div v-if="getUserInfo.kycState === -1">
                    <p class="f-c-green">{{$t('usercontent.user46')}}</p>
                    <span>{{$t('usercontent.user47')}}</span>
                </div>

                <div v-if="getUserInfo.kycState === -2 || getUserInfo.kycState === -3
      || getUserInfo.kycState === -4 || getUserInfo.kycState === -5">
                    <p class="f-c-danger">{{$t('usercontent.user44')}}</p>
                    <span @click="submitKYC()" style="cursor: pointer" v-html="$t('usercontent.user45')"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import user from '../../../api/user'

    export default {
        data() {
            return {
                // 0未通过，1已通过，-1审核中，-2错误，-3拒绝
                // 0:新的,1:已审核,2:正在提交,-1:待审核,-2:错误,-3:拒绝,-4:不完整,-5:失败
                imgSrc: {
                    '0': require('../../../assets/img/authentication01.png'),
                    '1': require('../../../assets/img/authentication03.png'),
                    '-1': require('../../../assets/img/authentication02.png'),
                    '2': require('../../../assets/img/authentication02.png'),
                    '-2': require('../../../assets/img/authentication04.png'),
                    '-4': require('../../../assets/img/authentication04.png'),
                    '-3': require('../../../assets/img/authentication04.png'),
                    '-5': require('../../../assets/img/authentication04.png'),
                }
            }
        },
        computed: {
            ...mapGetters(['getUserInfo']),
        },
        created() {
            user.userInfo(info => {
                this.setUserInfo(info)
            })
        },
        methods: {
            ...mapActions(['setUserInfo']),
            submitKYC() {
                user.kyc(res => {
                    this.$router.push({name: 'kyc-form', params: {url: res.data.redirect_url}})
                }, msg => {
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .cont {
        text-align: center;
        margin-top: 1.2rem;

        div {
            p {
                margin: 0.35rem auto;
                font-size: 0.3rem;
            }

            .f-c-green {
                color: #13CE66;
            }

            .f-c-danger {
                color: #e74c3c;
            }

            span {
                color: #c8c8c8;
                font-size: 0.22rem;
                line-height: 0.4rem;
            }
        }

        img {
            width: 4rem;
        }
    }
</style>
