<template>
    <div class="page">
        <top-back>
            <span>{{$t('user.center')}}<!--个人中心--></span>
        </top-back>

        <div class="mt20">
            <rail-bar v-for="data in data1" :item="data" class="hr"></rail-bar>
        </div>

        <div class="out">
            <button class="blue_but" v-tap="{methods: loginOut}">{{$t('home.home18')}}</button>
        </div>
    </div>
</template>

<script>
    import railBar from '../../../components/RailBar'
    import {MessageBox} from 'mint-ui'
    import { mapActions, mapGetters } from 'vuex'
    export default {
        name: 'page-myInfo',
        components: {
            railBar
        },
        data () {
            return {
                state: null,
                data1: [
                    {
                        route: 'kyc',
                        name: this.$t('home.home16'),
                        icon: require('@/assets/img/kyc.png'),
                    }
                ],
            }
        },

        created () {
            this.getKYCstate()
        },
        methods: {
            ...mapGetters(['getUserInfo']),
            ...mapActions(['setApiToken']),
            getKYCstate(){
                this.state = this.KYCstate(this.getUserInfo().kycState)
                this.data1[0].small = `<span style="color:#aaaaaa">${this.$t(this.state)}</span>`
                console.log(this.state, this.getUserInfo())
            },
            KYCstate(i){
                let As ={
                    "0": "public0.public39",
                    "1": "public0.public38", // 已通过
                    "-1": "public0.public151",
                    "-2": "account.user_fail",
                    "-3": "account.user_fail",
                }
                return As[i]
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

<style lang="less" scoped>
.out{
    text-align: center;
    position: absolute;
    bottom: 1.4rem;
    left: 0.48rem;
}
</style>
