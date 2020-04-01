<template>
    <div class="page">
        <top-back>{{$t('user.msg')}}</top-back>
        <div class="page-main">
            <div class="message-filtration clearfix">
                <!--<select v-model="param.period">-->
                <!--<option v-for="(item, index) in timeRangeList" :value="item.value" :key="index">{{$t(item.text)}}-->
                <!--</option>-->
                <!--</select>-->
                <!--<a href="javascript:;" :class="{disabled: unReadLength === 0}" @click="markAllRead">{{$t('message.all_read')}}-->
                <!--&lt;!&ndash;全部已读&ndash;&gt;</a>-->
            </div>
            <div class="loadmore-wrapper">
                <mt-loadmore
                        ref="loadmore"
                        :autoFill="false"
                        :bottom-all-loaded="allLoaded"
                        :top-pull-text="$t('home.top-pull-text')"
                        :top-drop-text="$t('home.drop-text')"
                        :top-loading-text="$t('home.loading-text')"
                        :bottom-pull-text="$t('home.bottom-pull-text')"
                        :bottom-drop-text="$t('home.drop-text')"
                        :bottom-loading-text="$t('home.loading-text')"
                        :top-method="loadTop"
                        :bottom-method="loadBottom"
                >
                    <template v-if="list.length > 0">
                        <ul class="message-list">
                            <li class="message-item" :class="{markread: item.messageState === 1}" :key="index"
                                v-for="(item, index) in list" @click="markItemRead(item)">
                                <p>
                                    <i></i>
                                    <span>{{formatSystemMessage(item.title, item.msgType !== 5)}}</span>
                                </p>
                                <p v-if="item.title==='VERIFY_NOT_PASS'">
                                    ({{$t('public0.reason')}}:{{formatSystemMessage(item.body, item.msgType !== 5)}})</p>
                                <p>
                                    <time>{{item.msgTime}}</time>
                                </p>
                            </li>
                        </ul>
                        <noMoreData v-if="noMoreData"/>
                    </template>
                    <noData v-if="!list.length"/>
                </mt-loadmore>
            </div>
        </div>
    </div>
</template>

<script>

    import Msg from '../components/msg'
    import {Indicator} from 'mint-ui'

    import utils from '@/assets/js/utils'
    import msgApi from '@/api/individual'
    import loading from '@/components/common/loading'
    import noData from '@/components/common/noData'
    import noMoreData from '@/components/common/noMoreData'

    export default {
        name: 'message',
        components: {
            Msg,
            loading,
            noData,
            noMoreData
        },
        data() {
            return {
                timeRangeList: [
                    {id: 1, value: '1h', text: 'message.last_1h', name: '最近一小时'},
                    {id: 2, value: '1d', text: 'message.last_1d', name: '最近一天'},
                    {id: 3, value: '1m', text: 'message.last_1m', name: '最近一个月'}
                ],
                param: {
                    // period: '1h',
                    show: 10,
                    page: 1
                },
                list: [], // 消息列表
                sport: null,
                noMoreData: false, // 是否没有更多消息
                allLoaded: false,
            }
        },
        watch: {

        },
        created() {
            this.getList()
        },
        methods: {
            formatSystemMessage: utils.formatSystemMessage, // 对返回多个key的消息进行国际化处理
            getList() { // 根据参数获取消息
                msgApi.getMessages(this.param, (res) => {
                    if (this.sport === 'bottom') { // 加载更多数据
                        this.allLoaded = false
                        res.data.forEach(res=>{
                            this.list.push(res)
                        })
                        console.log(this.list)
                        this.$refs.loadmore.onBottomLoaded();
                    } else if (this.sport === 'top') { // 下拉刷新
                        this.list = res.data
                        this.noMoreData = false
                        this.allLoaded = false
                        this.$refs.loadmore.onTopLoaded();
                    } else {
                        this.list = res.data
                    }
                    if (this.list.length >= res.total) { // 没有更多数据
                        this.noMoreData = Boolean(res.total)
                        this.allLoaded = true
                    }
                }, (msg) => {
                    if (msg !== 'NOT_FIND_MESSAGE') {
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    }
                })
            },
            loadTop() { // 刷新
                this.sport = 'top';
                this.param.page = 1;
                this.getList()
            },
            loadBottom() { // 获取下一页
                this.sport = 'bottom'
                this.param.page++;
                this.getList()
                this.allLoaded = true
            },

            markItemRead(item) { // 单条消息标记为已读
                if (item.messageState === 0) {
                    msgApi.markItemRead({
                        messageId: item.messageId
                    }, (msg) => {
                        item.messageState = 1
                    })
                }
            },
            markAllRead() { // 全部消息标记为已读
                if (this.unReadLength) {
                    msgApi.markAllRead((msg) => {
                        this.list.forEach((item) => {
                            item.messageState = 1
                        })
                        this.unReadLength = 0
                        Tip({type: 'success', message: this.$t(`error_code.${msg}`)})
                    }, (msg) => {
                        console.error(msg)
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    })
                }
            },

        }
    }
</script>

<style scoped lang="less">

    .loading:first-of-type {
        visibility: hidden;
        margin-top: -0.8rem;
    }

    .message-filtration select {
        float: left;
        height: .6rem;
        border: none;
        background: none;
    }

    .message-filtration a {
        float: right;
        height: .6rem;
        font-size: .28rem;
        line-height: .6rem;
        color: #4C5A74;
    }

    .message-filtration a.disabled {
        color: #999;
    }

    .message-item {
        padding: .4rem;
        margin-top: .2rem;
        background-color: #151C2C;
        border-radius: 0.1rem;
        position: relative;
    }

    .message-list.is-loading .message-item:first-of-type {
        margin-top: 0;
    }

    .message-item p:first-of-type {
        font-size: 0;
        line-height: 0;
        white-space: nowrap;
    }

    .message-item p:last-of-type {
        height: .4rem;
        line-height: .4rem;
        text-align: right;
        padding-bottom: 0;
    }

    .message-item p i {
        display: inline-block;
        width: .1rem;
        height: .1rem;
        background-color: #3B48C8;
        border-radius: 50%;
        position: absolute;
        top: 0.2rem;
        left: 0.2rem;
    }
    .message-item p{
        padding-bottom: 0.1rem;
        color: #ffffff;
    }

    .message-item p span {
        display: inline-block;
        width: 100%;
        min-height: .4rem;
        font-size: .3rem;
        line-height: .4rem;
        color: #ffffff;
        white-space: normal;
        vertical-align: top;
    }

    .message-item p time {
        color: #4C5A74;
    }

    .message-item.markread p i {
        background-color: #D9E6E6;
    }

    .message-item.markread p span {
        color: #999;
    }

    .loadmore-wrapper{height: calc(100vh - 1.6rem); overflow-y: auto;}
    .loading:first-of-type{visibility: hidden;margin-top: -0.8rem;}
    .loading.is-loading:first-of-type{visibility: visible;}
    .no-more-data{margin-left: .3rem;margin-right: .3rem;}
</style>
