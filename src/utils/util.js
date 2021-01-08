//工具函数
export const isPlainObject = obj => {
  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    return true;
  }
  return false;
};

export function deep(obj) {
  //判断拷贝的要进行深拷贝的是数组还是对象，是数组的话进行数组拷贝，对象的话进行对象拷贝
  var objClone = Array.isArray(obj) ? [] : {};
  //进行深拷贝的不能为空，并且是对象或者是
  if (obj && typeof obj === "object") {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] && typeof obj[key] === "object") {
          objClone[key] = deep(obj[key]);
        } else {
          objClone[key] = obj[key];
        }
      }
    }
  }
  return objClone;
}

/* 过滤文件格式 (缩略图显示) */
export const filterFileFormatType = fileName => {
  let themeCode = "";
  const type = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
  switch (type) {
    case ".3dm":
      themeCode = "&#xe6e0;";
      break;
    case ".iges":
      themeCode = "&#xe65e;";
      break;
    case ".obj":
      themeCode = "&#xe660;";
      break;
    case ".ma":
      themeCode = "&#xe668;";
      break;
    case ".mb":
      themeCode = "&#xe650;";
      break;
    case ".skp":
      themeCode = "&#xe65a;";
      break;
    case ".dwg":
      themeCode = "&#xe64d;";
      break;
    case ".psd":
      themeCode = "&#xe666;";
      break;
    case ".pdf":
      themeCode = "&#xe652;";
      break;
    case ".doc":
      themeCode = "&#xe64c;";
      break;
    case ".xls":
      themeCode = "&#xe667;";
      break;
    case ".ppt":
      themeCode = "&#xe659;";
      break;
    case ".docx":
      themeCode = "&#xe64c;";
      break;
    case ".xlsx":
      themeCode = "&#xe665;";
      break;
    case ".pptx":
      themeCode = "&#xe651;";
      break;
    case ".key":
      themeCode = "&#xe64f;";
      break;
    case ".jpg":
      themeCode = "&#xe657;";
      break;
    case ".jpeg":
      themeCode = "&#xe65f;";
      break;
    case ".png":
      themeCode = "&#xe69a;";
      break;
    case ".gif":
      themeCode = "&#xe65b;";
      break;
    case ".mp4":
      themeCode = "&#xe6e1;";
      break;
    case ".mp3":
      themeCode = "&#xe6e2;";
      break;
    case ".txt":
      themeCode = "&#xe658;";
      break;
    case ".rar":
      themeCode = "&#xe6e4;";
      break;
    case ".zip":
      themeCode = "&#xe6e5;";
      break;
    case ".7z":
      themeCode = "&#xe6e6;";
      break;
    case ".gz":
      themeCode = "&#xe6e7;";
      break;
    default:
      themeCode = "&#xe669;"; // 未识别类型显示
      break;
  }
  return themeCode;
};

// 权限过滤方法
export const filterListAuth = (data = [], userid) => {
  let arr = [];
  // 确定权限
  let hasAuthority = data => {
    if (!data || !data.length) {
      return true;
    }
    if (data.indexOf(userid) !== -1) {
      return true;
    }
    return false;
  };
  data.forEach(item => {
    // 动态通知检查
    if (item.type === "custom" && item.content) {
      let content =
        typeof item.content === "string"
          ? JSON.parse(item.content)
          : item.content;
      // 动态通知存在权限管控
      if (content.method === "newActivity") {
        let t = content.data.t;
        // 检查权限
        hasAuthority(t) && arr.push(item);
      } else {
        arr.push(item);
      }
    } else arr.push(item); // 普通消息不存在权限管控
  });

  return arr;
};

export const transformTime = (val, format = "HH:mm") => {
  // let type = typeof val;
  let addZero = num => {
    return num < 10 ? "0" + num : num;
  };
  if (val) {
    let date = new Date(+val);
    let year = date.getFullYear();
    let mon = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minu = date.getMinutes();
    let sec = date.getSeconds();

    let obj = {
      yyyy: year,
      MM: addZero(mon),
      dd: addZero(day),
      HH: addZero(hour),
      mm: addZero(minu),
      ss: addZero(sec)
    };
    let keys = Object.keys(obj);
    let text = format;
    keys.forEach(item => {
      text = text.replace(item, obj[item]);
    });
    return text;
  }
};

