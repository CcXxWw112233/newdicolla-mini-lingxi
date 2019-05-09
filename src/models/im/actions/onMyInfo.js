import Taro from '@tarojs/taro'

function onMyInfo(user) {
  const {
  globalData: {
        store: { dispatch }
      }
  } = Taro.getApp();

  dispatch({
     type: 'im/updateStateFieldByCover',
     payload: {
       userInfo: user
     },
     desc: 'get user info'
    })
}

export default onMyInfo
