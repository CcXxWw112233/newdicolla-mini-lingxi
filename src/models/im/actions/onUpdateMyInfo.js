import Taro from '@tarojs/taro'

function onUpdateMyInfo(user) {
  console.log('update MyInfo', user)
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
       desc: 'get update user info'
      })
}

export default onUpdateMyInfo
