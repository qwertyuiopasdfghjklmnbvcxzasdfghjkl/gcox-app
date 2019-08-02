<template>
    <div class="page">
        <top-back>
            {{$t('home.home50')}}
        </top-back>
        <div class="page-main">
            <div class="search">
                <p>
                    <input :placeholder="$t('home.home38')" v-model="search">
                </p>
            </div>
            <div class="cont_list">
                <ul>
                    <li v-for="data in filterSymboltList" v-tap="{methods:toaddress,symbol:data.accountName}">
                        <p>{{data.accountName}}</p>
                        <label>
                            <!--<p>{{data.totalBalance | number}}</p>-->
                            <span><img src="../../../../assets/img/i_rig_c@3x.png"/></span>
                        </label>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        data() {
            return {
                filterTitle: '',
                search: ''
            }
        },
        computed:{
            ...mapGetters(['getUserInfo', 'getUserWallets']),
            symbolList() { // 获取币种列表
                return this.getUserWallets.sort((item1, item2) => {
                    if (item1.symbol === item2.symbol) {
                        return 0
                    } else {
                        return item1.symbol < item2.symbol ? -1 : 1
                    }
                })
            },
            filterSymboltList() {
                if (this.symbolList.length) {
                    return this.symbolList.filter(item => {
                        if(item.symbol.toLowerCase().indexOf(this.search.toLowerCase()) !== -1){
                            return item.symbol.toLowerCase().includes(this.filterTitle.toLowerCase())
                        }
                    })
                } else {
                    return []
                }
            },
        },
        created() {
            console.log(this.filterSymboltList)
        },
        methods: {
            ...mapActions(['setSymbol']),
            toaddress(name){
                this.$router.push({name:'page-topup', params:{}})
                this.setSymbol(name.symbol)
            }
        }
    }
</script>

<style scoped lang="less">
    .cont_list {
        background: #272731;
        margin: 0.2rem -0.3rem;
        padding: 0 0.3rem;

        ul {
            li {
                height: 0.88rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 0.02rem solid #43434E;

                &:last-child {
                    border-bottom: none;
                }

                label {
                    display: inline-flex;
                    flex-wrap: nowrap;
                    align-items: center;

                    p {
                        padding-right: 0.24rem;
                    }

                    img {
                        width: 0.18rem;
                        height: 0.33rem;
                        vertical-align: middle;
                    }
                }
            }
        }
    }
    .search{
        margin: 0.3rem 0;
        border-bottom: 0.02rem solid #2A2A34;
        p{
            input{
                height: 0.36rem;
                margin-bottom: 0.21rem;
                width: 100%;
                background: transparent;
                border: none;
                padding-left: 0.85rem;
                background: url("../../../../assets/img/search.png") no-repeat 0.2rem 0;
                background-size: 0.36rem;
                color: #ffffff;
                font-size: 0.28rem;
            }
        }
    }
</style>
