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
      resetCurrentNextHistoryMsgId: () =>
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentNextHistoryMsgId: 0
          },
          desc: 'reset currentNextHistoryMsgId'
        }),
      checkTeamStatus: boardId =>
        dispatch({
          type: 'im/checkTeamStatus',
          payload: {
            boardId
          },
          desc: 'check im team status.'
        })
    };
  }
)
class BoardDetail extends Component {
  componentWillMount() {
    const {
      allBoardList,
      setCurrentBoardId,
      setCurrentBoard,
      checkTeamStatus
    } = this.props;
    const { boardId } = this.$router.params;
    const getCurrentBoard = (arr, id) => {
      const ret = arr.find(i => i.board_id === id);
      return ret ? ret : {};
    };
    Promise.resolve(setCurrentBoardId(boardId))
      .then(() => {
        setCurrentBoard(getCurrentBoard(allBoardList, boardId));
      })
      .then(() => checkTeamStatus(boardId))
      .catch(e => console.log('error in boardDetail: ' + e));
  }
  componentDidShow() {
    //重置当前聊天群id，和当前聊天群信息
    const {
      resetCurrentChatTo,
      resetCurrentGroup,
      resetCurrentGroupSessionList,
      resetCurrentNextHistoryMsgId
    } = this.props;
    resetCurrentChatTo();
    resetCurrentGroup();
    resetCurrentGroupSessionList();
    resetCurrentNextHistoryMsgId();
  }
  render() {
    const { allBoardList } = this.props;
    const isHasBoardData = Array.isArray(allBoardList) && allBoardList.length;

    return (
      <View className={styles.wrapper}>
        {isHasBoardData && (
          <View className={styles.imGroupWrapper}>
            <GroupList />
          </View>
        )}
        <View className={styles.boardStarWrapper}>
          <BoardStar />
        </View>
      </View>
    );
  }
}

export default BoardDetail;
