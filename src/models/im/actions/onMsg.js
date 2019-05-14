import Taro from '@tarojs/taro';
import { dealMsg } from './../utils/dealGroupMsg';

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
  let sessionId = msg.sessionId;
  if (!tempState.rawMessageList[sessionId]) {
    tempState.rawMessageList[sessionId] = {};
  }
  tempState.rawMessageList[sessionId][msg.time] = Object.assign({}, msg);
  if (tempState.currentChatTo === msg.sessionId && nim) {
    const getAvatarByFromNick = nick => {
      const { currentBoard } = tempState
      let ret =
        currentBoard && currentBoard.users.find(i => i.full_name === nick);
      return ret ? ret.avatar : '';
    };
    const mapSessionToNews = ({ time, flow, fromNick, status, type, text }) => {
      return {
        flow,
        fromNick,
        avatar: getAvatarByFromNick(fromNick),
        status,
        time,
        type,
        text
      };
    };

    console.log(msg.sessionId, '--------------- resetSessionUnread in Msg------------------')
    if(msg.scene === 'team' && msg.type === 'text' && tempState.currentChatTo && tempState.currentChatTo === msg.sessionId) {
      tempState.currentGroupSessionList = [...tempState.currentGroupSessionList, mapSessionToNews(msg)]
    }
    // 当前会话
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
