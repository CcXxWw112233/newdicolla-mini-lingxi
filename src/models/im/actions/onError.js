import Taro from '@tarojs/taro'
import { minify } from 'terser';
function onError(error) {
  console.log('云信im onError 错误:', error)
  const {globalData: {store: {getState}}} = Taro.getApp()
  const {im: {nim}} = getState()
  if(nim) {
    try {
      nim.disconnect()
    } catch (error) {
      console.log('im disconnect:错误', error);
      nim.destroy();
    }
    nim.connect()
  }
}

export default onError
