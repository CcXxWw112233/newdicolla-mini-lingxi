import Taro from '@tarojs/taro';
import {isCreatedNewGroupOrAddTeamMembersNews} from './../utils/genNews.js'


function onUpdateSession(sessions) {
  // console.log('get session :', sessions);

  const {
    globalData: {
      store: { dispatch, getState }
    }
  } = Taro.getApp();

  const {
    im: state,
    im: { nim }
  } = getState();

  //如果是新建群或者更新了群成员的信息，那么重新拉取所有的群信息的列表
  if(isCreatedNewGroupOrAddTeamMembersNews(sessions)) {
    dispatch({
      type: 'im/fetchAllIMTeamList',
      desc: 'fetch all im team list'
    });
  }

  if(!Array.isArray(sessions)) {
    sessions = [sessions]
  }

  let tempState = Object.assign({}, state);

  sessions.map(item => {
    if (item.unread) {
      tempState.unreadInfo[item.id] = item.unread;
    }
  });

  // tempState.sessionlist = nim.mergeSessions(state.sessionlist, sessions);
  const filteredSessionList = state.sessionlist.filter(i => !sessions.find(s => s.to === i.to && s.updateTime === i.updateTime))
  tempState.sessionlist = [...filteredSessionList, ...sessions]
  tempState.sessionlist.sort((a, b) => {
    return b.updateTime - a.updateTime;
  });
  tempState.sessionlist.forEach(item => {
    tempState.sessionMap[item.id] = item;
  });
  dispatch({
    type: 'im/updateStateByReplace',
    state: tempState,
    desc: 'update sessions'
  });
}

export default onUpdateSession;
