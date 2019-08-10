import { updateMultiPortStatus } from './../utils/util';
import Taro from '@tarojs/taro';

function onPushEvents(param) {
  const {
    globalData: {
      store: { dispatch, getState }
    }
  } = Taro.getApp();

  // console.log(' onPushEvents: ', param);
  let msgEvents = param.msgEvents;
  if (msgEvents) {
    let statusArr = [];
    msgEvents.map(data => {
      statusArr.push({
        status: updateMultiPortStatus(data),
        account: data.account
      });
    });

    const { im: state } = getState();

    let tempState = Object.assign({}, state);
    statusArr.map(item => {
      // 触发状态更新时friendCard可能为空
      if (!tempState.friendCard[item.account]) {
        tempState.friendCard[item.account] = {};
      }
      tempState.friendCard[item.account].status = item.status;
      tempState.onlineList[item.account] = item.status;
    });

    // 更新好友全局状态
    dispatch({
      type: 'im/updateStateFieldReplace',
      state: tempState,
      desc: 'update friend status'
    });
  }
}

export default onPushEvents;
