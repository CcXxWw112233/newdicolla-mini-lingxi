import Taro from '@tarojs/taro'

function onWillReconnect(e) {
  console.log('im onWillReconnect', e)
  // Taro.showToast({
  //   title: 'im 重连中...',
  //   icon: 'none',
  //   duration: 3000,
  // })
  // const { globalData: { store: { getState } } } = Taro.getApp()
  // const { im: { nim } } = getState()
  // nim.disconnect({
  //   done: () => {
  //     console.log('断开连接成功');
  //     setTimeout(() => {
  //       nim.connect({})
  //     }, 50)
  //   }
  // })
}
export default onWillReconnect
