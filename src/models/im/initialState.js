const INITIAL_STATE = {
  nim: null, //Nim 实例
  userUID: '',  //登录账号ID
  sdktoken: '',   //登录账号token
  isLogin: false, // 是否正在登录
  isRegister: false, // 是否正在注册
  userInfo: {}, // 登录用户信息

  currentSubChat: {},// 当前真正聊天的子圈
  currentChatTo: '', // 正在聊天 sessionId
  currentGroup: {}, //当前的聊天群信息
  currentGroupSessionList: [],  //当前群的聊天信息
  isOnlyShowInform: false, //是否只过滤显示定制的通知消息
  currentBoardId: '', //当前选择的项目 id
  currentBoard: {}, //当前的项目
  currentBoardImValid: {}, //当前项目及其子群是否是有效的 im 群(通过拉取 im 上面的群聊信息， 和从我们自己的服务其拉取的 allBoardList 的数据做对比， 如果不一致，就先修复数据，如果修复失败，则禁止用户点进具体的群)
  allBoardList: [], //所有组织的所有的群列表， 从我们后端拿，而不是云信, 目前来讲，因为只有群聊的入口，而且是所有项目(每个组织下可能多个项目), 每个项目的 type='2',所以可以根据这个条件筛选数据
  rawMessageList: {}, // 所有的聊天列表都在里面, 消息列表, 当受到新的消息列表的时候，如果存在当前群，则筛选，更新当前群的聊天信息
  isTouchChatContentScrollView: false, //是否正在触摸聊天内容滚动列表
  currentGroupMembers: [],  //当前的群成员列表

  //目前没有用到的字段，p2p时可能会用
  friendCard: {}, //好友列表，含名片信息，额外添加在线信息
  onlineList: {}, // 在线好友列表
  // messageListToRender: {},
  groupList: {}, // 群列表
  groupMemberList: {}, // 群成员列表
  groupMemberMap: {}, // 群成员列表
  personList: {}, // 所有有信息的人的列表
  unreadInfo: {}, // 未读信息，包含已、未订阅的账户数
  notificationList: { system: [], custom: [] }, // 系统通知，分为自定义消息和系统消息
  netcallEvent: { type: '', payload: null }, // 音视频事件载荷
  netcallCallList: [], // 多人通话呼叫列表
  netcallGroupCallInfo: {}, // 群组音视频被叫时通知信息

  // 会话列表，会话列表包含消息未读信息，用来更新未读状态，但是具体群的消息列表，则从 rawMessageList中拿
  sessionlist: [],
  sessionMap: {},
  // 当前会话ID（即当前聊天列表，只有单聊群聊采用，可用于判别）
  currSessionId: null,
  currSessionMsgs: [],
  boardChatImAllLastHistoryList: {}, //当前项目圈的历史消息,
  sessionListMap: {}, //切割聊天历史数据列表
  history_newSession: [],// 更新版，新消息的记录，包括自己发送的和接受的
  historySub_newSession: [],// 子圈的消息记录
  currentBoardDetail: {},
  unread_all_number: '',  //全部未读数
}

export { INITIAL_STATE }

/**
 * 登录用户个人信息
 * userInfo: {account, avatar, birth, createTime, email, gender, nick, sign, tel, updateTime}
 * friendCard: { account: {account,nick,avatar,sign,gender:'male/female/unknown',tel,updateTime,createTime, isBlack, status} }
 * onlineList: {account: status}
 * groupList: {teamId:{avatar,beInviteMode,createTime,inviteMode,joinMode,level,memberNum,memberUpdateTime,mute,muteType,name,owner,teamId,type,updateCustomMode,updateTeamMode,updateTime,valid,validToCurrentUser}}
 * groupMemberList: {teamId: [{teamId,account,type,nickInTeam,active,joinTime,updateTime}]}
 * messageListToRender: {account: {unixtime1: {from,to,type,scene,text,sendOrReceive,displayTimeHeader,time}, unixtime2: {}}}
 * rawMessageList: {sessionId: {unixtime1: {flow,from,fromNick,idServer,scene,sessionId,text,target,to,time...}, unixtime2: {}}}
 * unreadInfo: {sessionId: unread}
 * notificationList: {system: [{desc:'',msg:{category,from,idServer,read,state,status,time,to,type}}], custom: []}
 * netcallCallList: [{account,nick,avatar}]
 * netcallGroupCallInfo: {id,members:['account'],teamName,type}
 */
