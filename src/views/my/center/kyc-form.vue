<template>
<div>
    <div class="page">
        <top-back :backPage="'kyc'">{{$t('home.home16')}}</top-back>
        <iframe :src="url" class="iframe" allow="camera"></iframe>
    </div>
</div>
</template>

<script>
    import user from '../../../api/user'
    import {mapActions} from 'vuex'

    export default {
        name: "kyc-form",
        data(){
            return{
                url: null
            }
        },
        created() {
            this.url = this.$route.params.url
            this.listener()
            window.onJumioResult = data => {
                if (data.payload.value === 'success' || data.payload.value === 'error') {
                    let postData = {
                        idScanStatus: data.payload.value.toUpperCase(),
                        merchantIdScanReference: data.customerInternalReference,
                        jumioIdScanReference: data.transactionReference,
                        errorCode: data.payload.value === 'error' ? data.payload.metainfo.code : ""
                    }
                    user.updatekyc(postData,res=>{
                        user.userInfo(info=>{
                            this.setUserInfo(info)
                        })
                        Tip({type: 'success', message: res.msg})
                    },msg=>{
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    })
                }
            }
        },
        methods:{
            ...mapActions(['setUserInfo']),
            listener(){
                window.addEventListener("message", this.receiveMessage, false);
            },
            receiveMessage(event) {
                console.log(event)
                if (typeof event.data === "string") {
                    var data = JSON.parse(event.data);
                    if (data.transactionReference) {
                        //jumio kyc 事件监听
                        console.log('Netverify Web was loaded in an iframe.');
                        console.log('auth token:', data.authorizationToken);
                        console.log('transaction reference:', data.transactionReference);
                        console.log('customer internal reference:', data.customerInternalReference);
                        console.log('event type:', data.eventType);
                        console.log('date-time:', data.dateTime);
                        console.log('event value:', data.payload.value);
                        console.log('event metainfo:', data.payload.metainfo);
                        window.onJumioResult && window.onJumioResult(data);
                    }
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .page{
        background: #ffffff;
    }
    .iframe{
        width: 100vw;
        height: calc(100vh - 0.9rem);
        border: none;
    }
</style>
