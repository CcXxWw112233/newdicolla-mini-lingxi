import Taro from '@tarojs/taro'

function onConnect({ account, token }) {
  const {globalData: {store: {dispatch}}} = Taro.getApp()

  console.log(
    '%c connect im success',
    'background:#FFFBE6;color: #54B258',
    '============================================================================'
  );

    //存储登录账号: userUID，登录账号token: sdktoken
    dispatch({
      type: 'im/updateStateFieldByCover',
      payload: {
        userUID: account,
        sdktoken: token
      },
      desc: 'store userUID sdktoken'
    });
}
export default onConnect;
