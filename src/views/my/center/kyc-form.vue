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
            listener(){},
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
