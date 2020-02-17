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
                        :class="{'is-loading': messageTopLoading}"
                        ref="loadmore"
                        :autoFill="false"
                        :topDistance="40"
                        :topMethod="loadTop"
                        :top-pull-text="$t('home.top-pull-text')"
                        :top-drop-text="$t('home.drop-text')"
                        :top-loading-text="$t('home.loading-text')"
                        :bottom-pull-text="$t('home.bottom-pull-text')"
                        :bottom-drop-text="$t('home.drop-text')"
                        :bottom-loading-text="$t('home.loading-text')"
                        @top-status-change="handleTopChange"
                        infinite-scroll-immediate-check="false"
                        infinite-scroll-distance="80"
                        infinite-scroll-disabled="messageBottomDisabled"
                        v-infinite-scroll="loadMore"
                >
                    <loading slot="top" :class="{'is-loading': messageTopDrop}"/>
                    <template v-if="messageList.length > 0">
                        <ul class="message-list" :class="{'is-loading': messageTopDrop}" ref="messageList">
                            <li class="message-item" :class="{markread: item.messageState === 1}" :key="index"
                                v-for="(item, index) in messageList" @click="markItemRead(item)">
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
                        <loading v-if="messageBottomLoading"/>
                        <noMoreData v-if="!messageBottomLoading && noMoreMessage"/>
                    </template>
                    <noData v-if="!messageTopLoading && messageList.length === 0"/>
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
                messageList: [], // 消息列表
                unReadLength: 0, // 未读消息长度
                messageTopDrop: false, // 下拉状态
                messageTopLoading: false, // 下拉加载状态
                messageBottomDisabled: false, // 滚动加载禁用状态
                messageBottomLoading: false, // 滚动加载状态
                noMoreMessage: false, // 是否没有更多消息
                responseState: { // 组件创建时所请求的接口的响应状态
                    item1: false,
                    item2: false
                }
            }
        },
        watch: {
            responseState: { // 数据请求完毕后关闭indicator
                handler(val) {
                    let i = 0
                    let j = 0
                    for (let x in val) {
                        i++
                        if (val[x]) {
                            j++
                        }
                    }
                    if (i === j) {
                        Indicator.close()
                    }
                },
                deep: true
            },
            'param.period'() {
                Indicator.open()
                this.param.page = 1
                this.messageList = []
                this.getMessageList(() => {
                    Indicator.close()
                }, () => {
                    Indicator.close()
                })
            },
            'param.page'(val) {
                if (val !== 1 && !this.noMoreMessage) {
                    this.messageBottomDisabled = true
                    this.messageBottomLoading = true
                    this.getMessageList(() => {
                        this.messageBottomLoading = false
                    }, () => {
                        this.messageBottomLoading = false
                    })
                }
            }
        },
        created() {
            Indicator.open()
            this.$nextTick(() => {
                this.getMessageList(() => {
                    this.responseState.item1 = true
                }, () => {
                    this.responseState.item1 = true
                })
                this.getUnReadLength()
            })
        },
        methods: {
            formatSystemMessage: utils.formatSystemMessage, // 对返回多个key的消息进行国际化处理
            getMessageList(successCallback, errorCallback, isLoadTop) { // 根据参数获取消息
                msgApi.getMessages(this.param, (res) => {
                    if (isLoadTop) { // 判断是否为下拉刷新方式加载数据，则替换旧数据
                        this.messageList = res.data
                    } else {
                        res.data.forEach((item) => {
                            this.messageList.push(item)
                        })
                    }
                    if (this.messageList.length >= res.total) { // 判断数据是否加载完毕，则禁用滚动加载事件
                        this.messageBottomDisabled = true
                        this.noMoreMessage = true
                    } else {
                        this.messageBottomDisabled = false
                        this.noMoreMessage = false
                    }
                    if (!this.noMoreMessage) { // 如果数据撑不满容器时，继续请求下一页数据
                        this.$nextTick(() => {
                            if (this.$refs.loadmore.$el.clientHeight > this.$refs.messageList.clientHeight) {
                                this.param.page++
                            }
                        })
                    }
                    successCallback && successCallback(res)
                }, (msg) => {
                    errorCallback && errorCallback(msg)
                    if (msg !== 'NOT_FIND_MESSAGE') {
                        console.error(msg)
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    }
                })
            },
            getUnReadLength() { // 参数为空时获取所有未读消息
                msgApi.getMessages({}, (res) => {
                    this.unReadLength = res.data.length
                    this.responseState.item2 = true
                }, (msg) => {
                    this.responseState.item2 = true
                    if (msg !== 'NOT_FIND_MESSAGE') {
                        console.error(msg)
                        Tip({type: 'danger', message: this.$t(`error_code.${msg}`)})
                    }
                })
            },
            markItemRead(item) { // 单条消息标记为已读
                if (item.messageState === 0) {
                    msgApi.markItemRead({
                        messageId: item.messageId
                    }, (msg) => {
                        item.messageState = 1
                        this.unReadLength--
                    })
                }
            },
            markAllRead() { // 全部消息标记为已读
                if (this.unReadLength) {
                    msgApi.markAllRead((msg) => {
                        this.messageList.forEach((item) => {
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
            handleTopChange(status) { // 获取组件的下拉状态 status: pull（组件被下拉但未达到阈值）、drop（组件被下拉且已达到阈值）、loading（组件被下拉达到阈值后释放）
                this.messageTopDrop = status !== 'pull'
                this.messageTopLoading = status === 'loading'
            },
            loadTop() { // 下拉获取最新消息
                this.param.page = 1
                this.getMessageList(() => {
                    setTimeout(()=>{
                        this.messageTopDrop = false
                        this.messageTopLoading = false
                        $('.mint-loadmore-content').css({'transform':'translate3d(0px, 0px, 0px)'})
                    },1000)
                }, () => {
                    setTimeout(()=>{
                        this.messageTopDrop = false
                        this.messageTopLoading = false
                        $('.mint-loadmore-content').css({'transform':'translate3d(0px, 0px, 0px)'})
                    },1000)
                }, true)
            },
            loadMore() { // 向下滚动获取更多消息
                this.param.page++
            }
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
        color: #9DAAAA;
    }

    .message-filtration a.disabled {
        color: #999;
    }

    .message-item {
        padding: .4rem;
        margin-top: .2rem;
        background-color: #fff;
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
        background-color: #4AC6C3;
        border-radius: 50%;
        position: absolute;
        top: 0.2rem;
        left: 0.2rem;
    }
    .message-item p{
        padding-bottom: 0.1rem;
        color: #9DAAAA;
    }

    .message-item p span {
        display: inline-block;
        width: 100%;
        min-height: .4rem;
        font-size: .3rem;
        line-height: .4rem;
        color: #222;
        white-space: normal;
        vertical-align: top;
    }

    .message-item p time {
        color: #9DAAAA;
    }

    .message-item.markread p i {
        background-color: #D9E6E6;
    }

    .message-item.markread p span {
        color: #9DAAAA;
    }

    .loadmore-wrapper{height: calc(100vh - 1.6rem); overflow-y: auto;}
    .loading:first-of-type{visibility: hidden;margin-top: -0.8rem;}
    .loading.is-loading:first-of-type{visibility: visible;}
    .no-more-data{margin-left: .3rem;margin-right: .3rem;}
</style>
