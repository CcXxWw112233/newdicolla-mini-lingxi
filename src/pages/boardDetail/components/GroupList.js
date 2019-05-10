import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import GroupItem from './GroupItem';

@connect(({ im: { sessionlist, allBoardList } }) => {
  return {
    allBoardList,
    sessionlist
  };
})
class GroupList extends Component {
  getCurrentBoardInfo = (id, list = []) => {
    const result = list.find(i => i.board_id === id);
    return result ? result : {};
  };
  integrateCurrentBoardWithSessions = (currentBoardInfo, sessionlist = []) => {
    //这里需要整合每个群组的未读消息数量和最后一个信息
    const allGroupIMId = [currentBoardInfo.im_id].concat(
      currentBoardInfo.childs && currentBoardInfo.childs.length
        ? currentBoardInfo.childs.map(i => i.im_id)
        : []
    );

    //为 currentBoardInfo 及它下面的子群 添加 unRead(未阅读消息数量) 和 lastMsg(最后一条消息， 用于展示)
    const currentBoardIdWithDefaultUnReadAndLastMsg = Object.assign(
      {},
      currentBoardInfo,
      { unRead: 0, lastMsg: {} }
    );
    currentBoardIdWithDefaultUnReadAndLastMsg.childs =
      currentBoardIdWithDefaultUnReadAndLastMsg.childs &&
      currentBoardIdWithDefaultUnReadAndLastMsg.childs.length
        ? currentBoardIdWithDefaultUnReadAndLastMsg.childs.map(i => {
            return {
              ...i,
              unRead: 0,
              lastMsg: ''
            };
          })
        : [];
    return sessionlist
      .filter(
        i =>
          i &&
          i.scene &&
          i.scene === 'team' &&
          allGroupIMId.find(e => e === i.to)
      )
      .reduce((acc, curr) => {
        //拿到每个群组的最后一个消息，和统计未读数。

        if (curr.to === acc.im_id) {
          acc.unRead++;
          acc.lastMsg = curr;
          return acc;
        }
        let findedIndex = acc.childs.findIndex(i => i.im_id === curr.to);
        const notFound = index => index === -1;
        if (notFound(findedIndex)) {
          return acc;
        }
        acc.childs[findedIndex].unRead++;
        acc.childs[findedIndex].lastMsg = curr;
        return acc;
      }, currentBoardIdWithDefaultUnReadAndLastMsg);
  };
  render() {
    const { sessionlist, currentBoardId, allBoardList } = this.props;
    const currentBoardInfo = this.getCurrentBoardInfo(
      currentBoardId,
      allBoardList
    );
    const integratedCurrentBoardInfo = this.integrateCurrentBoardWithSessions(
      currentBoardInfo,
      sessionlist
    );
    return (
      <View>
        <GroupItem
        />
      </View>
    );
  }
}

export default GroupList;
