import Taro from '@tarojs/taro';
import { dealMsg } from './../utils/dealGroupMsg';

function onRoamingMsgs(list) {
  const {
    globalData: {
      store: { dispatch, getState }
    }
  } = Taro.getApp();

  const { im: state } = getState();

  let tempState = Object.assign({}, state);

  let msgList = list.msgs;
  let sessionId = list.sessionId;
  tempState.rawMessageList = Object.assign({}, tempState.rawMessageList);
  msgList.map(msg => {
    if (!tempState.rawMessageList[sessionId]) {
      tempState.rawMessageList[sessionId] = {};
    }
    if (msg.type === 'notification') {
      // 群通知消息  && msg.scene === 'team'
      dealMsg(msg, null, tempState.userInfo.account);
    }
    tempState.rawMessageList[sessionId][msg.time] = Object.assign({}, msg);
  });
  dispatch({
    type: 'im/updateStateByReplace',
    state: tempState,
    desc: 'add roamingMsgList'
  });
}

export default onRoamingMsgs;
