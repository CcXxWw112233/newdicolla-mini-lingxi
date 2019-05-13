import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import styles from './GroupList.scss';
import GroupItem from './GroupItem';

@connect(
  ({ im: { sessionlist, currentBoardId, currentBoard} }) => {
    return {
      sessionlist,
      currentBoardId,
      currentBoard,
    };
  },
  dispatch => {
    return {
      setCurrentChatTo: im_id =>
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentChatTo: im_id
          },
          desc: 'set currentChatTo'
        }),
      setCurrentGroup: (group = {}) => {
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentGroup: group
          },
          desc: 'set current chat group.'
        })
      },
      updateCurrentChatUnreadNewsState: im_id =>
        dispatch({
          type: 'im/updateCurrentChatUnreadNewsState',
          payload: {
            im_id
          },
          desc: 'update currentChat unread news'
        })
    };
  }
)
class GroupList extends Component {
  state = {
    isShouldExpandSubGroup: true
  };
  hanldClickedGroupItem = ({ board_id, im_id }) => {
    const { setCurrentChatTo, setCurrentGroup, updateCurrentChatUnreadNewsState, currentBoard } = this.props;

    //生成与 云信后端返回数据相同格式的 id
    const id = `team-${im_id}`;

    //设置currentChatTo之后，会自动将该群的新接收的消息更新为已读，
    //但是如果该群之前有未读消息的时候，需要先更新该群的未读消息状态
    //所以需要在聊天界面的页面退出回调中，将 currentChatTo 值 清除
    const getCurrentGroup = (currentBoard, im_id) => {
      if(!currentBoard.childs || !Array.isArray(currentBoard.childs)) {
        currentBoard.childs = []
      }
      const ret = [currentBoard, ...currentBoard.childs].find(i => i.im_id === im_id)
      return ret ? ret : {}
    }
    Promise.resolve(setCurrentChatTo(id))
      .then(() => setCurrentGroup(getCurrentGroup(currentBoard, im_id)))
      .then(() => updateCurrentChatUnreadNewsState(id))
      .then(() => {
        Taro.navigateTo({
          url: `/pages/chat/index`
        });
      })
      .catch(e => Taro.showToast({ title: String(e), icon: 'none' }));
  };
  handleExpandSubGroupChange = flag => {
    this.setState({
      isShouldExpandSubGroup: flag
    });
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
    if (childsUnReadArr.some(Boolean)) {
      return true;
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
      avatarList,
      childs,
    };
  };
  render() {
    const { sessionlist, currentBoard } = this.props;
    const { isShouldExpandSubGroup } = this.state;
    if(!currentBoard) return null
    const integratedCurrentBoardInfo = this.integrateCurrentBoardWithSessions(
      currentBoard,
      sessionlist
    );
    // console.log(
    //   integratedCurrentBoardInfo,
    //   '============= integratedCurrentBoardInfo =================='
    // );

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
              avatarList,
              childs,
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
                isShouldShowExpandOpertor={childs.length}
              />
            );
          })}
        </View>
        <View
          className={`${styles.subGroupWrapper} ${
            !isShouldExpandSubGroup ? styles.hideSubGroup : ''
          }`}
        >
          {/* {isShouldExpandSubGroup && <View> */}
          {true && (
            <View>
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
            </View>
          )}
        </View>
      </View>
    );
  }
}

GroupList.defaultProps = {
  currentBoardId: '', //当前的项目id
  currentBoard: {}, //当前的项目信息
  sessionlist: [], //所有的会话列表，
}
export default GroupList;
