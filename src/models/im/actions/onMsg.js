import Taro from '@tarojs/taro';
import { dealMsg } from './../utils/dealGroupMsg';
import {genNews, isValidMsg} from './../utils/genNews.js'
import {isShouldHandleType} from './../utils/activityHandle.js'

function onMsg(msg) {
  const {
    globalData: {
      store: { dispatch, getState }
    }
  } = Taro.getApp();

  const {
    im: state,
    im: { nim }
  } = getState();

  let tempState = Object.assign({}, state);
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

  const isMsgBelongsToCurrentChatGroup =
    tempState.currentChatTo === msg.sessionId && nim;

  //如果这条消息属于当前打开的群聊，则需要处理，将符合条件的消息合并到当前群的消息列表中
  if (isMsgBelongsToCurrentChatGroup) {

    //如果是一条属于当前打开的群聊的text type的消息，
    //那么就整合数据
    if (isValidMsg(msg, tempState.currentChatTo)) {
      const { currentBoard } = tempState;
      tempState.currentGroupSessionList = [
        ...tempState.currentGroupSessionList,
        genNews(msg, currentBoard)
      ];
    }
    // 更新当前群的未读消息状态
    nim.resetSessionUnread(msg.sessionId);
  }
  dispatch({
    type: 'im/updateStateByReplace',
    state: tempState,
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
