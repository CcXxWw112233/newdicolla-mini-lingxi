import { dealMsg } from './../utils/dealGroupMsg'
function onOfflineSysMsgs(msg) {
  console.log('onOfflineSysMsgs:', msg)
  // msg.map(item => dealMsg(item, store, app))
}

export default onOfflineSysMsgs
