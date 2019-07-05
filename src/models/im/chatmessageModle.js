import Taro from '@tarojs/taro';
import {
    handleDependOnState,
    updateStateByReplace,
    updateStateFieldByCover,
    updateStateFieldByExtension
  } from './reducers';
export default {
    namespace: 'chatmessage',
    state:{
      currentGroupSessionArrayKeyList: [], //["CURRENT_MESSAGE_LIST_1",["CURRENT_MESSAGE_LIST_2"]
      currentNextHistoryMsgId: 0,
      //CURRENT_MESSAGE_LIST_1: [{******},{******}],
      //CURRENT_MESSAGE_LIST_2: [{******},{******}],
    },
    effects: {
  //获取历史消息（从云信服务器中）
  *getHistoryMsgs({ payload }, { select, put }) {
    const { scene, to } = payload;
    const { nim } = yield selectFieldsFromIm(select, 'nim');
    const { currentBoard, currentGroupSessionList,testLyjList} = yield selectFieldsFromIm(select, ['currentBoard', 'currentGroupSessionList','testLyjList']);

    const msgs = yield new Promise((resolve, reject) => {
      nim.getHistoryMsgs({
        scene: scene,
        to: to,
        done: (error, obj) => {
          console.log('获取p2p历史消息' + (!error ? '成功' : '失败'));
          //console.log(error);
          //console.log(obj);
          if (!error) {
            resolve(obj.msgs);
          } else {
            resolve([]);
          }
        }
      });
    });

    //console.log(msgs);
    //msgs.map(msg => genNews(msg, currentBoard));
    
    let historyList = [];
    for (const msg of msgs) {
      historyList.push(genNews(msg, currentBoard));
    }

    
    let nextMsgId = 0;
    yield put({
      type: "updateStateFieldByCover",
      payload: {
        'currentGroupSessionList': historyList.concat(currentGroupSessionList).slice(0,40),
        //currentNextHistoryMsgId: nextMsgId,
        // testLyjList_1: [],
        'testLyjList[0]': historyList.concat(currentGroupSessionList).slice(0,40),
        //[`testLyjList_${2}`]: historyList.concat(currentGroupSessionList).slice(0,40),
      }
    });
  }
    },
    reducers: {
      handleDependOnState,
      updateStateByReplace,
      updateStateFieldByCover,
      updateStateFieldByExtension
    }
}