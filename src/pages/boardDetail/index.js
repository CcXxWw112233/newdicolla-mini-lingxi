import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import styles from './index.scss';
import GroupList from './components/GroupList.js';
import BoardStar from './components/BoardStar.js';
import { connect } from '@tarojs/redux';

@connect(
  ({ im: { allBoardList } }) => ({ allBoardList }),
  dispatch => {
    return {
      setCurrentBoardId: boardId =>
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentBoardId: boardId
          },
          desc: 'im set current board id.'
        }),
      setCurrentBoard: (board = {}) =>
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentBoard: board
          },
          desc: 'im set current board.'
        }),
      resetCurrentChatTo: () =>
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentChatTo: ''
          },
          desc: 'reset currentChatTo'
        }),
      resetCurrentGroup: () =>
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentGroup: {}
          },
          desc: 'reset currentGroup'
        }),
      resetCurrentGroupSessionList: () =>
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentGroupSessionList: []
          },
          desc: 'reset currentGroupSessionList'
        }),
    };
  }
)
class BoardDetail extends Component {
  componentWillMount() {
    const { allBoardList, setCurrentBoardId, setCurrentBoard } = this.props;
    const { boardId } = this.$router.params;
    const getCurrentBoard = (arr, id) => {
      const ret = arr.find(i => i.board_id === id);
      return ret ? ret : {};
    };
    setCurrentBoardId(boardId);
    setCurrentBoard(getCurrentBoard(allBoardList, boardId));
  }
  componentDidShow() {
    //重置当前聊天群 id， 当前聊天群信息
    //如果不重置 当前聊天群 id ，
    //对话的未读状态更新会受影响
    const { resetCurrentChatTo, resetCurrentGroup, resetCurrentGroupSessionList } = this.props;
    resetCurrentChatTo();
    resetCurrentGroup();
    resetCurrentGroupSessionList()
  }
  render() {
    return (
      <View className={styles.wrapper}>
        <View className={styles.imGroupWrapper}>
          <GroupList />
        </View>
        <View className={styles.boardStarWrapper}>
          <BoardStar />
        </View>
      </View>
    );
  }
}

export default BoardDetail;
