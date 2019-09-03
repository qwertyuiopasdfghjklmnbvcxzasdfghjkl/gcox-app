<template>
    <div class="page">
        <top-back>{{$t('public0.topup')}}</top-back>

        <div class="page-main">
            <div class="symbol">
                <img :src="`data:image/png;base64,${symbolInfo.iconBase64}`"/>
                <span>{{symbolInfo.symbol}}</span>
            </div>
            <div class="inner_text">
                <p>{{$t('home.notice')}}：<!--温馨提示--></p>
                <ol>
                    <li>{{$t('public0.text001')}}<!--您可以在充值提现历史记录页面跟踪状态。--></li>
                </ol>
            </div>
            <div class="content">
                <ul class="payment-detail">
                    <li>
                        <label class="address" v-tap="{methods: getAddress}">{{$t('account.user_Pick_up_address')}}
                            <i><img src="../../../../assets/img/tc_meus_b@2x.png"/></i><!--提现地址--></label>
                        <p class="address mt10">
                            <input type="text" v-validate="'required'" name="selToAddress" maxlength="100"
                                   v-model="form.toAddress" :placeholder="$t('public0.public-new-address')" autocomplete="off"/>
                            <i class="scanning" v-tap="{methods: scanQRCode}"></i>
                            <!--<span class="user-address" v-show="isFocus && !toAddress && userAddress" @click="toAddress = userAddress">{{userAddress}}</span>-->
                        </p>
                    </li>
                    <li v-if="symbol==='EOS'">
                        <label>{{$t('account.user_center_history_note')}}<!--提现备注--></label>
                        <p class="mt10"><input type="text" maxlength="1000" v-model="memo"
                                               :placeholder="'Memo,'+$t('public0.public237')"/></p>
                    </li>
                    <li class="add_num">
                        <label>{{$t('account.user_Draw_the_number')}}<!--提现数量--></label>
                        <p class="mt10">
                            <input type="number" v-model="form.amount"
                                   name="amount"
                                   @blur="amount"
                                   :placeholder="$t('account.user_minimum_number_of_cash').format(`：${symbolInfo.minWithdraw} ${symbol}`)"/>
                            <!--最小提现数量为：{0} {symbol}-->
                        </p>
                        <small class="aumont">
                            <span>{{$t('exchange.advanced_fee')}}<!--手续费-->
                                {{symbolInfo.procedureFee}} {{symbol}}</span>
                            <span>
                                {{$t('account.estimated_value_available')}}:<!--可用余额-->
                                <i class="blue">{{symbolInfo.availableBalance}} {{symbol}}</i>
                            </span>
                        </small>
                    </li>
                    <li>
                        <label>{{$t('home.pay-password')}}<!--资金密码--></label>
                        <p>
                            <input :placeholder="$t('home.rule-password')"
                                   v-model="form.password"
                                   @blur="rulePayPW"
                                   :type="showPayPW? 'text':'password'"/>
                            <span class="eye" v-tap="{methods: ()=>{showPayPW=!showPayPW}}">
                                <img :src="showPayPW? require('../../../../assets/img/eye_open@2x.png')
                                :require('../../../../assets/img/eye_closed@2x.png')"/>
                            </span>
                        </p>
                        <span class="show_error" v-if="showPayPWError">{{$t('home.rule-password')}}</span>
                    </li>
                    <li>
                        <label>{{$t('account.user_center_Google_verification_code')}}<!--谷歌验证码--></label>
                        <p>
                            <input :placeholder="$t('home.home11')" v-model="form.googleCode"/>
                        </p>
                    </li>
                    <li class="add-top mt15">
                        <h4>{{$t('account.user_Actual_arrival')}}：<!--到账数量-->
                            <span>{{lastAmount}}</span> <span> {{symbol}}</span></h4>
                    </li>
                </ul>
            </div>
            <div class="bottom">
                <mt-button type="primary" class="circle" :class="{'unlock':lock}"
                           v-tap="{methods: walletWithdraw}">{{$t('public0.submit')}}
                </mt-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import wallet from '@/api/wallet'
    import cordovaUtils from '@/assets/js/cordovaUtils'
    import numUtils from '@/assets/js/numberUtils'

    export default {
        name: 'page-withdrawal',
        data() {
            return {
                symbolInfo: {},
                symbol: null,
                form: {
                    toAddress: '',
                    amount: '',
                    password: '',
                    googleCode: '',
                    memo: null
                },
                showPayPW: false,
                showPayPWError: false,
                reg: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*+=]).{8,20}$/
            }
        },
        computed: {
            ...mapGetters(['getUserWallets', 'getSymbol']),
            lock() {
                return this.form.toAddress && this.form.amount && this.form.password && this.form.googleCode
            },
            lastAmount() {
                if (this.form.amount) {
                    return numUtils.minus(this.form.amount, this.symbolInfo.procedureFee)
                } else {
                    return 0
                }
            }
        },
        watch: {
            'form.password'(e) {
                console.log(e)
                if (e.length >= 8) {
                    this.showPayPWError = !this.reg.test(e)
                }
            }
        },
        created() {
            this.symbol = this.getSymbol
            this.getInfo()
        },
        methods: {
            getInfo() {
                this.getUserWallets.filter(res => {
                    if (this.getSymbol === res.symbol) {
                        this.symbolInfo = res
                    }
                })
            },
            scanQRCode() {
                cordovaUtils.scanQRCode((addr) => {
                    this.form.toAddress = addr
                    console.log(addr)
                })
            },
            walletWithdraw() {
                if(this.lock && !this.showPayPWError){
                    let formData = { // 提现
                        symbol: this.symbol,
                        symbolType: this.symbolInfo.symbolType,
                        amount: this.form.amount,
                        fromAccount: this.symbolInfo.accountId, // 用户id
                        toAddress: this.form.toAddress,
                        alias: this.alias,
                        memo: this.form.memo,
                        password: this.form.password,
                        googleCode: this.form.googleCode,
                        lang: window.localStorage.getItem('lang') === 'zh-CN' ? 'cn' : 'en',
                        withdrawFast: false,
                        type: 0
                    }
                    this.lock = false
                    wallet.walletWithdraw(formData,res=>{
                        Tip({type: 'success', message: this.$t(`error_code.${res}`)})
                        this.$router.push({name: 'trading'})
                    },msg=>{
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                        this.lock = true
                    })
                }
            },
            getAddress(){
                this.$router.push({name:'address'})
            },
            amount(){
                if(Number(this.symbolInfo.availableBalance) < Number(this.symbolInfo.procedureFee)){
                    this.form.amount = 0
                    Tip({type: 'danger', message: this.$t('exchange.exchange_Insufficient_balance')})
                }else if (Number(this.form.amount) < Number(this.symbolInfo.procedureFee)) {
                    this.form.amount = this.symbolInfo.procedureFee
                    Tip({type: 'danger', message: this.$t('home.small-fee')}) // 提币数量不可以少于手续费
                } else if (Number(this.form.amount) > Number(this.symbolInfo.availableBalance)) {
                    this.form.amount = this.symbolInfo.availableBalance
                    Tip({type: 'danger', message: this.$t('public0.public47')}) //转出额度不能大于可用余额
                }
            },
            rulePayPW(){
                this.showPayPWError = !this.reg.test(this.form.password)
            }
        }
    }
