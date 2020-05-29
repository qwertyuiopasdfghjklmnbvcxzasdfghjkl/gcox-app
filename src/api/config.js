
 // let domain = process.env.NODE_ENV === 'development' ? 'gcox-test.lab.ssss.so' : location.host.split(':')[0]
 let domain = process.env.NODE_ENV === 'development' ? 'gcox.com' : location.host.split(':')[0]

if (process.env.VUE_APP_BASEURL) {
  domain = process.env.VUE_APP_BASEURL
}
let https = window.location.protocol === 'https:'?true:false
if (process.env.VUE_APP_HTTPS==='true') {
  https = true
}
const protocol = window.location.protocol === 'https:' || https ? 'wss://': 'ws://'
const http = window.location.protocol === 'https:' || https ? 'https://' : 'http://'
const config = {
  domain: domain,
  imageType: /\.(jpg|png|jpeg|bmp)/i,
  http: http,
  url: `${http}${domain}`,
  protocol: protocol,
  brand: 'GCOX',
  version:'1.1.1',
  updateInfo:{  //更新日志
  	'zh-CN':`
	<p>1. 优化交易页面深度显示<br>2. 优化提现记录详情时间显示</p>
	`,
	'en':`
	<p>1. Optimize transaction page depth display<br>2. Optimize the time display of withdrawal record details</p>
	`,
	'kr':`
	<p>1. 거래 페이지 깊이 표시 최적화<br> 2. 현금 인출 기록 상세 시간 표시 최적화</p>
	`
  }
}

export default config
