<template>
    <div class="page">
        <top-back> {{$t('home.home50')}}</top-back>
        <div class="page-main">
            <div class="symbol">
                <img :src="`data:image/png;base64,${symbolInfo.iconBase64}`"/>
                <span>{{symbolInfo.symbol}}</span>
            </div>
            <div class="inner_text">
                <p>{{$t('public0.public243')}}<!--充值须知--></p>
                <ul>
                    <li>1. {{$t('account.user_prompt1').format(symbolInfo.symbol, symbolInfo.blockConfirm)}}
                        <!--.使用BCH地址充值需要6个网格确认才能到账，具体到账以实际到账时间为准--></li>
                    <li>2. {{$t('account.user_prompt2').format(symbolInfo.symbol)}}
                        <!--充值最小额度为0.01BCH,小于0.01BCH将无法到账。--></li>
                </ul>
            </div>
            <section class="wallet-contant">
                <div class="item">
                    <p class="title">{{symbolInfo.symbol}}{{$t('referral.address')}}</p>
                    <div ref="qrcode" class="qrcode" id="picture"></div>
                    <p class="two f26">{{symbolInfo.address}}</p>
                    <p class="three" v-tap="{methods:copy}">{{$t('referral.copy')}}<!--复制--></p>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {Toast} from 'mint-ui'
    import utils from '@/assets/js/utils'
    import userUtils from '@/api/wallet'
    import cordovaUtils from '@/assets/js/cordovaUtils'

    export default {
        name: 'page-topup',
        data() {
            return {
                symbol: '',
                symbolInfo: {}
            }
        },
        computed: {
            ...mapGetters(['getUserWallets', 'getSymbol']),
        },
        watch: {},
        created() {
            this.symbol = this.getSymbol
            this.getInfo()
            this.$nextTick(() => {
                    utils.qrcode(this.$refs.qrcode, {
                        text: this.symbolInfo.address,
                        width: 190,
                        height: 190
                    })
                }
            )
            console.log(this.getUserWallets,this.getSymbol)
        },
        methods: {
            getInfo() {
                this.getUserWallets.filter(res => {
                    if (this.getSymbol === res.symbol) {
                        this.symbolInfo = res
                    }
                })
            },
            copy() {
                utils.copyText(this.symbolInfo.address)
                Toast(this.$t('public0.public33')) // 复制成功
            },
        }
    }
</script>

<style lang="less" scoped>
    @font_color_transparent: #cbd4ec;
    @fs_24: .28rem;
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

    .wallet-contant {
        padding-bottom: 0.3rem;

        .item {
            background: #2A2A34;
            border-radius: 0.1rem;
            margin: 0.2rem 0;
            padding: 0.3rem 0.2rem;
            .title{
                color: @f_c_2;
                font-size: 0.28rem;
                border-left: 0.04rem solid #00A0E9;
                height: 0.24rem;
                line-height: 0.24rem;
                padding-left: 0.18rem;
            }
            .qrcode{
                 width: 3.1rem;
                 height: 3.1rem;
                 padding: 0.1rem;
                 background: #ffffff;
                 margin: 0.4rem auto;
             }
            .two{
                text-align: center;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .three{
                width: 1.54rem;
                height: 0.54rem;
                text-align: center;
                line-height: 0.54rem;
                background: #00A0E9;
                border-radius:0.1rem;
                margin: 0.5rem auto;
            }
        }
    }
</style>
