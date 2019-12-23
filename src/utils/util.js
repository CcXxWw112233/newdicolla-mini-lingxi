//工具函数
export const isPlainObject = obj => {
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    return true
  }
  return false
}

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
export const filterFileFormatType = (fileName) => {
  let themeCode = '';
  const type = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
  switch (type) {
    case '.3dm':
      themeCode = '&#xe6e0;';
      break
    case '.iges':
      themeCode = '&#xe65e;';
      break
    case '.obj':
      themeCode = '&#xe660;';
      break
    case '.ma':
      themeCode = '&#xe668;';
      break
    case '.mb':
      themeCode = '&#xe650;';
      break
    case '.skp':
      themeCode = '&#xe65a;';
      break
    case '.dwg':
      themeCode = '&#xe64d;';
      break
    case '.psd':
      themeCode = '&#xe666;';
      break
    case '.pdf':
      themeCode = '&#xe652;';
      break
    case '.doc':
      themeCode = '&#xe64c;';
      break
    case '.xls':
      themeCode = '&#xe667;';
      break
    case '.ppt':
      themeCode = '&#xe659;';
      break
    case '.docx':
      themeCode = '&#xe64c;';
      break
    case '.xlsx':
      themeCode = '&#xe665;';
      break
    case '.pptx':
      themeCode = '&#xe651;';
      break
    case '.key':
      themeCode = '&#xe64f;';
      break
    case '.jpg':
      themeCode = '&#xe657;';
      break
    case '.jpeg':
      themeCode = '&#xe65f;';
      break
    case '.png':
      themeCode = '&#xe69a;';
      break
    case '.gif':
      themeCode = '&#xe65b;';
      break
    case '.mp4':
      themeCode = '&#xe6e1;';
      break
    case '.mp3':
      themeCode = '&#xe6e2;';
      break
    case '.txt':
      themeCode = '&#xe658;';
      break
    case '.rar':
      themeCode = '&#xe6e4;';
      break
    case '.zip':
      themeCode = '&#xe6e5;';
      break
    case '.7z':
      themeCode = '&#xe6e6;';
      break
    case '.gz':
      themeCode = '&#xe6e7;';
      break
    default:
      themeCode = '&#xe669;'; // 未识别类型显示
      break
  }
  return themeCode;
}

// 权限过滤方法
export const filterListAuth = (data = [],userid)=>{
  let arr = [];
  // 确定权限
  let hasAuthority = (data)=>{
    if(!data || !data.length ){
      return true;
    }
    if(data.indexOf(userid) !== -1){
      return true
    }
    return false ;
  }
  data.forEach(item => {
      // 动态通知检查
      if(item.type === 'custom' && item.content){
          let content = typeof item.content === 'string' ? JSON.parse(item.content) : item.content;
          // 动态通知存在权限管控
          if(content.method === 'newActivity'){
              let t = content.data.t;
              // 检查权限
              hasAuthority(t) && arr.push(item);
          }else{
            arr.push(item)
          }
      } else arr.push(item);// 普通消息不存在权限管控
  })

  return arr ;
}
