import { isShouldHandleType } from './activityHandle.js';

const assistantAvatar = 'dynamicAssistant'

const getAvatarByFromNick = (nick, currentBoard = { users: [] }) => {
  if (nick === '群动态助手') {
    return assistantAvatar;
  }
  let ret = currentBoard && currentBoard.users.find(i => i.name === nick);
  return ret ? ret.avatar : '';
};

const genNews = (msg, currentBoard) => {
  const {
    time,
    flow,
    fromNick,
    status,
    type,
    text = '',
    file = {},
    content
  } = msg;

  return {
    flow,
    fromNick,
    avatar: getAvatarByFromNick(fromNick, currentBoard),
    status,
    time,
    type,
    text,
    file,
    content: content ? JSON.parse(content) : ''
  };
};

const isValidMsg = msg => {
  const { scene, type, custom, content } = msg;
  console.log(
    msg,
    '================================ msg in msg ==========================='
  );
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
  return scene === 'team' && (type === 'text' || type === 'audio');
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

export { genNews, isValidMsg, isActivityCustomNews, isPushCustomNews };