/**
 * 时间冒泡排序
 * 想要根据传入的字段进行排序
 * @param {Array} theTimeArr 当前需要排序的时间数组
 * @param {prop} 当前需要用来比较的字段
 * @returns {Array} 返回了一个从小->大的时间数组
 */
// 时间冒泡排序
export const timeSort = (theTimeArr, prop) => {
  if (!theTimeArr) return [];
  if (!prop) return theTimeArr;
  let maxLen = theTimeArr.length;
  for (let i = 0; i < maxLen; i++) {
    for (let j = 0; j < maxLen - i - 1; j++) {
      // 如果说不存在这个元素
      if (!theTimeArr[j][prop]) theTimeArr[j][prop] = "";
      if (!theTimeArr[j + 1][prop]) theTimeArr[j + 1][prop] = "";
      if (theTimeArr[j][prop] > theTimeArr[j + 1][prop]) {
        // 如果说前面的时间比后面的大, 那么把大的时间放在后面

        let tmplObj = theTimeArr[j];

        theTimeArr[j] = theTimeArr[j + 1];

        theTimeArr[j + 1] = tmplObj;
      } else {
        // 如果说前面的时间比后面的小, 保持不变
        let tmplObj = theTimeArr[j];
        theTimeArr[j] = tmplObj;
      }
    }
  }
  return theTimeArr;
};

/**
 * 去除空数组
 * @param {Array} arr 需要去除的数组
 */
export const removeEmptyArrayEle = arr => {
  if (!arr) return [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == undefined) {
      arr.splice(i, 1);
      i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位，
    }
  }
  return arr;
};

/**
 * 时间戳转换成自定义格式
 * @param {new Date().getTime()} val
 * @param {yyyy-MM-dd HH:mm:ss} format
 */
export function dateFormat(val, format) {
  val = +val;
  function Zero(number) {
    return number < 10 ? "0" + number : number;
  }
  let date = new Date(val);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minut = date.getMinutes();
  let secon = date.getSeconds();

  let obj = {
    yyyy: year,
    MM: Zero(month),
    dd: Zero(day),
    HH: Zero(hour),
    mm: Zero(minut),
    ss: Zero(secon)
  };

  let keys = Object.keys(obj);
  keys.forEach(item => {
    format = format.replace(item, obj[item]);
  });

  return format;
}

/**
 * 计算两个日期的相差天数 不比较小时分钟
 * @param {String|Number} timestamp1 设置的基准时间
 * @param {String|Number} timestamp2 需要比较的时间
 */
export const caldiffDays = (timestamp1, timestamp2) => {
  if (!timestamp1 || !timestamp2) return "";
  let dateSpan, tempDate, iDays;
  let timestamp1_ =
    String(timestamp1).length == 10
      ? Number(timestamp1) * 1000
      : Number(timestamp1);
  let timestamp2_ =
    String(timestamp2).length == 10
      ? Number(timestamp2) * 1000
      : Number(timestamp2);
  let sDate1 = dateFormat(timestamp1_, "yyyy-MM-dd"); //timestampToTimeNormal(timestamp1, '/')
  let sDate2 = dateFormat(timestamp2_, "yyyy-MM-dd"); //timestampToTimeNormal(timestamp2, '/')
  sDate1 = Date.parse(sDate1);
  sDate2 = Date.parse(sDate2);
  dateSpan = sDate2 - sDate1;
  dateSpan = Math.abs(dateSpan);
  iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
  return iDays;
};

export const timestampToTimeNormal = (timestamp, split, flag) => {
  if (!timestamp) {
    return false;
  }
  const timestampNew =
    timestamp.toString().length === 10
      ? Number(timestamp) * 1000
      : Number(timestamp);
  const splitNew = split || "/";
  let date = new Date(timestampNew); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + splitNew;
  let M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + splitNew;
  let D =
    date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
  let h =
    date.getHours() < 10 ? "0" + date.getHours() + ":" : date.getHours() + ":";
  let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

  const date_ =
    date.getFullYear() == new Date().getFullYear() ? M + D : Y + M + D;
  return flag ? date_ + h + m : date_;
};
