// 验证手机号
export const validateTel = (value) => {
  return (/^[1][3-9]\d{9}$/.test(value))
}
// 验证邮箱
export const validateEmail = (value) => {
  return (/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(value))
}
// 验证密码 正则匹配用户密码8-32位数字和字母的组合
export const validatePassword = (value) => {
  return (/^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,32}/.test(value))
}

//固定电话
export const validateFixedTel = (value) => {
  return (/([0-9]{3,4}-)?[0-9]{7,8}/).test(value)
}

//身份证号码
export const validateIdCard = (value) => {
  return (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(value)
}

//中文姓名2-6字
export const validateChineseName = (value) => {
  return (/^[\u4E00-\u9FA5]{2,6}$/).test(value)
}
//邮政编码
export const validatePostalCode = (value) => {
  return (/^[a-zA-Z0-9 ]{3,12}$/).test(value)
}
//验证网址
export const validateWebsite = (value) => {
  return (/^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/).test(value)
}
//验证QQ
export const validateQQ = (value) => {
  return (/^[0-9][0-9]{4,}$/).test(value)
}
//正整数
export const validatePositiveInt = (value) => {
  return (/^[1-9]\d*$/).test(value)
}

//负数
export const validateNegative = (value) => {
  return (/^(\-{1})\d+(\.\d+)?$/).test(value) //  /^(\-?)\d+$/
}
//精确到两位小数
export const validateTwoDecimal = (value) => {
  return (/^(\-|\d+)\.\d{2}$/).test(value)
}

//是否是小数
export const checkDecimal = (value) => {
  if (!isNaN(value)) {
    var reg = /^[0-9]{1}\.\d+$/;
    return reg.test(value);
  }
  return false;
}

//是否是整数
export const checkInteger = (value) => {
  //是整数，则返回true，否则返回false
  return typeof value === 'number' && value % 1 === 0;
}

//限制input只能输入有效的数字，有且只有一个小数点，第一个不能为小数点
export const clearNoNum = (value) => {
  //清除“数字”和“.”以外的字符    
  value = value.replace(/[^\d.]/g, "");
  //只保留第一个. 清除多余的  
  value = value.replace(/\.{2,}/g, ".");
  value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  //只能输入两个小数
  value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');

  //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
  if (value.indexOf(".") < 0 && value != "") {
    value = parseFloat(value);
  }
  return value;
}

export const checkStrng = (substring) => {
  if (substring) {
    var reg = new RegExp("[~#^$@%&!?%*]", 'g');
    if (substring.match(reg)) {
      return true;
    }
    for (var i = 0; i < substring.length; i++) {
      var hs = substring.charCodeAt(i);
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            return true;
          }
        }
      } else if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        if (ls == 0x20e3) {
          return true;
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          return true;
        } else if (0x2B05 <= hs && hs <= 0x2b07) {
          return true;
        } else if (0x2934 <= hs && hs <= 0x2935) {
          return true;
        } else if (0x3297 <= hs && hs <= 0x3299) {
          return true;
        } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
          || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
          || hs == 0x2b50) {
          return true;
        }
      }
    }
  }
}