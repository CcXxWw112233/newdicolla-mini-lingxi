import config from './activityConfig.js';

const isFieldInArrIndex = (arr = [], field, index) => {
  const findIndex = arr.findIndex(i => i === field);
  return findIndex === index;
};
const splitStringBy = (str = '', symbol) => str.split(symbol);
const splitStringByPeriod = str => splitStringBy(str, '.');
const isAccord = (action, field, index) =>
  isFieldInArrIndex(splitStringByPeriod(action), field, index);

//是否关联内容
const isLinkContent = action => isAccord(action, 'link', 2);

//是否任务类型
const isCard = action => isAccord(action, 'card', 1);

//是否文件类型
const isFile = action => isAccord(action, 'file', 1);

//是否文件夹类型
const isFolder = action => isAccord(action, 'folder', 1);

//是否流程
const isFlow = action => isAccord(action, 'flow', 1);

const isInclude = (map = {}) => action => {
  return Object.values(map).some(i => i(action));
};

const findType = (map = {}) => action => {
  const isFinded = Object.entries(map).find(([_, callback]) =>
    callback(action)
  );
  if (isFinded) {
    const [type] = isFinded;
    return type;
  }
  return false;
};

const typeList = [isLinkContent, isCard, isFile, isFolder, isFlow];
const typeMap = {
  link: isLinkContent,
  card: isCard,
  file: isFile,
  folder: isFolder,
  flow: isFlow
};
const isShouldHandleType = isInclude(typeMap);
const isGetType = findType(typeMap);

const getAction = (config, action, title) => {
  if (config[action] && config[action]['actionText']) {
    return config[action]['actionText'];
  }
  return title ? title : '';
};
const getContent = (config, action, data) => {
  const { content } = data;
  if (config[action] && config[action]['contentCallback']) {
    return config[action]['contentCallback'](content);
  }
  return content;
};

const getRange =(config, action, data) => {
  const {content} = data
  if(config[action] && config[action]['rangeCallback']) {
    return config[action]['rangeCallback'](content)
  }
  return {}
}

//解析消息体
const parseActivityNewsBody = data => {
  const { action, creator, title } = data;
  const type = isGetType(action);
  if (!type && config[action]) {
    return {};
  }

  //改属性名称是因为 Taro 解析 render 函数存在名称冲突
  return {
    activityType: type,
    creator,
    action: getAction(config, action, title),
    activityContent: getContent(config, action, data),
    range: getRange(config, action, data)
  };
};

export { isShouldHandleType, parseActivityNewsBody };
