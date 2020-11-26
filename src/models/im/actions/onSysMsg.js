import Taro from '@tarojs/taro'
import { dealMsg } from './../utils/dealGroupMsg'
function onSysMsg(someMsg) {
  console.log('onSysMsg: ', someMsg)
  // dealMsg(someMsg, store, app)

  const { msg: { idServer } } = someMsg
  const { globalData: { store: { dispatch, getState } } } = Taro.getApp()
  let { im } = getState()
  // 取出im redux 中的所有数据
  // let { im } = state;
  // 获取所有历史记录的key
  let history = Object.keys(im).filter(item => item.indexOf('history_') !== -1);

  // 遍历历史数据的key
  history.forEach(item => {
    // 取出im中对应的key的数据
    let arr = im[item];
    // 遍历所有数据
    for (let i = 0; i < arr.length; i++) {
      let msg = arr[i];
      // 只要传入的id和数据匹配上了，就进入新的过滤项，停止循环。
      if (msg.idServer == idServer) {
        // 过滤有用的数据，
        let filterHistory = arr.filter(h => h.idServer != idServer);

        // 更新数据
        dispatch({
          type: "im/updateDatas",
          payload: {
            [item]: filterHistory
          }
        })
        // 退出循环
        break;
      }
    }
  })
}

export default onSysMsg
