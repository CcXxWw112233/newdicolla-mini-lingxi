import Taro from '@tarojs/taro'
import { onSendMsgDone } from './../index'

const onResendMsg = (someMsg) => {
    // console.log('重发消息', someMsg)

    const { globalData: { store: { getState } } } = Taro.getApp()
    const { im: { nim } } = getState()
    nim.resendMsg({
        msg: someMsg,
        done: (error, msg) => {
            onSendMsgDone(error, msg);

            // console.log('发送失败: ', error, msg);
            // console.log('发送消息:' + (!error ? '成功' : '失败') + ', id=' + msg.idClient);
        }
    })
}

export { onResendMsg } 