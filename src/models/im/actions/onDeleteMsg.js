import Taro from '@tarojs/taro'
import { sendTip } from '../../im/index'

function onDeleteMsg(someMsg) {

    const { idServer, to, fromNick, } = someMsg

    console.log(someMsg, 'kkkkkkkkkkk');
    

    const { globalData: { store: { getState } } } = Taro.getApp()
    const { im: { nim } } = getState()
    if (nim) {
        nim.deleteMsg({
            msg: someMsg,
            done: deleteMsgDone
        })
        console.log('正在撤回消息', someMsg)
        function deleteMsgDone(error) {
            if (error) {
                Taro.showToast({ title: '撤回失败,请重试', duration: 2000, icon: 'none' })
            } else {
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

                //发送tip消息
                dispatch({
                    type: 'im/sendTip',
                    payload: {
                        scene: 'team',
                        to: to,
                        tip: '"' + fromNick + '"' + ' 撤回了一条消息'
                    },
                    desc: 'im send tip'
                })
            }
            console.log('撤回消息' + (!error ? '成功' : '失败'), error);
        }
    }
}

export { onDeleteMsg }
