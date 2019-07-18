<template>
<div class="page">
    <div class="search_box">
        <i>
            <img src="../../assets/img/search.png">
        </i>
        <label>
            <input :placeholder="$t('home.home38')" v-model="text"/>
        </label>
        <span v-tap="{methods:tobanck}">
            {{$t('home.home37')}}
        </span>
    </div>
    <div class="cont">
        <p>{{$t('home.home39')}}</p>
        <ul>
            <li>XRP/ETH</li>
            <li>XRP/ETH</li>
            <li>XRP/ETH</li>
        </ul>
    </div>
</div>
</template>

<script>
    export default {
        name: "seach",
        data(){
            return{
                text: null
            }
        },
        watch:{
            text(){
                this.searchList()
            }
        },
        methods:{
            tobanck(){
                this.$router.push({name: 'market'})
            },
            searchList(){
                console.log(this.text)
            }
        }
    }
</script>

<style scoped lang="less">
.search_box{
    display: flex;
    padding: 0 0.3rem;
    justify-content: space-between;
    align-items: center;
    background: #2A2A34;
    i{
        img{
            width: 0.37rem;
        }
    }
    label{
        flex-shrink: 0;
        flex-grow: 1;
        input{
            width: 100%;
            padding-left: .2rem;
            height: .9rem;
            border: none;
            background: none;
            outline: none;
            color: #ffffff;
            font-size: 0.3rem;
        }
    }
}
    .cont{
        padding: 0.3rem;
        font-size: 0.28rem;
        p{
            font-size: 0.28rem;
        }
        ul{
            margin-top: 0.2rem;
            li{
                line-height: 0.6rem;
            }
        }
    }
</style>
