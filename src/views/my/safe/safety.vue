<template>
    <div class="page">
        <top-back>{{$t('user.safety')}}</top-back>
        <div class="page-main">
            <div class="mt20">
                <rail-bar v-for="data in data1" :item="data" class="hr"></rail-bar>
            </div>
            <div class="mt20">
                <rail-bar v-for="data in data2" :item="data" class="hr"></rail-bar>
            </div>
        </div>
    </div>
</template>

<script>
    import railBar from '../../../components/RailBar'
    import userApi from '@/api/individual'

    export default {
        components: {
            railBar
        },
        data() {
            return {
                data1: [
                    {
                        route: 'changePassword',
                        name: this.$t('home.home12'),
                        small: `<span style="color:#aaaaaa">${this.$t('user.noBind')}</span>`
                    },
                    {
                        route: 'changePaymentPassword',
                        name: this.$t('home.resetPW'),
                    },
                    {
                        route: 'noteVerif',
                        name: this.$t('home.setPayPW'),
                    }
                ],
                data2:[
                    {
                        route: 'changePassword',
                        name: this.$t('home.fingerprintPW'),
                        rightIcon: true,
                    },
                    {
                        route: 'changePassword',
                        name: this.$t('home.gesturePW'),
                        rightIcon: true,
                    },
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
    .page-main {
        padding-left: 0;
        padding-right: 0;
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
            left: 0.3rem;
            background: #43434E;
            height: 0.02rem;
        }

        &:last-child:after {
            display: none;
        }
    }
</style>
