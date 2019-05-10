import Taro from '@tarojs/taro';

function onSyncDone() {
  const {
    globalData: {
      store: { dispatch }
    }
  } = Taro.getApp();
  dispatch({
    type: 'im/updateStateFieldByCover',
    payload: {
      isLogin: false
    },
    desc: 'init done.'
  });
}

export default onSyncDone;
