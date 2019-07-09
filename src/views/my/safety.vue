<template>
    <div class="page">
        <top-back>{{$t('user.safety')}}</top-back>
        <div class="page-main">
            <rail-bar v-for="data in data1" :item="data" class="hr"></rail-bar>
        </div>
    </div>
</template>

<script>
    import railBar from '../../components/RailBar'
    import userApi from '@/api/individual'

    export default {
        components: {
            railBar
        },
        data() {
            return {
                googleState: '',
                mobileState: '', // 短信验证状态是否绑定
                data1: [
                    {
                        route: 'changePassword',
                        name: this.$t('user.changePassword'),
                    },
                    {
                        route: 'changePaymentPassword',
                        name: this.$t('user.changePaymentPassword'),
                    },
                    {
                        route: 'noteVerif',
                        name: this.$t('auth_warning.warning_SMS_auth'),
                        small: `<span style="color:#aaaaaa">${this.$t('user.noBind')}</span>`
                    }
                    /*{
                        route: 'bindGoogle',
                        name: this.$t('auth_warning.warning_google_auth'),
                        small: `<span style="color:#aaaaaa">${this.$t('user.noBind')}</span>`
                    },*/
                ]
            }
        },
        created() {
            this.getbindstatue()
        },
        methods: {
            getbindstatue() {
                userApi.getUserState((data) => {
                    this.mobileState = data.mobileAuthState;
                    this.googleState = data.googleState

                    /*this.googleState === 0 ?
                        this.data1[3].small = `<span style="color:#aaaaaa">${$t('account.user_center_state_unbind')}</span>` :
                        this.data1[3].small = `<span style="color:#4AC6C3">${$t('account.user_center_state_bind')}</span>`*/

                    this.mobileState === 0 ?
                        this.data1[2].small = `<span style="color:#aaaaaa">${this.$t('account.user_center_state_unbind')}</span>` :
                        this.data1[2].small = `<span style="color:#4AC6C3">${this.$t('account.user_center_state_bind')}</span>`

                }, (msg) => {
                    console.log(msg)
                })
            }
        }
    }
</script>

<style scoped lang="less">
.page-main {padding-left: 0; padding-right: 0;}
.hr {border-bottom: 1px solid #eeeeee;}
</style>
