// let domain = process.env.NODE_ENV === 'development' ? 'gcox.dev.koall.io' : location.host.split(':')[0]
let domain = process.env.NODE_ENV === 'development' ? 'sit.gcox.cc' : location.host.split(':')[0]
if (process.env.VUE_APP_BASEURL) {
  domain = process.env.VUE_APP_BASEURL
}
const https = process.env.HTTPS === true
const protocol = window.location.protocol === 'https:' || https ? 'wss://': 'ws://'
const http = window.location.protocol === 'https:' || https ? 'https://' : 'http://'
const config = {
  domain: domain,
  imageType: /\.(jpg|png|jpeg|bmp)/i,
  http: http,
  url: `${http}${domain}`,
  protocol: protocol,
  brand: 'PeaX',
  version:'1.0.0'
}

export default config
