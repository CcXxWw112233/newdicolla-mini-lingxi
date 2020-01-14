import { dealMsg } from './../utils/dealGroupMsg'
function onOfflineSysMsgs(msg) {
  console.log(msg)
  msg.map(item => dealMsg(item, store, app))
}

export default onOfflineSysMsgs