</script>

<style lang="less" scoped>

    @f_c_2: #BFC5D1;

    .symbol {
        display: flex;
        height: 0.96rem;
        align-items: center;
        justify-content: left;
        background: #2A2A34;
        margin: 0 -.3rem;
        padding: 0 .3rem;

        img {
            width: 0.5rem;
            height: 0.5rem;
        }

        span {
            margin-left: 0.2rem;
        }
    }

    .inner_text {
        font-size: 0.3rem;
        color: @f_c_2;
        padding: 0.3rem 0;

        p {
            padding-bottom: 0.28rem;
        }

        li {
            font-size: 0.3rem;
            line-height: 0.38rem;
        }
    }

    .page-main {
        .content {
            background: #2A2A34;
            border-radius: 0.1rem;
            margin: 0.2rem 0;
            padding: 0.3rem 0.2rem;
        }
    }

    .payment-detail {
        li {
            margin-bottom: 0.35rem;
            position: relative;

            & > p {
                margin-top: 0.2rem;
                display: flex;
                height: 0.5rem;
                position: relative;

                input {
                    flex-shrink: 0;
                    flex-grow: 1;
                    background: none;
                    border: none;
                    border-bottom: 0.02rem solid #43434E;
                    outline: none;
                    line-height: 0.4rem;
                    color: #ffffff;
                }

                .scanning {
                    width: 0.5rem;
                    height: 0.5rem;
                    background: url("../../../../assets/img/scanner.png") no-repeat center;
                    background-size: 0.5rem;
                    margin-left: 0.2rem;
                }

                .eye {
                    position: absolute;
                    right: 0.1rem;
                    display: inline-block;
                    width: 0.4rem;
                    height: 0.4rem;

                    img {
                        width: 0.4rem;
                    }
                }
            }

            .aumont {
                display: flex;
                justify-content: space-between;
                margin-top: 0.15rem;
                color: #9da2a9;

                i {
                    font-style: normal;
                    padding-left: 0.1rem;
                }
            }

            .show_error {
                position: absolute;
                bottom: -0.35rem;
                left: 0;
                font-size: 0.2rem;
                color: #f65416;
            }
            .address{
                i{
                    img{
                        width: 0.3rem;
                    }
                }
            }
        }
    }
.bottom{
    margin-top: 0.4rem;
}
    .blue {
        color: #00A0E9;
    }
</style>
