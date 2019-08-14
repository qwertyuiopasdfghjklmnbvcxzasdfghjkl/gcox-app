<template>
    <div class="page">
        <top-back>{{$t('home.new-address')}}</top-back>
        <div class="page-main">
            <div class="form-cont">
                <div class="cont">
                    <ui-input
                            :label="$t('home.input-address')"
                            v-model="form.address"
                            :title="$t('home.address')"
                    ></ui-input>
                    <i class="scanning" v-tap="{methods: scanQRCode}"></i>
                </div>
                <div class="cont">
                    <ui-input
                            :label="$t('home.input-memo')"
                            v-model="form.memo"
                            :title="$t('account.user_Remark_label')"
                    ></ui-input>
                </div>
                <div class="cont">
                    <ui-input
                            :label="$t('home.home11')"
                            v-model="form.googleCode"
                            :title="$t('account.user_center_Google_verification_code')"
                    ></ui-input>
                </div>
            </div>
            <div class="btn">
                <mt-button type="primary" class="circle" :class="{'unlock':lock}"
                           v-tap="{methods: addAddress}">{{$t('home.add-address')}}
                </mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import UiInput from "../../../../components/uiInput";
    import wallet from '../../../../api/wallet'
    import cordovaUtils from '@/assets/js/cordovaUtils'

    export default {
        components: {UiInput},
        data() {
            return {
                symbol: null,
                form: {
                    address: null,
                    memo: null,
                    googleCode: null
                }
            }
        },
        computed: {
            lock() {
                return this.form.address && this.form.memo && this.form.googleCode
            }
        },
        created() {
            this.symbol = this.getSymbol()
            console.log(this.symbol)
        },
        methods: {
            ...mapGetters(['getSymbol']),
            addAddress() {
                if (this.lock) {
                    this.form.symbol = this.symbol
                    this.lock = false
                    wallet.addAddress(this.form,res=>{
                        this.lock = true
                        Tip({type: 'success', message: res.msg})
                        this.$router.push({name:'address'})
                    },msg=>{
                        this.lock = true
                        Tip({type: 'danger', message: msg})
                    })
                }
            },
            scanQRCode() {
                cordovaUtils.scanQRCode((addr) => {
                    this.form.address = addr
                })
            },
        }
    }
</script>

<style scoped lang="less">
    .form-cont {
        .cont {
            height: 1.25rem;
            padding-top: 0.3rem;
            position: relative;
            .scanning{
                position: absolute;
                right: 0;
                top: 0.4rem;
                z-index: 9;
                width: 0.5rem;
                height: 0.5rem;
                background: url("../../../../assets/img/scanner.png") no-repeat center;
                background-size: 0.5rem;
                display: inline-block;
            }
        }
    }

    .btn {
        position: absolute;
        bottom: 1rem;
    }
</style>

