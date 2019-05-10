import Taro from '@tarojs/taro';

function onUpdateSession(sessions) {
  console.log('get session :', sessions);
  if(!Array.isArray(sessions)) {
    sessions = [sessions]
  }
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

  sessions.map(item => {
    if (item.unread) {
      tempState.unreadInfo[item.id] = item.unread;
    }
  });

  // tempState.sessionlist = nim.mergeSessions(state.sessionlist, sessions);
  tempState.sessionlist = [...state.sessionlist, ...sessions]
  tempState.sessionlist.sort((a, b) => {
    return b.updateTime - a.updateTime;
  });
  tempState.sessionlist.forEach(item => {
    tempState.sessionMap[item.id] = item;
  });
  dispatch({
    type: 'im/updateStateByReplace',
    state: tempState,
    desc: 'update sessions'
  });
}

export default onUpdateSession;
