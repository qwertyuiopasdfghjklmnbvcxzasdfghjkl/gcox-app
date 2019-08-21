<template>
    <div class="page">
        <top-back :backPage="'ucenter'">{{$t('user.safety')}}</top-back>
        <div class="page-main">
            <div class="mt20">
                <rail-bar v-for="data in data1" :item="data" class="hr"></rail-bar>
            </div>
            <!--<div class="mt20 cont">-->
                <!--<rail-bar v-for="data in data2" :item="data" class="hr"></rail-bar>-->
                <!--<mt-switch v-model="switchFingerprintPW" class="switchT id1"></mt-switch>-->
                <!--&lt;!&ndash;<mt-switch v-model="switchGesturePW" class="switchT id2"></mt-switch>&ndash;&gt;-->
            <!--</div>-->
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
                data2: [
                    {
                        disabled: true,
                        name: this.$t('home.fingerprintPW'),
                        rightIcon: true,
                    },
                    // {
                    //     disabled: true,
                    //     name: this.$t('home.gesturePW'),
                    //     rightIcon: true,
                    // },
                ],
                userInfo: {},
                switchFingerprintPW: false,
                switchGesturePW: false
            }
        },
        computed: {
            ...mapGetters(['getUserInfo']),
        },
        watch: {
            switchFingerprintPW(e) {
                if (e) {
                    this.fingerPrint()
                }
            }
        },
        created() {
            this.userInfo = this.getUserInfo
            if (this.userInfo.googleAuthEnable === 1) {
                this.data1[0].small = `<span style="color:#aaaaaa">${this.$t('account.user_center_state_bind')}</span>`
            } else {
                this.data1[0].small = `<span style="color:#aaaaaa">${this.$t('user.noBind')}</span>`
            }
            console.log(this.userInfo)
        },
        methods: {
            fingerPrint() {
                Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);

                function isAvailableSuccess(result) {
                    /*
                    result depends on device and os.
                    iPhone X will return 'face' other Android or iOS devices will return 'finger'
                    */
                    console.log("Fingerprint available", result);
                    this.fingerShow()
                }

                function isAvailableError(message) {
                    // 'message' will be an object with an error code and message
                    console.log(message);
                }
            },
            fingerShow() {
                Fingerprint.show({
                    clientId: "Fingerprint-Demo",
                    clientSecret: "password"
                }, successCallback, errorCallback);

                function successCallback() {
                    alert("Authentication successfull");
                }

                function errorCallback(err) {
                    alert("Authentication invalid " + err);
                }
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

    .cont {
        position: relative;

        .switchT {
            position: absolute;
            right: 0.3rem;
            top: 0.15rem;
            z-index: 9;
        }

        .id2 {
            top: 1.05rem;
        }
    }
</style>
