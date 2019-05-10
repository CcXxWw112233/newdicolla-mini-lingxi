import {dealMsg} from './../utils/dealGroupMsg'
function onSysMsg(msg) {
  console.log('onSysMsg: ', msg)
  dealMsg(msg, store, app)
}

export default onSysMsg
