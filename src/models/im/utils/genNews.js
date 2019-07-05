import { isShouldHandleType } from './activityHandle.js';

//用来生成聊天信息的

const assistantAvatar = 'dynamicAssistant';

const getAvatarByFromNick = (fromImId, currentBoard = { users: [] }) => {
  if (fromImId === '10086') {
    return assistantAvatar;
  }
  let ret = currentBoard && currentBoard.users.find(i => i.id === fromImId );
  return ret ? ret.avatar : '';
};

const genNews = (msg, currentBoard) => {
  const {
    time,
    flow,
    from,
    fromNick,
    status,
    type,
    text = '',
    file = {},
    content,
    pushContent,
    groupNotification
  } = msg;

  return {
    flow,
    fromNick,
    avatar: getAvatarByFromNick(from, currentBoard),
    status,
    time,
    type,
    text,
    file,
    content: content ? JSON.parse(content) : '',
    pushContent,
    groupNotification
  };
};

const genHistoryMsg = (msg,currentBoard,accountId) => {
  if(msg&&msg.msg_type==="TEXT"){
    let newMsg = {};
    newMsg.type = 'text';
    newMsg.time = parseInt(msg.sendtime);
    newMsg.text = msg.body;
    newMsg.from = msg.from;
    if(msg.from === accountId){
      newMsg.from = 'out';
    }
    newMsg.avatar = getAvatarByFromNick(msg.from, currentBoard);
    newMsg.status = 'success';
    return newMsg;
  }
  // const {
  //   time,
  //   flow,
  //   from,
  //   fromNick,
  //   status,
  //   msg_type:type,
  //   body:text,
  //   file = {},
  //   content,
  //   pushContent,
  //   groupNotification
  // } = msg;

  // return {
  //   flow,
  //   fromNick,
  //   avatar: getAvatarByFromNick(from, currentBoard),
  //   status,
  //   time,
  //   type,
  //   text,
  //   file,
  //   content: content ? JSON.parse(content) : '',
  //   pushContent,
  //   groupNotification
  // };
};

const isValidMsg = msg => {
  const { scene, type, custom, content } = msg;
  // 是否是需要处理的定制消息
  if (type === 'custom' && custom === 'newActivity' && content) {
    let isValid = false;
    try {
      const parsedContent = JSON.parse(content);
      const parsedDataD = JSON.parse(parsedContent.data.d);
      isValid = isShouldHandleType(parsedDataD.action);
    } catch (e) {
      return false;
    }
    if (isValid) {
      return true;
    }
  }
  return scene === 'team' && (type === 'text' || type === 'audio' || 'image');
};

const isCustomNews = msg => {
  const { scene, type, custom } = msg;
  return scene === 'team' && type === 'custom' && custom;
};

const isActivityCustomNews = msg => {
  const { custom } = msg;
  return isCustomNews(msg) && custom === 'newActivity';
};

const isPushCustomNews = msg => {
  const { custom } = msg;
  return isCustomNews(msg) && custom === 'newPush';
};

const isGlobalPushNews = msg => {
  //全局消息推送属性
  const pushSessionId = 'p2p-10086';
  const pushType = 'custom';
  const pushCustom = 'newPush';

  const { type, sessionId, custom } = msg;

  return (
    type === pushType && sessionId === pushSessionId && custom === pushCustom
  );
};

const isPinupEmojiNews = msg => {
  const pinupPushContent = '[贴图表情]';
  const { type, scene, pushContent, content } = msg;

  return (
    type === 'custom' &&
    scene === 'team' &&
    pushContent === pinupPushContent &&
    content
  );
};

//是否系统通知消息

const isNotificationNews = msg => {
  const { type, fromClientType, groupNotification } = msg;
  return (
    type === 'notification' && fromClientType === 'Server' && groupNotification
  );
};

//是否是创建新的群聊的系统通知消息
const isCreatedNewGroupOrAddTeamMembersNews = session => {
  const {
    lastMsg: { fromClientType, type, attach: { type: attachType } = {} } = {}
  } = session;
  return (
    fromClientType === 'Server' &&
    type === 'notification' &&
    attachType === 'addTeamMembers'
  );
};

export {
  genNews,
  genHistoryMsg,
  isValidMsg,
  isActivityCustomNews,
  isPushCustomNews,
  isGlobalPushNews,
  isPinupEmojiNews,
  isCreatedNewGroupOrAddTeamMembersNews,
  isNotificationNews,
};
