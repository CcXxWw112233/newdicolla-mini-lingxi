//工具函数
export const isPlainObject = obj => {
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    return true
  }
  return false
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