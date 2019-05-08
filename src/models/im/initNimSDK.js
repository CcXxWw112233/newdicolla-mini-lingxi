import Taro from '@tarojs/taro'
import SDK from './../../vendors/NIM_Web_SDK_weixin_v6.4.0.js';
import ENVIRONMENT_CONFIG from './../../gloalSet/js/imConfig';
import {
  onConnect,
  onWillReconnect,
  onDisconnect,
  onError,
  onSyncDone,
  onBlacklist,
  onMarkInBlacklist,
  onMutelist,
  onMarkInMutelist,
  onFriends,
  onSyncFriendAction,
  onMyInfo,
  onUpdateMyInfo,
  onUsers,
  onUpdateUser,
  onTeams,
  onSessions,
  onUpdateSession,
  onRoamingMsgs,
  onOfflineMsgs,
  onMsg,
  onOfflineSysMsgs,
  onSysMsg,
  onUpdateSysMsg,
  onSysMsgUnread,
  onUpdateSysMsgUnread,
  onOfflineCustomSysMsgs,
  onCustomSysMsg,
} from './actions/index';

const { appkey, openPrivateConf } = ENVIRONMENT_CONFIG;

// 第一次进去onConnect onBlacklist onMutelist onFriends onMyInfo onUsers onTeams SyncDone onPushEvents
// 重连 onWillConnect

function* initNimSDK(loginInfo = {}) {
  const {globalData: {store: {dispatch}}} = Taro.getApp()
  const { account, token } = loginInfo;

  if (!account || !token)
    return new Error('initNimSDK func need param: loginInfo {account, token} ');

  dispatch({
    type: 'im/updateStateFieldByCover',
    payload: {
      isLogin: true,
    },
    desc: 'login ing.'
  })
  return yield SDK.NIM.getInstance({
    debug: false,
    appKey: appkey,
    token,
    account,
    promise: true,
    transports: ['websocket'],
    db: false,
    syncSessionUnread: true,
    autoMarkRead: true, // 默认为true
    onconnect: () => onConnect({ account, token }),
    onwillreconnect: onWillReconnect,
    ondisconnect: onDisconnect,
    onerror: onError,
    // 私有化配置文件
    privateConf: openPrivateConf ? openPrivateConf : '',
    //同步完成
    onsyncdone: onSyncDone,
    //用户关系
    onblacklist: onBlacklist,
    onsyncmarkinblacklist: onMarkInBlacklist,
    onmutelist: onMutelist,
    onsyncmarkinmutelist: onMarkInMutelist,
    //好友关系
    onfriends: onFriends,
    onsyncfriendaction: onSyncFriendAction,
    // 用户名片
    /** 6
   * 个人名片：存储个人信息到全局数据
   */
    onmyinfo: onMyInfo,
    onupdatemyinfo: onUpdateMyInfo,
     /** 7
   * 包含名片的好友信息（可能某些字段不全），[{account,avatar,birth,createTime,email,gender,nick,sign,updateTime}]
   */
    onusers: onUsers,
    onupdateuser: onUpdateUser,
    // 机器人列表的回调
    onrobots: (robots) => console.log(' onrobots list: ', robots),
    // 群组
    onteams: onTeams,
    // onsynccreateteam: this.onCreateTeam,
    // onupdateteammember: this.onUpdateTeamMember,
    // onAddTeamMembers: this.onAddTeamMembers,
    // onRemoveTeamMembers: this.onRemoveTeamMembers,
    // onUpdateTeam: this.onUpdateTeam,
    // onUpdateTeamManagers: this.onUpdateTeamManagers,
    // onDismissTeam: this.onDismissTeam,
    // onTransferTeam: this.onTransferTeam,
    // onUpdateTeamMembersMute: this.onUpdateTeamMembersMute,
    // shouldCountNotifyUnread: this.shouldCountNotifyUnread,
    //会话
    onsessions: onSessions,
    onupdatesession: onUpdateSession,
    // 消息
    onroamingmsgs: onRoamingMsgs,
    onofflinemsgs: onOfflineMsgs,
    onmsg: onMsg,
    // 系统通知
    onofflinesysmsgs: onOfflineSysMsgs,
    onsysmsg: onSysMsg,
    onupdatesysmsg: onUpdateSysMsg,
    onsysmsgunread: onSysMsgUnread,
    onupdatesysmsgunread: onUpdateSysMsgUnread,
    onofflinecustomsysmsgs: onOfflineCustomSysMsgs,
    oncustomsysmsg: onCustomSysMsg,






    /** 2. 或 sync done 之后触发
     *  设置订阅后，服务器消息事件回调
     */
    // onPushEvent(param) {
    //   console.log(' onPushEvent: ', param);
    //   let msgEvents = param.msgEvents;
    //   if (msgEvents) {
    //     let statusArr = [];
    //     msgEvents.map(data => {
    //       statusArr.push({
    //         status: updateMultiPortStatus(data),
    //         account: data.account
    //       });
    //     });
        // 更新好友全局状态
        // dispatch({
        //   type: 'FriendCard_Update_Online_Status',
        //   payload: statusArr
        // });
    //   }
    // }
  });
}

// FriendCard：更新指定好友在线状态
//  case 'FriendCard_Update_Online_Status': {
//   let tempState = Object.assign({}, state)
//   let statusArr = action.payload
//   statusArr.map(item => {
//     // 触发状态更新时friendCard可能为空
//     if (!tempState.friendCard[item.account]) {
//       tempState.friendCard[item.account] = {}
//     }
//     tempState.friendCard[item.account].status = item.status
//     tempState.onlineList[item.account] = item.status
//   })
//   return Object.assign({}, state, tempState)
// }
export default initNimSDK;
