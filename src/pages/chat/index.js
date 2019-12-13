import Taro, { Component, } from '@tarojs/taro';
import { View } from '@tarojs/components';
import styles from './index.scss';
import ChatHeader from './components/ChatHeader.js';
import ChatContent from './components/ChatContent.js';
import UserInput from './components/UserInput.js';
import FileChat from './components/fileChat.js';
import { connect } from '@tarojs/redux';

@connect(({
  chat: { },
  file: { isShowFileComment },
  im: {
    allBoardList,
    sessionlist,
    currentBoardId,
    currentBoard,
    currentBoardImValid,
    rawMessageList,
    currentGroup,
  },
}) => {
  return {
    isShowFileComment,
    allBoardList,
    sessionlist,
    currentBoardId,
    currentBoard,
    rawMessageList,
    currentBoardImValid,
    currentGroup,
  };
},
  dispatch => {
    return {
      setCurrentBoardId: boardId => {
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentBoardId: boardId
          },
          desc: 'im set current board id.'
        })
      },
      setCurrentBoard: (board = {}) => {
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentBoard: board
          },
          desc: 'im set current board.'
        })
      },

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
      checkTeamStatus: boardId => {
        dispatch({
          type: 'im/checkTeamStatus',
          payload: {
            boardId
          },
          desc: 'check im team status.'
        })
      },
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
        });
      },
      updateCurrentChatUnreadNewsState: im_id =>
        dispatch({
          type: 'im/updateCurrentChatUnreadNewsState',
          payload: {
            im_id
          },
          desc: 'update currentChat unread news'
        }),
    };
  }
)

class Chat extends Component {

  config = {
    disableScroll: true //页面整体不能上下滚动
  };

  state = {
    file_info: {},  //文件评论信息
    page_source: '',  //页面来源
    boardId: '',   //当前项目id
    imId: '',  //当前群聊id
  }

  componentDidMount() {

    const { fileInfo, pageSource, boardId, } = this.$router.params
    this.setState({
      file_info: fileInfo && JSON.parse(fileInfo),
      page_source: pageSource,
    })

    //从项目圈页面过来的不需要初始化IM相关信息
    if (pageSource === 'boardChat') {
      return
    } else {
      //根据当前board_id查找im_id
      const { allBoardList } = this.props
      const fileIsCurrentBoard = allBoardList.filter((item, index) => {
        if (item.board_id === boardId) {
          return item
        }
      })

      const { im_id } = fileIsCurrentBoard[0]

      //初始化IM相关信息
      this.initializationChat(boardId, im_id)
    }
  }

  initializationChat = (board_id, im_id) => {
    const {
      allBoardList,
      setCurrentBoardId,
      setCurrentBoard,
      checkTeamStatus,
    } = this.props;

    const getCurrentBoard = (arr, id) => {
      const ret = arr.find(i => i.board_id === id);
      return ret ? ret : {};
    };

    Promise.resolve(setCurrentBoardId(board_id))
      .then(() => {
        setCurrentBoard(getCurrentBoard(allBoardList, board_id));
      })
      .then(() => {
        checkTeamStatus(board_id)
      }).then(() => {
        this.validGroupChat({ im_id })
      })
      .catch(e => console.log('error in boardDetail: ' + e));
  }

  validGroupChat = ({ im_id }) => {
    const {
      setCurrentChatTo,
      setCurrentGroup,
      updateCurrentChatUnreadNewsState,
      currentBoard,
      currentBoardImValid
    } = this.props

    if (!im_id) {
      Taro.showToast({
        title: '当前群未注册',
        icon: 'none'
      });
      return;
    }

    const isValid =
      currentBoardImValid[im_id] && currentBoardImValid[im_id]['isValid'];

    if (!isValid) {
      // Taro.showToast({
      //   title: '当前群数据异常',
      //   icon: 'none'
      // });
      // return;

      // console.log('当前群数据异常...')
      /**
       * 遇到群聊数据异常的情况, 重新注入registerIm连接
       */
      this.registerIm()

      const { globalData: { store: { getState } } } = Taro.getApp()
      const { im: { nim } } = getState()
      if (nim) {
        nim.disconnect({
          done: () => {
            console.log('断开连接成功');
            setTimeout(() => {
              nim.connect({})
            }, 50)
          }
        })
      }
    }

    //生成与 云信后端返回数据相同格式的 id
    const id = `team-${im_id}`;
    //设置currentChatTo之后，会自动将该群的新接收的消息更新为已读，
    //但是如果该群之前有未读消息的时候，需要先更新该群的未读消息状态

    const getCurrentGroup = (currentBoard, im_id) => {
      if (!currentBoard.childs || !Array.isArray(currentBoard.childs)) {
        currentBoard.childs = [];
      }
      const ret = [currentBoard, ...currentBoard.childs].find(
        i => i.im_id === im_id
      );
      return ret ? ret : {};
    };
    Promise.resolve(setCurrentChatTo(id))
      .then(() => setCurrentGroup(getCurrentGroup(currentBoard, im_id)))
      .then(() => updateCurrentChatUnreadNewsState(id))
      .then(() => {
        console.log('im_chat初始化完成');
      })
      .catch(e => Taro.showToast({ title: String(e), icon: 'none' }));
  }

  registerIm = () => {
    // console.log('群聊异常执行重新注入Im');
    const initImData = async () => {
      const { dispatch } = this.props;
      const { account, token } = await dispatch({
        type: 'im/fetchIMAccount'
      });
      await dispatch({
        type: 'im/initNimSDK',
        payload: {
          account,
          token
        }
      });
      return await dispatch({
        type: 'im/fetchAllIMTeamList'
      });
    };
    initImData().catch(e => Taro.showToast({ title: String(e), icon: 'none' }));
  }

  inputDown = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'chat/updateStateFieldByCover',
      payload: {
        handleInputMode: 'text'
      },
      desc: 'handleInputDown'
    });
  }

  inputDownChild = (e) => {
    e.stopPropagation();
  }

  componentWillReceiveProps(nextProps) {

  }

  componentWillUnmount() {
    const { page_source } = this.state

    //页面来源不是项目圈boardChat就不需要执行
    // if (page_source != 'boardChat') {
    //重置当前聊天群id，和当前聊天群信息
    const {
      resetCurrentChatTo,
      resetCurrentGroup,
      resetCurrentGroupSessionList
    } = this.props;
    resetCurrentChatTo();
    resetCurrentGroup();
    resetCurrentGroupSessionList();
    // }

    if (page_source === 'auccessJoin' || page_source === 'sceneEntrance') {
      const switchTabCurrentPage = 'currentPage_BoardDetail_or_Login'
      Taro.setStorageSync('switchTabCurrentPage', switchTabCurrentPage);  //解决wx.switchTab不能传值
      Taro.switchTab({
        url: `../../pages/calendar/index`
      })
    }
  }

  render() {

    const { file_info = {}, page_source } = this.state
    const { isShowFileComment } = this.props

    return (
      <View className={styles.wrapper} onClick={this.inputDown}>
        {
          isShowFileComment === true && page_source && page_source === 'isFileComment' ? (<FileChat fileInfo={file_info} />
          ) : ''
        }
        <View className={styles.headerWraper}>
          <ChatHeader />
        </View>
        <View className={styles.chatContentWrapper}>
          <ChatContent />
        </View>
        <View className={styles.userInputWrapper} onClick={this.inputDownChild}>
          <UserInput />
        </View>
      </View>
    );
  }
}

export default Chat;
