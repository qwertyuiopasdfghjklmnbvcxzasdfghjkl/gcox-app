
 let domain = process.env.NODE_ENV === 'development' ? 'gcox-test.lab.ssss.so' : location.host.split(':')[0]

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
	<p>1. 优化kline<br>2. 优化交易市场显示</p>
	`,
	'en':`
	<p>1. Optimize kline<br>2. Optimize trading market display</p>
	`,
	'kr':`
	<p>1. 최적화된 kline<br> 2. 거래시장최적화결과</p>
	`
  }
}

export default config
