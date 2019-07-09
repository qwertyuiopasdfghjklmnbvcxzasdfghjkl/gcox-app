<template>
    <div class="page">
        <top-back>{{$t('user.realName')}}</top-back>
        <div class="page-main input_box">
            <form ref="form" >
                <label>
                    <span>{{$t('user.name')}}</span>
                    <input v-model="firstName" v-validate="'required'" maxlength="30" autocomplete="off" name="firstName" v-focus>
                    <i></i>
                </label>
                <label>
                    <span>{{$t('user.idCard')}}</span>
                    <input v-model="idNumber" v-validate="'required|IdCard'" maxlength="18" autocomplete="off" name="idNumber">
                    <i></i>
                </label>
                <p>{{$t('user.hint')}}</p>
                <submit-button :class="{disabled:locked}" v-tap="{methods:identity1}">{{$t('user.submit')}}</submit-button>
            </form>
        </div>
    </div>
</template>

<script>

    import {MessageBox} from 'mint-ui'
    import myApi from '@/api/individual'

    export default {
        data() {
            return {
                firstName: null,
                idNumber: null,
                locked: false,
                userState:{},
                status:true,
            }
        },
        computed: {
            msgs() {
                return {
                    firstName: {required: this.$t('public0.public88')},
                    idNumber: {
                        required: this.$t('public0.public89'),
                        IdCard: this.$t('public0.InvalidIDNumber'),
                    },
                }
            }
        },
        created(){
            this.fnUserState()
        },
        watch:{
            status(_new){
                if(!_new){
                    this.$router.replace({name:'ucenter'})
                }
            }
        },
        methods: {
            fnUserState() {
                // 获取当前用户状态信息
                myApi.getUserState((data) => {
                    this.userState = {
                        coinState: data.coinState,
                        googleState: data.googleState,
                        nickname: data.nickname,
                        verifyState: data.verifyState,
                        verifyTimes: data.verifyTimes
                    }
                    this.status = this.showVerifyState(0);
                }, (msg) => {
                    console.error(msg)
                })
            },
            showVerifyState(targetVerifyState) { // 实名验证状态
                if (this.userState.verifyTimes <= 3) {
                    if (this.userState.verifyTimes === 3) {
                        if (this.userState.verifyState === 0) {
                            return targetVerifyState === 3
                        } else {
                            return targetVerifyState === this.userState.verifyState
                        }
                    } else {
                        return targetVerifyState === this.userState.verifyState
                    }
                } else {
                    return targetVerifyState === 3
                }
            },
            identity1 () {
                let data = {firstName:this.firstName, idNumber:this.idNumber}
                this.$validator.validateAll(data).then((validResult) => {
                    if(!validResult){
                        let name = this.errors.items[0].field
                        Tip({type: 'error', message: this.msgs[name][this.errors.firstRule(name)]})
                        return
                    }
                    if (this.locked) {
                        return
                    }
                    this.locked = true
                    var formData = new FormData(this.$refs.form)
                    formData.append('countryClass', '1')
                    myApi.submitIdentityInfo(formData, (msg) => {
                        MessageBox({
                            title: this.$t('public0.public242'),
                            message: this.$t('public0.public160'), // 您已经提交了实名认证材料（每人仅有三次KYC机会），请耐心等待审核结果。审核结果将第一时间在站内消息中进行通知。
                            confirmButtonText: this.$t('public0.ok'),
                            closeOnClickModal: false
                        }).then(action => {
                            if (action === 'confirm') {
                                this.$router.push({name: 'ucenter'})
                            }
                        })
                    }, (msg) => {
                        this.locked = false
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    })
                })
            }
        }
    }
</script>

<style scoped lang="less">
@import "./style";
.page-main {padding-left: 0; padding-right: 0;}
.input_box {
    label {
        i {
            width: 0;
        }
    }

    p {
        margin-top: 0.2rem;
    }

    button {
        margin-top: 0.6rem;
    }
}

</style>
