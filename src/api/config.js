
 // let domain = process.env.NODE_ENV === 'development' ? 'gcox-test.lab.ssss.so' : location.host.split(':')[0]
 let domain = process.env.NODE_ENV === 'development' ? 'gcox.com' : location.host.split(':')[0]

const protocol = location.protocol
if (protocol == 'file:' && process.env.VUE_APP_BASEURL) {
  domain = process.env.VUE_APP_BASEURL
}
let isHttps = protocol == 'https:'?true:false
if (protocol == 'file:' && process.env.VUE_APP_HTTPS=='true') {
  isHttps = true
}
let isDev = process.env.NODE_ENV == 'development'
const wshttp = isHttps ? 'wss://': 'ws://'
const http = isHttps ? 'https://' : 'http://'
const config = {
  domain: domain,
  imageType: /\.(jpg|png|jpeg|bmp)/i,
  http: http,
  url: `${http}${domain}`,
  protocol: wshttp,
  brand: 'GCOX',
  version:'1.1.1',
  updateInfo:{  //更新日志
  	'zh-CN':`
	<p>1. 优化用户中心钱包资产显示</p>
	`,
	'en':`
	<p>1. Optimize the display of wallet assets in user center</p>
	`,
	'kr':`
	<p>1. 사용자 센터 지갑 자산 표시 최적화</p>
	`
  }
}

export default config
