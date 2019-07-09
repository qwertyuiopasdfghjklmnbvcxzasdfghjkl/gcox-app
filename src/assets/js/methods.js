import numUtils from '@/assets/js/numberUtils'

export default {
	openURL(url){ //打开链接地址函数
      if(window['cordova'] && window['cordova']['InAppBrowser']){
        cordova.InAppBrowser.open(url, '_blank', 'location=yes')
      } else {
        window.open(url, '_blank')
      }
    },
	routeTo(args) { //自定义公共路由函数
		if (args.replace) {
			this.$router.replace({
				name: args.to,
				query: args.query,
				params: args.params
			})
		} else {
			this.$router.push({
				name: args.to,
				query: args.query,
				params: args.params
			})
		}
	},
	trim(str, len) { //去除空格并验证数据是否达到指定字符串长度
		var string = str.replace(/^\s+|\s+$/g, "");
		if (string != '')
			return (string.length >= len) ? true : false;
		else
			return false;
	},
	ismobile(str) { //检测手机号码的合法性
		if (str.length != 11) {
			return false;
		} else {
			var t = /^(13\d{9})|(14\d{9})|(15\d{9})|(17\d{9})|(18\d{9})|(0\d{10,11})$/;
			return t.test(str);
		}
	},
	isemail(str) { //验证是否为合法邮箱
		var regEmail = /^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
		return regEmail.test(str);
	},
	getPhonePlatform() { //获取前端系统环境
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		var type = ""
		if (isAndroid) {
			type = "android"
		}
		if (isiOS) {
			type = "ios"
		}
		if (type == "") {
			type = "h5"
		}
		return type;
	},
	toFixed(value, fixed) { //截取位数
		if (isNaN(Number(value))) {
			return value
		} else {
			return numUtils.BN(value || 0).toFixed(fixed === undefined ? 8 : fixed, 1)
		}
	},
	fitLen(num, length) { //固定显示长度不足补0
		num = '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000' + num
		return num.slice(num.length - length)
	},
	countDown(t, callbackFun) {
		var db = function(m) {
			return m < 10 ? '0' + m : m
		}

		function a() {
			t = Math.max(t - 1, 0)
			t <= 0 && clearInterval(interval)
			let m = db(Math.floor(t / 60))
			let s = db(Math.floor(t % 60))
			if (typeof callbackFun === 'function') {
				callbackFun(`${m}:${s}`)
			}
		}
		a()
		let interval = setInterval(a, 1000)
		return interval
	},
	humanTime(msec) { //时间格式人性化
		var days = parseInt(msec / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
		var hours = parseInt(msec / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
		var minutes = parseInt(msec / 1000 / 60 % 60, 10); //计算剩余的分钟
		var second = parseInt(msec / 1000 % 60, 10); //计算剩余的分钟
		var days_f = this.$root.fitLen(days, 1);
		var hours_f = this.$root.fitLen(hours, 2);
		var minutes_f = this.$root.fitLen(minutes, 2);
		var second_f = this.$root.fitLen(second, 2);
		var result = `${second_f}秒`;
		result = minutes > 0 ? `${minutes_f}分` + result : result;
		result = hours > 0 ? `${hours_f}小时` + result : result;
		result = days > 0 ? `${days_f}天` + result : result;
		return result
	},
	request(url, paras, defaultValue) { //获取url参数
		var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
		var paraObj = {}
		for (var i = 0, j; j = paraString[i]; i++) {
			paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
		}
		var returnValue = paraObj[paras.toLowerCase()];
		if (typeof(returnValue) == "undefined") {
			return defaultValue;
		} else {
			returnValue = returnValue.split('#')[0];
			return returnValue;
		}
	},
	isPassword (str) { // 是否密码正确 请输入6~16位数字+字母组合的密码
		var pwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
		return pwd.test(str)
	},
	isNumbers (str) { // 是否是整数
		var pInteger = /^\d+$/
		return pInteger.test(str)
	},
	bankCardValid (str) { // 银行卡账号验证
		var bkstr = /^[0-9\- ]+$/
		return bkstr.test(str);
	},
}
