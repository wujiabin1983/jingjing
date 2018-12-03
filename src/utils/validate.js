/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
	const valid_map = ['admin', 'editor', 'admin01', 'seller01', 'employee01']
	return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
	const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
	return urlregex.test(textval)
}

/* 密码*/
export function validatePassword(textval) {
	const urlpassword = /^[0-9a-zA-Z]+$/
	if(urlpassword.test(textval)) {
		if(textval.length > 5) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}
/* 小写字母*/
export function validateLowerCase(str) {
	const reg = /^[a-z]+$/
	return reg.test(str)
}
/* 大写字母*/
export function validateUpperCase(str) {
	const reg = /^[A-Z]+$/
	return reg.test(str)
}
/* 身份证号*/
export function validateIdCard(str) {
	const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
	return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
	const reg = /^[A-Za-z]+$/
	return reg.test(str)
}

/* 正整数 + 0*/
export function validateInt(str) {
	const reg = /^[0-9]+\.?[0-9]*$/
	if (str == '') {
		return true
	} else {
		return reg.test(str)
	}
}

// 最多精确到小数点后4位
export function validateFloat(str) {
	const reg = /^\d+(\.\d{1,4})?$/
	return reg.test(str)
}

// 验证手机号码
export function validateMobile(str) {
	const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
	return reg.test(str);
}
// 验证电话号码
export function validateTel(str) {
	const reg = /(^(\d{3,4}-)?\d{7,8})$/;
	return reg.test(str);
}

// 验证手机号码(可为空)
export function validateMobileEmpty(str) {
	const reg = /^$|^1[3|4|5|7|8|9][0-9]\d{8}$/;
	return reg.test(str);
}
//
//// 验证固定电话
//export function validateTel(str) {
//	const reg = /^\d{7,8}$/;
//	return reg.test(str);
//}

// 验证邮箱
export function validateEmail(str) {
	const reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
	return reg.test(str);
}

// 验证字数限制为4个汉字或者8个字符；汉字算2个字符，字母、数字算1个字符
export function validateGetLength(str) {
	let len = 0;
	for(let i = 0; i < str.length; i++) {
		let c = str.substr(i, 1);
		let ts = escape(c);
		if(ts.substring(0, 2) == "%u") {
			len += 2;
		} else {
			len += 1;
		}
	}
	return len > 8
}

// 验证字数限制为15个汉字或者30个字符；汉字算2个字符，字母、数字算1个字符
export function validateGetLength2(str) {
//	console.log(str, 'strstrstr')
	let len = 0;
	for(let i = 0; i < str.length; i++) {
		let c = str.substr(i, 1);
		let ts = escape(c);
		if(ts.substring(0, 2) == "%u") {
			len += 2;
		} else {
			len += 1;
		}
	}
	return len > 30
}

// 验证json对象必填
export function validateJsonObj(str) {
	return(JSON.stringify(str) === '{}')
}
// 验证json数组必填
export function validateJsonArray(str) {
	return(str.length > 0)
}

// 验证IP地址
export function isValidIP(ip) {
	let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
	return reg.test(ip);
} 