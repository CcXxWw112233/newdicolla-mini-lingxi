import { updateStateFieldByCover } from './../im/reducers.js';
import { getImHistory } from '../../services/im/index.js';
import { genHistoryMsg } from '../../models/im/utils/genNews.js';
import Taro from '@tarojs/taro'

export default {
  namespace: 'chat',
  state: {
    isUserInputFocus: false, // 是否呼出虚拟键盘
    isUserInputHeightChange: 0, //用户输入区域变高, 如果变高，需要调整 chatcontent 高度， 否则 chatcontent 的部分内容会被遮挡
    chatContentHeightStyle: '',

  },
  effects: {
    *loadHistoryImMessage({ payload }, { call, put, select }) {
      console.log("loadHistoryImMessage effects");
      let { next_msgid, to } = payload;
      console.log({ next_msgid, to });
      let data = {};
      // if(next_msgid){
      //   data = {next_msgid,to};
      // }else{
      //   data = {to};
      // }
      // const res = yield call(getImHistory(data));
      // const currentGroupSessionList = yield select(getModelSelectState('im','currentGroupSessionList'));
      // const currentBoard = yield select(getModelSelectState('im','currentBoard'));
      // const account_info_string = yield Taro.getStorageSync('account_info');
      // const accounInfo = JSON.parse(account_info_string);
      // let historyList = [];
      // for(const msg of res.data){
      //   historyList.push(genHistoryMsg(msg,currentBoard,accounInfo.id));
      // }
      // let nextMsgId = 0;
      // if(res.data&&res.data.length>0){
      //     nextMsgId = res.data[res.data.length-1].msgid||0;
      // }
      // console.log("YING",);
      // console.log("YING",currentGroupSessionList);
      // console.log("YING nextMsgId",nextMsgId);
      // yield put({
      //   type:"im/updateStateFieldByCover",
      //   payload: {
      //     currentGroupSessionList: historyList.reverse().concat(currentGroupSessionList),
      //     currentNextHistoryMsgId: nextMsgId
      //   }
      // }); 
      // yield put({
      //   type: "im/getHistoryMsgs",
      //   payload: {
      //     scene: 'team',
      //     to: to
      //   }
      // });
    }
  },
  reducers: {
    updateStateFieldByCover
  }
};
