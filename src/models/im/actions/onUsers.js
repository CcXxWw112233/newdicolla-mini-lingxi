import Taro from '@tarojs/taro';

function onUsers(friends) {

  const {
    globalData: {
      store: { dispatch, getState }
    }
  } = Taro.getApp();

  const { im } = getState();

  let temp = Object.assign({}, im);
  friends.map(friend => {
    // 设置默认好友登录状态
    if (!temp.friendCard[friend.account]) {
      friend.status = '离线';
    } else if (!temp.friendCard[friend.account].status) {
      friend.status = '离线';
    }
    friend.isFriend = true; // 好友标记位
    // blackList数据在friend之前，需要合并之前的数据
    temp.friendCard[friend.account] = Object.assign(
      {},
      friend,
      temp.friendCard[friend.account]
    );
    temp.personList[friend.account] = temp.friendCard[friend.account];
  });

  dispatch({
    type: 'im/updateStateFieldByCover',
    payload: temp,
    desc: 'get friends list.'
  });
}

export default onUsers;
