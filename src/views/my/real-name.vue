<template>
    <div class="page">
        <top-back>{{$t('home.home16')}}</top-back>
        <div class="state">
            <img :src="statePic[kycState]">
            <div class="state_text" v-if="kycState == 0">
                <h4>{{$t('home.home43')}}</h4>
                <p v-html="$t('home.home44')" v-tap="{methods: goVerif}"></p>
            </div>
        </div>
    </div>
</template>

<script>

    import {MessageBox} from 'mint-ui'
    import myApi from '@/api/individual'
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                kycState: null,
                statePic: [require('../../assets/img/noKyc@2x.png'),
                    require('../../assets/img/kycIng@2x.png'),
                    require('../../assets/img/nopass@2x.png'),
                    require('../../assets/img/pass@2x.png'),
                    ]
            }
        },
        computed: {

        },
        created(){
            this.kycState = this.getUserInfo().kycState
        },
        methods: {
            ...mapGetters(['getUserInfo']),
            goVerif(){}
        }
    }
</script>

<style scoped lang="less">
@import "./style";
.state{
    text-align: center;
    padding-top: 1.4rem;
    img{
        width: 4rem;
    }
}
    .state_text{
        padding-top: 0.2rem;
        font-size: 0.28rem;
        color: #A7ACB9;
        p{
            font-size: 0.24rem;
            margin-top: 0.4rem;
        }
    }

</style>
