<template>
    <div class="page">
        <top-back>
            {{$t('home.address')}}
        </top-back>
        <div class="page-main">
            <div class="list" v-if="list.length">
                <ul>
                    <li v-for="item in list" v-tap="{methods:()=>{show=true;data = item}}">
                        <i>
                            <img src="../../../../assets/img/address.png">
                        </i>
                        <label>
                            <p>{{item.memo}}</p>
                            <span>{{item.address}}</span>
                        </label>
                    </li>
                </ul>
            </div>
            <no-data v-if="!list.length"></no-data>
            <div class="btn">
                <mt-button type="primary" class="circle unlock" v-tap="{methods: addAddress}">
                    {{$t('home.add-address')}}
                </mt-button>
            </div>
        </div>
        <div :class="{'popup':show}">
            <div class="popup_cont" :class="{'show':show}">
                <label>
                    <p v-clipboard:copy="data.address" v-clipboard:success="onCopy" v-clipboard:error="onError">
                        {{$t('home.copy')}}</p>
                    <p v-tap="{methods: del}">{{$t('home.delete')}}</p>
                </label>
                <label>
                    <p v-tap="{methods:()=>{show=false}}">{{$t('home.home37')}}</p>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
    import wallet from '../../../../api/wallet'
    import NoData from "../../../../components/common/noData";
    import {mapGetters} from 'vuex'

    export default {
        components: {NoData},
        data() {
            return {
                symbol: null,
                list: [],
                show: false,
                data: {},
            }
        },
        created() {
            this.symbol = this.getSymbol()
            console.log(this.symbol)
            this.getAddressList()
        },
        methods: {
            ...mapGetters(['getSymbol']),
            getAddressList() {
                wallet.addressList({symbol: this.symbol}, res => {
                    console.log(res)
                    this.list = res
                })
            },
            onCopy() {
                Tip({type: 'success', message: this.$t('public0.public33')})
                this.show = false
            },
            onError() {
                Tip({type: 'danger', message: this.$t('home.copy-error')})
                this.show = false
            },
            del() {
                wallet.deleteAddress(this.data.withdrawId, res => {
                    Tip({type: 'success', message: res.msg})
                    this.getAddressList()
                    this.show = false
                }, msg => {
                    Tip({type: 'danger', message: this.$t(`error_code.${typeof msg === 'string' ? msg : msg[0]}`)})
                    this.show = false
                })
            },
            addAddress() {
                this.$router.push({name: 'add-address'})
            }
        }
    }
</script>

<style scoped lang="less">
    .main {

    }

    .list {
        margin: 0 -0.3rem;

        ul {
            background: #2A2A34;
            padding: 0 0.3rem;
            margin-top: 0.3rem;

            li {
                padding: 0.24rem 0;
                display: flex;

                i {
                    width: 0.54rem;
                    flex: 1;
                    flex-shrink: 0;

                    img {
                        width: 0.54rem;
                    }
                }

                label {
                    flex-shrink: 1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width: 6.1rem;

                    span {
                        font-size: 0.24rem;
                    }
                }
            }
        }
    }

    .btn {
        width: 100%;
        position: absolute;
        bottom: 1.56rem;
        display: block;
        margin: 0 -0.3rem;
        padding: 0.3rem;
    }

    .popup {
        position: fixed;
        height: 100vh;
        width: 100vw;
        background: rgba(37, 36, 42, 0.1);
    }

    .popup_cont {
        position: fixed;
        width: 100vw;
        bottom: -4rem;
        left: 0;
        text-align: center;
        z-index: 99;
        transition: 0.3s;
        padding: 0.48rem;

        label {
            display: block;
            border-radius: 0.2rem;
            background: #ffffff;
            margin-bottom: 0.2rem;

            p {
                height: 0.9rem;
                line-height: 0.9rem;
                border-bottom: 0.02rem solid #ECECEC;
                color: #191919;
                font-size: 0.3rem;

                &:last-child {
                    border-bottom: none;
                }
            }
        }
    }

    .show {
        bottom: 0 !important;
    }
</style>
