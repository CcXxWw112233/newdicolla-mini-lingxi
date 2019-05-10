import Taro from '@tarojs/taro';

function onUpdateSysMsg(sysMsg) {
  console.log('sysMsg: ', sysMsg);
  const {
    globalData: {
      store: { dispatch, getState }
    }
  } = Taro.getApp();

  const { im: state } = getState();

  let tempState = Object.assign({}, state);
  let payload = sysMsg;
  let array = tempState.notificationList.system;
  for (let i = 0; i < array.length; i++) {
    if (array[i].idServer === payload.idServer) {
      array[i].state =
        payload.state === 'rejected'
          ? '已拒绝'
          : payload.state === 'passed'
          ? '已接受'
          : '';
      dispatch({
        type: 'im/updateStateByReplace',
        state: tempState,
        desc: 'update sys msg.'
      });
    }
  }
}

export default onUpdateSysMsg;
