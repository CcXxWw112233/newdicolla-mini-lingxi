import Taro from '@tarojs/taro';
import { isCreatedNewGroupOrAddTeamMembersNews } from './../utils/genNews.js'
import mergeMsgs from './../utils/mergeMsgs'
import { filterListAuth } from '../../../utils/util'
import { getImHistory, getAllIMTeamList } from '../../../services/im'

let allNewSession = [], timer = null, time = 1800, notAddId = "", dontRepeat = {};
function onUpdateSession(sessions) {
  console.log('get session :', sessions);

  const {
    globalData: {
      store: { dispatch, getState }
    }
  } = Taro.getApp();

  const {
    im: state,
    im: { nim }
  } = getState();

  let auth = filterListAuth([sessions.lastMsg], state.userUID);
  // 无权限
  if (!auth[0]) return;

  //如果是新建群或者更新了群成员的信息，那么重新拉取所有的群信息的列表
  // if (isCreatedNewGroupOrAddTeamMembersNews(sessions)) {
  //   dispatch({
  //     type: 'im/fetchAllIMTeamList',
  //     desc: 'fetch all im team list'
  //   });
  // }


  if (!Array.isArray(sessions)) {
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



  let List = [...tempState.allBoardList];
  // 判断这条消息是不是新建群聊
  let oldMsg = List.find(item => item.im_id === sessions[0].to);
  const isUpdate = () => {
    // console.log(oldMsg)
    let { lastMsg = {} } = sessions[0];
    let { attach } = lastMsg;
    if (!oldMsg) {
      // 如果是归档，会更新列表，但是要取值判断不让他增加删除的列表
      if (lastMsg.type == 'custom') {

        if (lastMsg.content && JSON.parse(lastMsg.content).method === 'newPush') {
          let content = JSON.parse(lastMsg.content);
          let { data } = content;
          let { e, d } = data;
          let type = e.split('/')[0];
          d = JSON.parse(d);
          if (type === 'change:board') {
            if (+d.is_deleted || +d.is_archived) {
              // 将不是新增的加入到数组中
              notAddId = (e.split('/')[2]);
              return false;
            }
          }
        }
      }
    }
    if (!oldMsg && !attach) {
      return true;
    }
    if (!oldMsg && (attach.type === 'dismissTeam' || attach.type === 'removeTeamMembers')) {
      return false;
    }
    if (!oldMsg && (attach.type !== 'dismissTeam' || attach.type !== 'removeTeamMembers')) {
      return true
    }
  }
  // 保存所有的新列表
  if (isUpdate()) {
    if (!dontRepeat[sessions[0].to]) {
      allNewSession.push(sessions[0]);
      // dontRepeat[sessions[0].to] = true;
    }

  }
  // 清空定时器
  if (timer) {
    clearTimeout(timer);
  }
  allNewSession = allNewSession.filter(item => item.scene == 'team');
  setTimeout(() => {
    // console.log(allNewSession, notAddId)
    if (allNewSession.length) {
      timer = setTimeout(() => {
        // 先获取本地数据库中的圈子列表，进行比对，把需要的数据放在页面中使用
        fetchUserList().then(data => {
          let arr = [];
          let getH = [];
          // 新数据，没有im_id
          allNewSession.forEach(d => {
            getH.push(getImHistory({ id: d.to, page_size: 10, page_number: 1 }));
            // 列表数据有im_id
            let obj = { ...d };
            data.forEach(item => {
              if (d.to == item.im_id) {
                item.visible = true;
                arr.push({ ...obj, ...item })
              }
            })
          })
          // 获取新列表的聊天历史记录
          Promise.all(getH).then(history => {
            history.forEach(his => {
              let { data: { records, tid } } = his;
              let list = filterListAuth(records)
              arr.map(item => {
                if (item.to === tid) {
                  item.lastMsg = list[0];
                  item.unread = list[0] ? 1 : 0;
                }
                return item;
              })
            })
            // console.log(arr);
            List = List.concat(arr);
            let l = List.filter(item => item.to !== notAddId);
            // let sub = List.filter(item => item.type == 3);
            tempState.allBoardList = [...l];
            allNewSession = [];
            notAddId = "";
            dontRepeat = {};
            // 更新列表
            dispatch({
              type: 'im/updateStateByReplace',
              state: { ...tempState },
              desc: 'update sessions'
            });
          })
        })
      }, time)
    }
  })
  // 如果不是新的列表,直接更新lastmsg等数据
  if (!isUpdate()) {
    tempState.allBoardList.map(item => {
      if (item.im_id == sessions[0].to) {
        item.lastMsg = sessions[0].lastMsg;
        item.updateTime = sessions[0].updateTime;
        item.scene = sessions[0].scene;
        if (item.lastMsg.type === 'tip') {  //撤回消息，未读数减1
          const newUnread = item.unread - 1;
          item.unread = newUnread;
          item.lastMsg.text = sessions[0].lastMsg.tip;
          return
        }
      }
      return item;
    })

    // 云信的列表和本地接口列表重组
    let boardList = mergeMsgs({ a: [...tempState.allBoardList], b: sessions, akey: 'im_id', bkey: "to" });
    // console.log(boardList)
    boardList.map(item => {
      if (item.im_id === tempState.currentBoard.im_id) {
        item.apns = void 0;
      }
      return item;
    })

    tempState.allBoardList = boardList;
    dispatch({
      type: 'im/updateStateByReplace',
      state: { ...tempState },
      desc: 'update sessions'
    });
  }

  const fetchUserList = () => {
    return new Promise((resolve, reject) => {
      getAllIMTeamList({}, { loading: false }).then(res => {
        resolve(res.data);
      })
    })
  }

  // 更新列表
  dispatch({
    type: 'im/updateStateByReplace',
    state: { ...tempState },
    desc: 'update sessions'
  });
}

export default onUpdateSession;
