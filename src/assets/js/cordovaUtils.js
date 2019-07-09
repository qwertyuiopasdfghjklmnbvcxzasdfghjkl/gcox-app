import { MessageBox, Toast } from 'mint-ui'
import Methods from '@/assets/js/methods'
import store from '@/store/'

let api = {}

// 保存图片
const saveImage = function (src, bool) {
  if (!window['cordova']) {
    let a = document.createElement('a')
    a.href = src
    a.download = `${Date.now()}.png`
    a.click()
    return
  }
    var canvas, context, imageDataUrl, imageData;
    var img = new Image();
    img.onload = function () {
      canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);
      try {
        imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
        imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
        console.log(imageData)
        cordova.exec(()=>{
          if (bool) {
            Tip({type: 'success', message: window.$i18n.t('public0.public223')}) // 保存成功
            return
          }
          Toast(window.$i18n.t('public0.public223')) // 保存成功
        }, (error)=>{
          if (bool) {
            Tip({type: 'danger', message: error})
            return
          }
          Toast(error) // 保存失败
          console.log(error)
        }, 'Canvas2ImagePlugin', 'saveImageDataToLibrary', [imageData])
      } catch (e) {
        Toast(e.message)
      }
    };
    img.src = src
}
api.saveImage = saveImage

 // 扫描二维码公共函数
const scanQRCode = function(success) {
    if (!window['cordova']) {
      // 浏览器中不支持二维码扫描
      Toast(window.$i18n.t('public0.public224'))
      return
    }
    var config = {
      preferFrontCamera : false, // iOS and Android 前置摄像头
      showFlipCameraButton : false, // iOS and Android 翻转摄像头按钮
      showTorchButton : false, // iOS and Android  灯光按钮
      torchOn: false, // Android, launch with the torch switched on (if available) 开启灯光
      saveHistory: false, // Android, save scan history (default false)
      prompt : window.$i18n.t('public0.public225'), // 扫描二维码
      resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
      formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
      orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device 横竖屏
      disableAnimations : true, // iOS
      disableSuccessBeep: false // iOS and Android
    }
    if (config.formats) {
        config.formats = config.formats.replace(/\s+/g, '');
    }
    config = [ config ]
    cordova.exec((res)=>{
      !res.cancelled && success && success(res.text)
    }, (error)=>{
      console.log(error)
    }, 'BarcodeScanner', 'scan', config)
}
api.scanQRCode = scanQRCode

//获取手机语言环境，app自动选择匹配语言
const getDeviceLang = function(){
  if(!window.localStorage.getItem('lang')){
    console.log('getDeviceLang')
    if(!window['cordova']){
      return
    }
    cordova.exec((res)=>{
      res = JSON.parse(res)
      console.log('Language=====',res)
      if(res.code=='0'){
        let lang =  res.msg
        if(lang.indexOf('zh')!=-1){
          lang = 'zh-CN'
        } else {
          lang = 'en'
        }
        store.actions.common.setLang(lang)
        window.$i18n.locale = lang
      }
    }, (error)=>{
      console.log(error)
    }, 'TinkeyApi', 'Language', [])
  }
}
api.getDeviceLang = getDeviceLang

document.addEventListener("deviceready", function () {
  window.deviceready = true //标识app壳启动完毕
  console.log('设备已就绪')
}, false);

export default api
