<template>
    <div class="page">
        <top-back :backPage="'ucenter'">{{$t('user.safety')}}</top-back>
        <div class="page-main">
            <div class="mt20">
                <rail-bar v-for="data in data1" :item="data" class="hr"></rail-bar>
            </div>
            <div class="mt20 cont">
                <rail-bar v-for="data in data2" :item="data" class="hr"></rail-bar>
                <mt-switch v-model="switchFingerprintPW" class="switchT id1"></mt-switch>
                <mt-switch v-model="switchGesturePW" class="switchT id2"></mt-switch>
            </div>
        </div>
    </div>
</template>

<script>
    import railBar from '../../../components/RailBar'
    import {mapGetters} from 'vuex'
    export default {
        components: {
            railBar
        },
        data() {
            return {
                data1: [
                    {
                        route: 'google-verify',
                        name: this.$t('home.home12'),
                    },
                    {
                        route: 'resetPW',
                        name: this.$t('home.resetPW'),
                    },
                    {
                        route: 'set-payPW',
                        name: this.$t('home.setPayPW'),
                    }
                ],
                data2:[
                    {
                        disabled: true,
                        name: this.$t('home.fingerprintPW'),
                        rightIcon: true,
                    },
                    {
                        disabled: true,
                        name: this.$t('home.gesturePW'),
                        rightIcon: true,
                    },
                ],
                userInfo: {},
                switchFingerprintPW: false,
                switchGesturePW: false
            }
        },
        computed:{
            ...mapGetters(['getUserInfo']),
        },
        created() {
            this.userInfo = this.getUserInfo
            if(this.userInfo.googleAuthEnable === 1){
                this.data1[0].small = `<span style="color:#aaaaaa">${this.$t('account.user_center_state_bind')}</span>`
            }else{
                this.data1[0].small = `<span style="color:#aaaaaa">${this.$t('user.noBind')}</span>`
            }
            console.log(this.userInfo)
        },
        methods: {

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
    .cont{
        position: relative;
        .switchT{
            position: absolute;
            right: 0.3rem;
            top: 0.15rem;
            z-index: 9;
        }
        .id2{
            top: 1.05rem;
        }
    }
</style>
