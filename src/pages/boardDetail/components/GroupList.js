import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import styles from './GroupList.scss';
import GroupItem from './GroupItem';

@connect(({ im: { sessionlist, allBoardList } }) => {
  return {
    allBoardList,
    sessionlist
  };
})
class GroupList extends Component {
  state = {
    isShouldExpandSubGroup: true,
  }
  hanldClickedGroupItem = ({board_id, im_id}) => {
    console.log(board_id, im_id, 'ooooooooooooooooooooooooooooo')
  }
  handleExpandSubGroupChange = flag => {
    this.setState({
      isShouldExpandSubGroup: flag
    })
  }
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
      .reverse()
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
          //这里不是累加
          acc.unRead = curr.unread;
          acc.lastMsg = curr;
          return acc;
        }
        let findedIndex = acc.childs.findIndex(i => i.im_id === curr.to);
        const notFound = index => index === -1;
        if (notFound(findedIndex)) {
          return acc;
        }
        acc.childs[findedIndex].unRead = curr.unread;
        acc.childs[findedIndex].lastMsg = curr;
        return acc;
      }, currentBoardIdWithDefaultUnReadAndLastMsg);
  };
  genLastMsg = (lastMsg = {}) => {
    const { fromNick, type, text } = lastMsg;
    if (!fromNick) return '';
    const typeCond = {
      text,
      image: '[图片]',
      video: '[视频]',
      custom: '[系统消息]'
    };
    if (type === 'text') {
      return `${fromNick}: ${text}`;
    }
    return typeCond[type] ? typeCond[type] : '[未知类型消息]';
  };
  genAvatarList = (users = []) => {
    return users.slice(0, 5).map(i => i.avatar);
  };
  isShouldShowNewDot = (unRead = 0, childsUnReadArr) => {
    //如果主群的未读数量不是0， 那么就不会显示消息点提醒
    if (unRead) return false;
    //如果子群中有任意的消息，那么就展开子群列表
    if (childsUnReadArr.some(Boolean)){
      return true
    }
    return false;
  };
  genSubGroupInfo = ({
    users = [],
    lastMsg = {},
    board_id,
    im_id,
    name,
    type_name,
    unRead
  } = {}) => {
    //lastMsg 是个对象， 里面有 lastMsg 属性
    lastMsg = this.genLastMsg(lastMsg.lastMsg);
    const avatarList = this.genAvatarList(users);
    return {
      board_id,
      im_id,
      lastMsg,
      label: type_name === '小组' ? type_name : '小组',
      name,
      newsNum: unRead,
      avatarList
    };
  };
  genMainGroupInfo = ({
    childs = [],
    users = [],
    lastMsg = {},
    board_id,
    im_id,
    name,
    type_name: label,
    unRead
  } = {}) => {
    //lastMsg 是个对象， 里面有 lastMsg 属性
    lastMsg = this.genLastMsg(lastMsg.lastMsg);
    const avatarList = this.genAvatarList(users);
    const showNewsDot = this.isShouldShowNewDot(
      unRead,
      childs.map(i => i.unRead)
    );
    return {
      board_id,
      im_id,
      lastMsg,
      label,
      name,
      newsNum: unRead,
      showNewsDot,
      avatarList
    };
  };
  render() {
    const { sessionlist, currentBoardId, allBoardList } = this.props;
    const {isShouldExpandSubGroup} = this.state
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
      '============= integratedCurrentBoardInfo =================='
    );

    return (
      <View className={styles.wrapper}>
        <View className={styles.mainGroupWrapper}>
          {/* Taro 编译有错误，如果将生成 mainGroup 的函数直接放在 render 里，那么解析出来的 board_id, 等变量会直接替换 生成 subGroup 的 board_id 等变量，导致其不生效 */}
          {[integratedCurrentBoardInfo].map(mainGroup => {
            const {
              board_id,
              im_id,
              lastMsg,
              label,
              name,
              newsNum,
              showNewsDot,
              avatarList
            } = this.genMainGroupInfo(mainGroup);

            return (
              <GroupItem
                key={board_id}
                board_id={board_id}
                im_id={im_id}
                lastMsg={lastMsg}
                label={label}
                name={name}
                newsNum={newsNum}
                showNewsDot={showNewsDot}
                avatarList={avatarList}
                isExpand={isShouldExpandSubGroup}
                onExpandChange={this.handleExpandSubGroupChange}
                onClickedGroupItem={this.hanldClickedGroupItem}
                isSubGroup={false}
              />
            );
          })}
        </View>
        <View className={styles.subGroupWrapper}>
          {isShouldExpandSubGroup && <View>
          {integratedCurrentBoardInfo.childs.map((subGroup, index) => {
            const {
              board_id,
              im_id,
              lastMsg,
              label,
              name,
              newsNum,
              avatarList
            } = this.genSubGroupInfo(subGroup);
            return (
              <GroupItem
                key={board_id}
                board_id={board_id}
                im_id={im_id}
                lastMsg={lastMsg}
                label={label}
                name={name}
                newsNum={newsNum}
                avatarList={avatarList}
                isSubGroup={true}
                onClickedGroupItem={this.hanldClickedGroupItem}
              />
            );
          })}
          </View>}
        </View>
      </View>
    );
  }
}

export default GroupList;
