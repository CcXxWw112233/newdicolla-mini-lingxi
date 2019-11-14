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
    const params = this.$router.params;
    const sourcePage = params.push;
    const { boardId } = this.props
    this.setState({ sourcePage });

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
      resetCurrentGroupSessionList
    } = this.props;
    resetCurrentChatTo();
    resetCurrentGroup();
    resetCurrentGroupSessionList();
  }

  // componentWillUnmount() {
  //   //利用小程序的生命周期,当页面卸载的时候,跳转到指定的界面
  //   const { sourcePage } = this.state
  //   if (sourcePage === 'auccessJoin' || sourcePage === 'sceneEntrance') {
  //     const switchTabCurrentPage = 'currentPage_BoardDetail_or_Login'
  //     Taro.setStorageSync('switchTabCurrentPage', switchTabCurrentPage);  //解决wx.switchTab不能传值
  //     Taro.switchTab({
  //       url: `../../pages/calendar/index`
  //     })
  //   }
  // }

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
      </View>
    );
  }
}

export default BoardDetail;
