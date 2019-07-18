<template>
    <div class="page">
        <top-back>{{$t('public0.public999')}}</top-back>

        <div class="page-main">
            <div class="content">
                <ul class="payment-detail">
                    <li>
                        <label class="address">{{$t('account.user_Pick_up_address')}}<!--提现地址--></label>
                        <p class="address mt10">
                            <input type="text" v-validate="'required'" name="selToAddress" maxlength="100"
                                   v-model="toAddress" :placeholder="$t('public0.public45')" @focus="isFocus=true;getUserAddress()" @blur="setBlur" autocomplete="off" />
                            <i class="scanning" v-tap="{methods: scanQRCode}"></i>
                            <span class="user-address" v-show="isFocus && !toAddress && userAddress" @click="toAddress = userAddress">{{userAddress}}</span>
                        </p>
                    </li>
                    <li v-if="symbol==='EOS'">
                        <p>{{$t('account.user_center_history_note')}}<!--提现备注--></p>
                        <p class="mt10"><input type="text" maxlength="1000" v-model="memo"
                                  :placeholder="'Memo,'+$t('public0.public237')"/></p>
                    </li>
                    <li class="add_num">
                        <p>{{$t('account.user_Draw_the_number')}}<!--提现数量--></p>
                        <p class="mt10"><input type="number" v-model="amount" v-validate="'required|isLessMin|isMoreMax'"
                                  name="amount"
                                  :placeholder="$t('account.user_minimum_number_of_cash').format(`：${minWithdraw} ${symbol}`)">
                            <!--最小提现数量为：{0} {symbol}。--><a href="javascript:;" class="setall" @click="setAll">{{$t('trade_record.trade_record_all')}}</a></p>
                        <label class="aumont mt10">{{$t('account.estimated_value_available')}}<!--可用余额-->
                            {{symbolInfo.availableBalance}} {{symbol}}</label>

                    </li>
                    <li class="add-top mt15">
                        <h4>{{$t('exchange.advanced_fee')}}<!--手续费--></h4>
                        <h4><span>{{procedureFee}}</span> <span>{{symbol}}</span></h4>
                        <h4>{{$t('account.user_Actual_arrival')}}<!--实际到账--></h4>
                        <h4><span>{{lastMount}}</span> <span>{{symbol}}</span></h4>
                    </li>
                </ul>
                <div class="info mt50">
                    <h1>{{$t('public0.public243')}}：<!--温馨提示--></h1>
                    <ol>
                        <li>{{$t('account.user_prompt7')}}<!--请勿直接提现至众筹或 ICO 地址。我们不会处理未来代币的发放。--></li>
                        <li>{{$t('account.user_prompt8')}}<!--提现请求申请成功后，请去邮箱点击链接确认本次提现请求。--></li>
                        <li>{{$t('public0.public229')}}<!--您可以在充值提现历史记录页面跟踪状态。--></li>
                    </ol>
                </div>
            </div>
            <div class="bottom">
                <submit-button v-tap="{methods: walletWithdraw}">{{$t('account.estimated_value_withdrawal')}}</submit-button>
            </div>
        </div>
        <mt-popup class="place_order_popup" v-model="placeOrderVisible" position="bottom">
            <confirm ref="confirm" :params="params1" @removeDialog="removeDialog"></confirm>
        </mt-popup>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {Validator} from 'vee-validate'
    import utils from '@/assets/js/utils'
    import numUtils from '@/assets/js/numberUtils'
    import userUtils from '@/api/wallet'
    import confirm from './confirm'
    import cordovaUtils from '@/assets/js/cordovaUtils'

    export default {
        name: 'page-withdrawal',
        components: {
            confirm
        },
        data() {
            return {
                isFocus: false,
                placeOrderVisible: false,
                value: 'optionA',
                fromAddress: '',
                symbol: '',
                availableBalance: null,
                procedure: '',
                amount: null,
                showNewAddress: false,
                toAddress: '',
                data: [],
                mobileState: null,
                userAddress: '0xc1912fee45d61c87cc5ea59dae31190fffff232d',
                memo: ''
            }
        },
        computed: {
            ...mapGetters(['getUserInfo']),
            params1() {
                return {
                    fromAccount: this.symbolInfo.accountId,
                    selToAddress: this.toAddress,
                    amount: this.amount,
                    symbol: this.$route.params.symbol,
                    symbolType: this.symbolInfo.symbolType,
                    phoneNumber: this.getUserInfo.mobile,
                    countryCode: this.getUserInfo.countryCode || '+86',
                    memo: this.memo
                }
            },
            msgs() {
                return {
                    selToAddress: {required: this.$t('public0.public44')}, // 请选择地址或使用新地址
                    amount: {required: this.$t('public0.public46')} // 请输入提现金额
                }
            },
            symbolInfo() {
                for (let i = 0; i < this.data.length; i++) {
                    let d = this.data[i]
                    if (this.$route.params.symbol === d.symbol) {
                        return d
                    }
                }
                return {}
            },
            procedureFee() { // 手续费 提现数量-固定手续费
                return utils.removeEndZero(numUtils.BN(this.symbolInfo.procedureFee).toFixed(8))
            },
            lastMount() { // 实际到账
                if (this.amount === null || this.amount === 0) {
                    return 0
                } else {
                    let m = numUtils.minus(this.amount, this.procedureFee)
                    if (m.lt(0)) {
                        return 0
                    } else {
                        return utils.removeEndZero(m.toFixed(8, 1))
                    }
                }
            },
            minWithdraw() {
                return utils.removeEndZero(numUtils.BN(this.symbolInfo.minWithdraw).toFixed(8))
            },
            isLessMin() { // 是否小于最小额度
                return numUtils.BN(this.amount).gte(numUtils.BN(this.minWithdraw))
            },
            isMoreMax() { // 是否大于可用余额
                return numUtils.BN(this.amount).lte(numUtils.BN(this.symbolInfo.availableBalance))
            }
        },
        watch: {
            amount(newVal) {
                if (newVal.length > 18) {
                    this.$nextTick(() => {
                        this.amount = newVal.substring(0, 18)
                    })
                }
            },
            placeOrderVisible(val) {
                let self = this
                if (val) {
                    this.$nextTick(() => {
                        setTimeout(() => {
                            self.$refs.confirm.$el.querySelector('input').focus()
                        }, 100)
                    })
                }
            }
        },
        created() {
            this.symbol = this.$route.params.symbol
            Validator.extend('isLessMin', {
                getMessage: (field, args) => this.$t('account.user_minimum_number_of_cash').format(`${this.minWithdraw}${this.symbol}`),
                validate: (files, args) => {
                    return this.isLessMin
                }
            })
            Validator.extend('isMoreMax', {
                getMessage: (field, args) => this.$t('public0.public47').format(`${this.symbolInfo.availableBalance}${this.symbol}`), // 提现额度不能大于可用余额：{0}
                validate: (files, args) => {
                    return this.isMoreMax
                }
            })
            this.getWalletByCoin()
        },
        methods: {
            setAll(){
              this.amount = this.symbolInfo.availableBalance
            },
            setBlur(){
              setTimeout(()=>{
                this.isFocus = false
              },300)
            },
            scanQRCode() {
                cordovaUtils.scanQRCode((addr) => {
                    this.toAddress = addr
                })
            },
            removeDialog() {
                this.placeOrderVisible = false
            },
            getUserState() {
                // 获取当前用户状态信息
                userApi.getUserState((data) => {
                    this.mobileState = data.mobileAuthState
                }, (msg) => {
                    console.error(msg)
                })
            },
            getWalletByCoin() {
                userUtils.myAssets({}, (res) => {
                    res = res.filter(item => {
                        return item.type === 1
                    })
                    this.data = res
                })
            },
            walletWithdraw() {
                var validData = {
                    selToAddress: this.toAddress,
                    amount: this.amount,
                    fromAccount: this.data.fromAccount,
                }
                this.$validator.validateAll(validData).then((validResult) => {
                    if (!validResult) {
                        let items = this.errors.items
                        if (items && items.length && items[0]) {
                            let name = items[0].field
                            let msg = this.msgs[name] && this.msgs[name][this.errors.firstRule(name)] ? this.msgs[name][this.errors.firstRule(name)] : this.$t(this.errors.first(name))
                            Tip({type: 'danger', message: msg})
                        }
                        return
                    }
                    this.placeOrderVisible = true
                })
            },
            getUserAddress() {
                userUtils.listWithdraws(this.symbol, (data) => {
                    // this.userAddress = data ? data.address : null
                }, (msg) => {
                    console.error(msg)
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .place_order_popup {
        width: 100%;
        background: #ffffff;
    }

    @font_color_transparent: #cbd4ec;
    .c-button-normal {
        display: inline-block;
        padding: 0 .12rem;
        width: 100%;
    }


    .page-main {
        .content{
            background: #ffffff;
            border-radius: 0.15rem;
            padding: 0.45rem 0.4rem;
        }
    }

    .header {
        font-size: .36rem;
        color: @font_color_transparent;
    }

    .payment-detail {
        li {
            color: #aaaaaa;
            padding: 0.34rem 0 0rem;
            label {display: block;}
            h1 {
                font-size: .4rem;
                padding-bottom: .45rem;
            }

            h2 {
                font-size: .26rem;
            }

            h3 {
                position: relative;
                font-size: 0.36rem;
                padding-top: 0.2rem;

                span {
                    position: absolute;
                    right: 0;
                    color: #FF3366;
                    font-weight: bold;
                }
            }

            p {
                position: relative;
                line-height: 0.5rem;

                &:last-of-type {
                    color: #aaaaaa;
                }

                input {
                    width: 100%;
                    line-height: 0.62rem;
                    padding-right: 0.5rem;
                    font-size: 0.32rem;
                    background-color: transparent;
                    border: none;
                    border-bottom: 1px solid #cccccc;
                    color: #222;

                    &:focus {

                    }
                }

                input::placeholder {
                    color: #aaaaaa;
                }

                span {
                    position: absolute;
                    right: 0;
                    color: #CCC;
                }
            }

            &:last-of-type {
                border-bottom: none;
            }

            > ul > li {
                margin-left: 0;
                margin-right: 0;
            }

            textarea {
                width: 100%;
                font-size: 0.28rem;
                background-color: transparent;
                border: 1px solid #ccc;
                color: #666666;
                padding: 0.15rem 0.1rem;
                height: 1.5rem;
                resize: none;

                &:focus {

                }
            }
        }

        li:nth-of-type(1) {
            padding-top: 0;
            p {
                &.aumont {
                    color: #222;
                }

                &.address {
                    span {
                        position: absolute;
                        top: .52rem;
                        left: 0;
                        z-index: 1;
                        width: 100%;
                        height: .5rem;
                        padding-left: .2rem;
                        padding-right: .2rem;
                        line-height: .5rem;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        background-color: #ccc;
                        color: #333;
                        overflow: hidden;
                    }
                }
            }
        }
        .add_num{
            label{
                line-height: 0.5rem
            }
        }
        li.add-top {
            h4 {
                line-height: .4rem;
            }

            h4:nth-child(add) {
                font-size: .26rem;
            }

            h4:nth-child(even) {
                font-size: .34rem;
                display: flex;
                justify-content: space-between;
                color: #222;
                line-height: 0.7rem;
                padding-bottom: 0.1rem;
            }
        }
    }

    .scanning {
        position: absolute;
        width: 0.4rem;
        height: 0.4rem;
        right: 0;
        top: 0.11rem;
        background: url('../../../assets/img/i_scanning.png') no-repeat center;
        background-size: auto 100%;
    }

    .step-next {
        background-color: #f9f9f9;
        font-size: .3rem;

        .mint-button {
            font-size: .4rem;
        }

        button {
            height: .9rem;
        }

        &.fixed {
            position: fixed;
            left: 0.3rem;
            right: 0.3rem;
            bottom: 0rem;
            margin-top: 0;
            margin-left: 0;
            margin-right: 0;
        }
    }

    .info {
        h1 {
            color: #222;
            font-weight: bold;
            text-align: left;
            font-size: .28rem;
            line-height: 0.4rem;
        }

        ol li {
            color: #222;
            font-size: .28rem;
            text-align: left;
            line-height: .36rem;
            padding-top: 0.1rem;
            list-style-type: decimal;
            margin-left: 0.26rem;
        }
    }

    .bottom {
        width: 100%;
        text-align: center;
        padding: 0 .3rem 0.3rem;
        margin-top: 0.9rem;

    }
    .setall {position: absolute; right: 0.2rem; top: 0; line-height: 0.62rem; font-size: 0.28rem; color: rgb(74, 198, 195);}
</style>
