<template>
    <section class="entrust">
        <div class="content">
            <mt-loadmore
                    :top-method="loadTop"
                    :bottom-method="loadBottom"
                    :bottom-all-loaded="allLoaded"
                    :top-pull-text="$t('home.top-pull-text')"
                    :top-drop-text="$t('home.drop-text')"
                    :top-loading-text="$t('home.loading-text')"
                    :bottom-pull-text="$t('home.bottom-pull-text')"
                    :bottom-drop-text="$t('home.drop-text')"
                    :bottom-loading-text="$t('home.loading-text')"
                    :autoFill="false"
                    ref="loadmore">
                <ul class="trust-list" v-if="cdatas">
                    <li v-for="(item, index) in cdatas" :key="index">
                        <column :data="item" :index="index" :form="'history'"></column>
                    </li>
                </ul>
                <no-more-data v-if="noMoreData"></no-more-data>
            </mt-loadmore>
            <no-data v-if="!cdatas.length" :text="text"></no-data>
        </div>
    </section>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import market from '@/api/market'
    import cpSwitch from '@/components/switch'
    import NoData from "../../../components/common/noData";
    import Column from "../now-deal/column";
    import NoMoreData from "../../../components/common/noMoreData";

    export default {
        props: {
            fixedNumber: {
                type: Number,
                default: 8
            },
            baseSymbol: {
                type: String,
                default: ''
            },
            currentSymbol: {
                type: String,
                default: ''
            },
            symbol: {
                type: String,
                default: ''
            },
            mul: {
                type: Function
            },
        },
        components: {
            NoMoreData,
            Column,
            NoData,
            cpSwitch
        },
        data() {
            return {
                cdatas: [],
                hideOtherTrust: false,
                noMoreData: false,
                allLoaded: false,
                data: [],
                form: {
                    current: 1,
                    hideCancelled: 0,
                    history: "1",
                    limit: 10,
                    tp: 0
                }
            }
        },
        computed: {
            ...mapGetters(['getApiToken']),
            text(){
                return this.getApiToken ? '': this.$t('public0.not_logged')
            }
        },
        watch: {
            hideOtherTrust(e) {
                if (e) {
                    this.cdatas = []
                    this.data.map(res => {
                        if (res.market === this.symbol) {
                            this.cdatas.push(res)
                        }
                    })
                } else {
                    console.log(this.data)
                    this.cdatas = this.data
                }
            }
        },
        created() {
            this.getList()
        },
        methods: {
            ...mapActions(['setEntrustPrices', 'addEvents', 'removeEvents', 'tiggerEvents']),
            getList() {
                if(!this.getApiToken){
                    this.cdatas = []
                    return
                }
                market.getCurrentEntrustByParams(this.form, res => {
                    if (this.sport === 'bottom') { // 加载更多数据
                        this.allLoaded = false
                        res.data.filter(d => {
                            this.cdatas.push(d)
                        })
                        this.$refs.loadmore.onBottomLoaded();

                    } else if (this.sport === 'top') { // 下拉刷新
                        this.cdatas = res.data
                        this.noMoreData = false
                        this.allLoaded = false
                        this.$refs.loadmore.onTopLoaded();
                    } else {
                        this.cdatas = res.data
                    }
                    if (this.cdatas.length >= res.total) { // 没有更多数据
                        this.noMoreData = Boolean(res.total)
                        this.allLoaded = true
                    }
                }, msg => {
                    Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                })
            },
            loadTop() { // 刷新
                this.sport = 'top';
                this.form.current = 1;
                this.getList()
            },
            loadBottom() { // 获取下一页
                this.sport = 'bottom'
                this.form.current++;
                this.getList()
                this.allLoaded = true
            }
        }
    }
</script>

<style lang="less" scoped>
    @c_gray: #F4F5FA;
    @c_buy: #24C898;
    @c_sell: #F65B69;
    @c_light: #91A4A3;
    @c_board: #B9D0CF;
    @c_btn: #1C9CE3;

    .entrust {
        .content{
            /*height: calc(100vh - 0.9rem);*/
        }
    }
    .trust-list {
        margin-bottom: 0.2rem;
        li {

            .title {
                position: relative;

                .buy {
                    color: @c_buy;
                }

                .sell {
                    color: @c_sell;
                }

                .time {
                    color: @c_board;
                    font-size: 0.24rem;
                    transform: scale(0.916);
                    margin-left: 0.1rem;
                }

                .cancel {
                    position: absolute;
                    right: 0;
                    font-size: 0.26rem;
                    color: #247BDE;
                    background-color: @c_gray;
                    padding: 0.06rem 0.12rem;
                    border-radius: 3px;
                }
            }

            .data {
                margin-top: 0.2rem;

                .data-title {
                    display: flex;

                    span {
                        flex: 1;
                        min-width: 0;
                        color: @c_board;
                        font-size: 0.24rem;

                        &:last-of-type {
                            text-align: right;
                        }
                    }
                }

                .data-info {
                    margin-top: 0.2rem;
                    font-size: 0.3rem;
                    display: flex;

                    span {
                        flex: 1;
                        min-width: 0;

                        &:last-of-type {
                            text-align: right;
                        }

                        em {
                            color: @c_board;
                            font-size: 0.24rem;
                            transform: scale(0.916);
                            font-style: normal;
                        }
                    }
                }
            }
        }
    }

</style>
