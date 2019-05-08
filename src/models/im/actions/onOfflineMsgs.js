import Taro from '@tarojs/taro';

function onOfflineMsgs(msg) {
  const {
    globalData: {
      store: { dispatch, getState }
    }
  } = Taro.getApp();

  const { im: state } = getState();

  let tempState = Object.assign({}, state);
  let sessionId = msg.sessionId;
  if (!tempState.rawMessageList[sessionId]) {
    tempState.rawMessageList[sessionId] = {};
  }
  msg.msgs.map(item => {
    tempState.rawMessageList[sessionId][item.time] = Object.assign({}, item);
  });
  dispatch({
    type: 'im/updateStateFieldByCover',
    payload: tempState,
    desc: 'get offline msg.'
  });
}

export default onOfflineMsgs;
