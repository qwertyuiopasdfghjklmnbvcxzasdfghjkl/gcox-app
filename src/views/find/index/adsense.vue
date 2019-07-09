<template>
	<div class="adsense">
		<div v-for="dapp in adsense" v-tap="{methods:$root.routeTo, to:'dappDetail', params:{gameId:dapp.gameId}}">
			<img :src="dapp.recommendImage">
		</div>
	</div>
</template>

<script>
export default{
	props:['adsense']
}
</script>
<style lang="less" scoped="">
.adsense {
	display: flex;
	justify-content: space-between;
	div {
		width: 3.3rem;
		height: 1.6rem;
		border-radius: 0.1rem;
		overflow: hidden;
		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: center;
		}
	}
}
</style>