<template>
    <div class="page">
        <top-back>{{form === 1 ? $t('home.home54'):$t('home.home55')}}{{$t('trade_record.entrust_detail')}}</top-back>
        <div class="page-main">
            <div class="cont">
                <div class="top">
                    <p>
                        <img :src="`data:image/png;base64,${src}`">
                        <span>{{data.symbol}}</span>
                    </p>
                    <label>
                        <span>{{$t('account.user_center_history_amount')}}</span>
                        <p>{{data.amount}}</p>
                    </label>
                    <label>
                        <span>{{$t('home.home57')}}</span>
                        <p>{{form === 1 ?getRechargeState(data.status).value:getWithdrawalState(data.status).value}}</p>
                    </label>
                </div>
                <div class="bot">
                    <label>
                        <span>{{$t('home.home51')}}</span>
                        <p>{{data.toAddress}}</p>
                        <i v-tap="{methods: copy}">{{$t('home.copy')}}</i>
                    </label>
                    <label>
                        <span>Txid</span>
                        <p>{{data.txId}}</p>
                    </label>
                    <label>
                        <span>{{$t('exchange.exchange_entrust_time')}}</span>
                        <p>{{new Date(data.updatedAt).format()}} {{timeZone}}</p>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import utils from '@/assets/js/utils'
    import {Toast} from 'mint-ui'
    export default {
        name: "history-cont",
        data(){
            return{
                data:{},
                form: null,
                src: null
            }
        },
        computed:{
            ...mapGetters(['getUserWallets']),
            timeZone(){
                return utils.getClientTimezone()
            }
        },
        created() {
            console.log(this.$route.params)
            let params = this.$route.params
            this.data = params.data
            this.form = params.form
            this.getImg()
        },
        methods:{
            getImg(){
                this.getUserWallets.filter(res=>{
                    if(res.symbol === this.data.symbol){
                        this.src = res.iconBase64
                    }
                })
            },
            getRechargeState(state) { // 获取充值状态
                if (state === 1) {
                    return {
                        className: 'underway',
                        value: this.$t('account.user_center_history_status_wait') // 等待中
                    }
                } else if (state === 2) {
                    return {
                        className: 'success',
                        value: this.$t('account.user_center_history_status_success') // 成功
                    }
                } else {
                    return {
                        className: null,
                        value: null
                    }
                }
            },
            getWithdrawalState(state) { // 获取提现状态
                switch (state) {
                    case 1:
                        return {
                            className: 'underway',
                            value: this.$t('account.user_center_history_status_review') // 审核中
                        }
                    case 2:
                    case 3:
                        return {
                            className: 'underway',
                            value: this.$t('account.user_center_history_status_withdrawal') // 提现中
                        }
                    case 4:
                        return {
                            className: 'fail',
                            value: this.$t('account.user_center_history_status_repeal') // 已撤销
                        }
                    case 5:
                        return {
                            className: 'fail',
                            value: this.$t('account.user_center_history_status_fail') // 失败
                        }
                    case 6:
                        return {
                            className: 'success',
                            value: this.$t('account.user_center_history_status_complete') // 已完成
                        }
                    default:
                        return {
                            className: null,
                            value: null
                        }
                }
            },
            copy() {
                utils.copyText(this.data.toAddress)
                Toast(this.$t('public0.public33')) // 复制成功
            },
        }
    }
</script>

<style scoped lang="less">
.cont{
    .top{
        border-bottom: 0.02rem solid #3b3b44;
        &>p{
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0.6rem auto;
            span{
                margin-left: 0.2rem;
                font-size: 0.32rem;
            }
            img{
                width: 0.8rem;
                height: 0.8rem;
            }
        }
    }
    label{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0.3rem 0;
        p{
            flex-shrink: 1;
            flex-grow: 1;
            text-align: right;
            white-space: pre-wrap;
            word-break: break-all;
        }
        span{
            color: #cccccc;
            padding-right: 0.2rem;
        }
        i{
            display: inline-block;
            padding: 0.1rem;
            font-style: normal;
            color: #00a0e9;
        }
    }
}
</style>
