import Taro from '@tarojs/taro';

function onSessions(sessions) {
  const {
    globalData: {
      store: { dispatch, getState }
    }
  } = Taro.getApp();

  const {
    im: state,
    im: { nim }
  } = getState();

  let tempState = Object.assign({}, state);

  //更新未读消息
  sessions.map(item => {
    if (item.unread) {
      tempState.unreadInfo[item.id] = item.unread;
    }
  });

  // tempState.sessionlist = nim.mergeSessions(state.sessionlist, sessions);
  tempState.sessionlist = [...state.sessionlist, ...sessions];
  tempState.sessionlist.sort((a, b) => {
    return b.updateTime - a.updateTime;
  });

  tempState.sessionlist.forEach(item => {
    tempState.sessionMap[item.id] = item;
  });

  dispatch({
    type: 'im/updateStateByReplace',
    state: tempState,
    desc: 'get new sessions'
  });
}

export default onSessions;
