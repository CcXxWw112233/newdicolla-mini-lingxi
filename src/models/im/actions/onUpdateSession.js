import Taro from '@tarojs/taro';

function onUpdateSession(sessions) {
  console.log('get session :', sessions)
  const {
    globalData: {
      store: { dispatch, getState }
    }
  } = Taro.getApp();

  const { im } = getState();

  let tempState = Object.assign({}, im);
  sessions.map(item => {
    if (item.unread) {
      tempState.unreadInfo[item.id] = item.unread;
    }
  });

  dispatch({
    type: 'im/updateStateByReplace',
    state: tempState,
    desc: 'update sessions'
  });
}

export default onUpdateSession;
