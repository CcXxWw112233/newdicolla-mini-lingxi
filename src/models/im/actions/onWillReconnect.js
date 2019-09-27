import Taro from '@tarojs/taro'

function onWillReconnect(e) {
  console.log('im onWillReconnect', e)
  Taro.showToast({
    title: 'im 重连中...',
    icon: 'none',
    duration: 3000,
  })
  nim.disconnect({ done: () => { nim.connect(); } })
}
export default onWillReconnect
