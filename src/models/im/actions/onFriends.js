import Taro from '@tarojs/taro';
import ENVIRONMENT_CONFIG from './../../../gloalSet/js/imConfig'

const {openSubscription} = ENVIRONMENT_CONFIG

function onFriends(friends) {
  console.log(friends, '======================= friends =======================')
  const {
    globalData: {
      store: { dispatch, getState }
    }
  } = Taro.getApp();
  const {im, im: {nim}} = getState()

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
    payload: temp
  });

  if (openSubscription) {
    nim.subscribeEvent({
      type: 1, // 订阅用户登录状态事件
      accounts: friends.map(item => item.account),
      sync: true,
      done: function (err, obj) {
        console.log('subscribe friends login state :', obj)
        // console.log(err, obj)
      }
    })
  }

}

export default onFriends;
