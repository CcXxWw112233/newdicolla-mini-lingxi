import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';

@connect(({ im: { sessionlist, allBoardList } }) => {
  return {
    allBoardList,
    sessionlist
  };
})
class GroupList extends Component {
  integrateSessionList = sessionlist => {
    const { allBoardList } = this.props;
    return sessionlist
      .filter(item => item && item.scene === 'team')
      .map(item => {
        if (item.scene === 'team') {
          let teamInfo = null;
          teamInfo = allBoardList.find(team => {
            return team.teamId === item.to;
          });
          if (teamInfo) {
            item.name = teamInfo.name;
            item.avatar =
              teamInfo.avatar ||
              (teamInfo.type === 'normal'
                ? this.myGroupIcon
                : this.myAdvancedIcon);
          } else {
            item.name = `群${item.to}`;
            item.avatar = item.avatar || this.myGroupIcon;
          }
        }
        let lastMsg = item.lastMsg || {};
        if (lastMsg.type === 'text') {
          item.lastMsgShow = lastMsg.text || '';
        } else if (lastMsg.type === 'custom') {
          item.lastMsgShow = util.parseCustomMsg(lastMsg);
        } else if (
          lastMsg.scene === 'team' &&
          lastMsg.type === 'notification'
        ) {
          item.lastMsgShow = util.generateTeamSysmMsg(lastMsg);
        } else if (util.mapMsgType(lastMsg)) {
          item.lastMsgShow = `[${util.mapMsgType(lastMsg)}]`;
        } else {
          item.lastMsgShow = '';
        }
        if (item.updateTime) {
          item.updateTimeShow = util.formatDate(item.updateTime, true);
        }
        return item;
      });
  };
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
    return [currentBoardInfo].map(board =>
      sessionlist
        .filter(
          i =>
            i &&
            i.scene &&
            i.scene === 'team' &&
            allGroupIMId.find(e => e === i.to)
        )
        .reduce((acc, curr) => {
          //拿到最后一个消息，和统计未读数。
          return acc
        },
        Object.assign({}, currentBoardInfo, { unReadNum: 0, lastMsg: {} }, { childs: currentBoardInfo.childs && currentBoardInfo.childs.length ? currentBoardInfo.childs.map(i => ({...i, unReadNum = 0, lastMsg: {}})) : [] }))
    );
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
    console.log(
      integratedCurrentBoardInfo,
      'integratedCurrentBoardInfointegratedCurrentBoardInfo'
    );
    return <View>GroupList</View>;
  }
}

export default GroupList;
