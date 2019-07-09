<template>
  <div class="page-main">
    <dapp-search class="mt20"></dapp-search>
    <banner class="mt20"></banner>
    <my-dapps class="mt15"></my-dapps>
    <hot-dapps class="mt20"></hot-dapps>
    <dapps-nav class="mt40"></dapps-nav>
  </div>
</template>

<script>
// @ is an alias to /src
import dappSearch from './index/search_bar'
import banner from './index/banner'
import myDapps from './index/my_dapps'
import hotDapps from './index/hot_dapps'
import dappsNav from './index/dapps_nav'

export default {
	components: {
	  dappSearch,
	  banner,
	  myDapps,
	  hotDapps,
	  dappsNav
	},
  name: 'find',
  
}
</script>

<style lang="less" scoped="">
.page-main {top: 0;}
</style>