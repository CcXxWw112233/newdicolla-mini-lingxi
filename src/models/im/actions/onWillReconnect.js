import Taro from '@tarojs/taro'

function onWillReconnect() {
  console.log('im onWillReconnect')
  Taro.showToast({
    title: 'im 重连中...',
    icon: 'none',
    duration: 3000,
  })
}
export default onWillReconnect