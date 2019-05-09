import Taro from '@tarojs/taro';

function onTeams(teams) {
  const {
    globalData: {
      store: { dispatch, getState }
    }
  } = Taro.getApp();

  const { im } = getState();

  let tempState = Object.assign({}, im);
  let groupList = {};
  Object.keys(teams).map(item => {
    // 初始化 list、构造群 map
    if (item === 'invalid') {
      return;
    }
    let teamId = teams[item].teamId;
    teams[item].isCurrentNotIn = false;
    groupList[teamId] = teams[item];
  });
  tempState.groupList = groupList;
  dispatch({
    type: 'im/updateStateByReplace',
    state: tempState,
    desc: 'get teams'
  });
}

export default onTeams;
