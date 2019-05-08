import Taro from '@tarojs/taro'

function onBlacklist(blackList) {

  const {
  globalData: {
        store: { dispatch, getState }
      }
  } = Taro.getApp();
  const {im, im: {friendCard}} = getState()

  // 发送来了黑名单就在好友名片信息中添加标志位
  let tempState = Object.assign({}, im)

  blackList.map(item => {
    // 触发黑名单时friendCard为空
    if (item.account) {
      if (!tempState.friendCard[item.account]) {
        tempState.friendCard[item.account] = {}
        tempState.friendCard[item.account].isFriend = false //没有任何用户信息，非好友状态下拉黑
      }
      tempState.friendCard[item.account].isBlack = true
    }
  })
  dispatch({
    type: 'im/updateStateFieldByCover',
    payload: tempState,
    descr: 'update black list.'
  })
}

export default onBlacklist
