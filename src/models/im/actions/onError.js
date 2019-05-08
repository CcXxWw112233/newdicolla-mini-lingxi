import Taro from '@tarojs/taro'
function onError(error) {
  console.log('im onError', error)
  const {globalData: {store: {getState}}} = Taro.getApp()
  const {im: {nim}} = getState()
  if(nim) {
    nim.disconnect()
    nim.connect()
  }
}

export default onError
