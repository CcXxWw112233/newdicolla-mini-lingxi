import Taro, { connectSocket } from '@tarojs/taro';
import { dealMsg } from './../utils/dealGroupMsg';
import {
  genNews,
  isValidMsg,
  isGlobalPushNews,
  isActivityCustomNews,
  isPinupEmojiNews,
  isNotificationNews
} from './../utils/genNews.js';
import { deep ,filterListAuth} from '../../../utils/util'
import { handleGlobalNewsPush } from './../utils/activityHandle.js';

//收到的消息
function onMsg(msg) {
  // console.log("OnMsg", onMsg);
  // console.log('收到消息', msg.scene, msg.type, msg);

  const {
    globalData: {
      store: { dispatch, getState }
    }
  } = Taro.getApp();
  // console.log(msg, ' ================ get msg ========================');
  const {
    im: state,
    im: { nim }
  } = getState();

  // let tempState = Object.assign({}, state);
  let tempState = {...state}

  let auth = filterListAuth([msg],tempState.userUID);
  // 无权限--退出
  if(!auth[0]) return ;




  tempState.rawMessageList = Object.assign({}, tempState.rawMessageList);
  // 自己的退群消息就不记录、展示了
  if (msg && msg.type === 'notification') {
    // 群通知消息  && msg.scene === 'team'
    if (
      (msg.attach.type === 'leaveTeam' || msg.attach.type === 'dismissTeam') &&
      msg.from === tempState.userInfo.account
    ) {
      return tempState;
    }
    dealMsg(msg, tempState, tempState.userInfo.account);
  }

  //保存当前信息
  let sessionId = msg.sessionId;
  if (!tempState.rawMessageList[sessionId]) {
    tempState.rawMessageList[sessionId] = {};
  }
  tempState.rawMessageList[sessionId][msg.time] = Object.assign({}, msg);

  //整合消息进入当前聊天（如果正在聊天页面的话）的消息流
  const isMsgBelongsToCurrentChatGroup =
    tempState.currentChatTo === msg.sessionId && nim;


  //如果这条消息属于当前打开的群聊，则需要处理，将符合条件的消息合并到当前群的消息列表中
  if (isMsgBelongsToCurrentChatGroup) {
    //如果是一条属于当前打开的群聊的需要整合的消息，
    //那么就整合数据
    const mergeNews = () => {
      if (isValidMsg(msg, tempState.currentChatTo) || isPinupEmojiNews(msg) || isNotificationNews(msg)) {

        const { currentBoard } = tempState;
        tempState.history_newSession = [
          ...tempState['history_newSession'],
          genNews(msg, currentBoard)
        ];
      }
    };

    if (tempState.isOnlyShowInform) {
      if (isActivityCustomNews(msg)) {
        mergeNews();
      }
    } else {
      mergeNews();
    }

    // 更新当前群的未读消息状态
    nim.resetSessionUnread(msg.sessionId);
    // 打开的群聊持续更新未读数为0
    dispatch({
      type:"im/updateBoardUnread",
      payload:{
        param:{
          im_id:msg.target,
          msgids:[],
        },
        im_id: msg.target,
        unread:0
      }
    })
  }else{
    // 如果没有打开的群聊，先添加未读数
    if(msg.type != 'notification' && msg.from != tempState.userUID)
    tempState.allBoardList.map(item => {
      if(item.im_id === msg.target){
        let unread = +(item.unread || 0);
        unread += 1;
        item.unread = unread + "";
      }
      item._math = Math.random() * 100000 +1;
      return item;
    });
  }


  //处理全局的消息推送
  if (isGlobalPushNews(msg)) {
    console.log('get a global push news ................:', msg);
    handleGlobalNewsPush(msg);
  }

  dispatch({
    type: 'im/updateStateByReplace',
    state: {...tempState},
    desc: 'on msg'
  });
}

export default onMsg;

/*
  attach:{type: "acceptTeamInvite", team: {…}, account: "twilbeter3", users: Array(2), members: Array(1)}
  cc:true
  flow:"out"
  from:"twilbeter"
  fromClientType:"Web"
  fromNick:""
  idClient:"c86b07d8-c98f-4186-94a4-68c2db010ae2"
  idServer:"93284035043786753"
  isHistoryable:true
  isLocal:false
  isOfflinable:true
  isPushable:true
  isReplyMsg:true
  isRoamingable:true
  isSyncable:true
  isUnreadable:true
  needMsgReceipt:false
  needPushNick:false
  scene:"team"
  sessionId:"team-1390040443"
  status:"success"
  target:"1390040443"
  text:""
  time:1536914522419
  to:"1390040443"
  type:"notification"
*/
