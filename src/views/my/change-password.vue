<template>
    <div class="page">
        <top-back>{{$t('user.changePassword')}}</top-back>
        <div class="page-main input_box">
            <label v-for="(item,index) in datas">
                <!--<span>{{item.cont}}</span>-->
                <input :type="item.type" @input="oninput(index)" :placeholder="item.cont">
                <i @click="show(index)">
                    <img :src="item.src === 1 ? require('@/assets/img/eye_closed@3x.png'): require('@/assets/img/eye_open@2x.png')">
                </i>
            </label>
            <p>{{$t('user.infoPW')}}</p>
            <submit-button v-tap="{methods: changePwd}" :class="{disabled:locked||gtLocked}">{{$t('user.submit')}}
            </submit-button>
        </div>
    </div>
</template>

<script>
    
    
    import utils from '@/assets/js/utils'
    import userApi from '@/api/user'

    export default {
        data() {
            return {
                formData: {
                    passwordOld: '',
                    password: '',
                    passwordConfirm: ''
                },
                locked: false,
                gtLocked: false,
                datas: [
                    {
                        type: "password",
                        cont: this.$t('user.PW'),
                        src: 1,
                        key: 'passwordOld'
                    }, {
                        type: "password",
                        cont: this.$t('user.newPW'),
                        src: 1,
                        key: 'password'
                    }, {
                        type: "password",
                        cont: this.$t('user.confirmPW'),
                        src: 1,
                        key: 'passwordConfirm'
                    }
                ]
            }
        },
        methods: {
            show(i) {
                this.datas[i].type = this.datas[i].type === 'password' ? 'text' : 'password';
                this.datas[i].src = this.datas[i].src === 1 ? 2 : 1;
                console.log(this)
            },
            oninput(i) {
                let e = event;
                this.formData[this.datas[i].key] = e.target.value;
            },
            changePwd() {
                if (!this.$root.trim(this.formData.passwordOld, 1)) {
                    Tip({type: 'danger', message: this.$t('account.user_center_Please_old_password')})
                    $('.editpwd-form input[name=passwordOld]').focus()
                    return
                } else if (!this.$root.isPassword(this.formData.password)) {
                    Tip({type: 'danger', message: this.$t('public0.public123')})
                    $('.editpwd-form input[name=password]').focus()
                    return
                } else if (!(this.formData.passwordConfirm === this.formData.password)) {
                    Tip({type: 'danger', message: this.$t('public0.public124')})
                    $('.editpwd-form input[name=passwordConfirm]').focus()
                    return
                } else {
                    if (this.locked) {
                        return
                    }
                    this.gtLocked = true
                    utils.gtValidate((gtParams) => {
                        this.locked = true
                        let formData = {}
                        for (let i in this.formData) {
                            formData[i] = this.formData[i]
                        }
                        for (let i in gtParams) {
                            formData[i] = gtParams[i]
                        }
                        userApi.getRsaPublicKey((rsaPublicKey) => {
                            formData.passwordOld = utils.encryptPwd(rsaPublicKey, formData.passwordOld)
                            formData.password = utils.encryptPwd(rsaPublicKey, formData.password)
                            formData.passwordConfirm = utils.encryptPwd(rsaPublicKey, formData.passwordConfirm)
                            formData.rsaPublicKey = rsaPublicKey
                            userApi.changePwd(formData, (msg) => {
                                this.locked = false
                                Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                                this.$router.push({name: 'page-ucenter'})
                            }, (msg) => {
                                this.locked = false
                                Tip({
                                    type: 'danger',
                                    message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)
                                })
                            })
                        }, () => {
                            this.locked = false
                        })
                    }, () => {
                        this.gtLocked = false
                    })
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @import "./style";
    .disabled{
        background: #b6bec3 !important;
    }

</style>
