import { MessageBox, Toast } from 'mint-ui'
import utils from '@/assets/js/utils'
import Tip from '@/assets/js/tip'

let api = {}

// 保存图片
const saveImage = function (src, bool) {
  if (!window.cordova) {
    let a = document.createElement('a')
    a.href = src
    a.download = `${Date.now()}.png`
    a.click()
    return
  }
  if (utils.getPhonePlatform() === 'ios') {
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
    return
  }
  var data = {
    name: `${Date.now()}`,
    data: src
  }
  console.log('Image data=====',data)
  cordova.exec((res)=>{
    console.log('SavePhoto=====',res)
    res = JSON.parse(res)
    if(res.code=='0'){
      if (bool) {
        Tip({type: 'success', message: window.$i18n.t('public0.public223')}) // 保存成功
        return
      }
      Toast(window.$i18n.t('public0.public223')) // 保存成功
    }
  }, (error)=>{
    console.log(error)
  }, 'TinkeyApi', 'SavePhoto', [JSON.stringify(data)])
}
api.saveImage = saveImage

 // 扫描二维码公共函数
const scanQRCode = function(success) {
    if (!window.cordova) {
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
document.addEventListener('deviceready', function(){
  if (window.StatusBar) {
    var u = navigator.userAgent
    StatusBar.backgroundColorByHexString('#2a2a34');
    /*if(u.indexOf('Android') > -1 || u.indexOf('Adr') > -1){
      StatusBar.backgroundColorByHexString('#000000');
    } else {
      StatusBar.hide()
    }*/
  }

  // 关闭启动页
  if (window.navigator && window.navigator.splashscreen) {
    window.navigator.splashscreen.hide()
  }

  //ios启用指纹识别
  if(window['device'] && window['device']['platform']==='iOS' && Number(window['device']['version'].split('.')[0])>=7 && window['plugins'] && window['plugins']['touchid']){
    try{
      window.plugins.touchid.verifyFingerprint(
        'Scan your fingerprint please', // this will be shown in the native scanner popup
         function(msg) {
          Toast('Vertify success')
         }, // success handler: fingerprint accepted
         function(msg) {
          navigator.app.exitApp()
         } // error handler with errorcode and localised reason
      );
    } catch(e){}
  }

  // 检测更新
      if (window.chcp) {
        let chcp = window.chcp;
        // 检测更新
          chcp.fetchUpdate((error, data) => {
          // 表示没有更新版本，或者其他错误，详情的信息参考上面的chcp error链接
          if (error) {
            console.log('--fetchUpdate error--', error.code, error.description);
            return;
          }
          // 这次更新的版本信息
          console.log('--fetchUpdate--', data, data.config);
          // 检测是否是否可以进行安装了，双重判断吧，有时候会出现有更新版本但是暂时无法安装的情况（也可以去掉这一层）
          chcp.isUpdateAvailableForInstallation((error, data) => {
            if (error) {
              console.log('No update was loaded => nothing to install');
            } else {
              // 询问用户是否更新 检测到新版本，是否更新?
                MessageBox.confirm('New version detected. Is it updated?','Tip',{
                  confirmButtonText: 'Yes',
                  showCancelButton: false
                  // cancelButtonText: 'No'
                }).then(action => {
                  // 更新中
                  chcp.installUpdate((error) => {
                    if (error) {
                      // 更新失败
                      window.localStorage.setItem('appUpdated', 'false')
                      console.log('Failed to install the update with error code: ' + error.code);
                      console.log(error.description);
                    } else {
                      // 更新成功
                      window.localStorage.setItem('appUpdated', 'true')
                      console.log('Update installed!');
                    }
                  });
                }, () =>{})
              // 对比版本号
              console.log('Current content version: ' + data.currentVersion);
              console.log('Ready to be installed:' + data.readyToInstallVersion);
            }
          });
        });

      }
}, false);
  if (window.cordova && window.localStorage.getItem('appUpdated')) {
    // 更新成功 | 更新失败
    let msg = window.localStorage.getItem('appUpdated') === 'true' ? 'updateInfo' : 'public0.public281'
    window.localStorage.removeItem('appUpdated')
    setTimeout(() => {
      MessageBox.alert(window.$i18n.t(msg), window.$i18n.t('public0.updateLog'),{
        confirmButtonText:window.$i18n.t('public0.ok'),
        closeOnClickModal:false
      })
    }, 5000)
  }

export default api
