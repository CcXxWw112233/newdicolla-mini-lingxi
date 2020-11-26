import Taro, { Component,Canvas } from '@tarojs/taro';
import { View } from '@tarojs/components';
import styles from './index.scss';
import ChatHeader from './components/ChatHeader.js';
import ChatContent from './components/ChatContent.js';
import UserInput from './components/UserInput.js';
import FileChat from './components/fileChat.js';
import Contacts from '../Contacts'
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
    userUID,
    currentGroupSessionList
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
    userUID,
    currentGroupSessionList
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
  constructor(props) {
    super(props);
    this.page_number = 1;
    this.loadNumber = 1;
  }

  state = {
    file_info: {},  //文件评论信息
    page_source: '',  //页面来源
    boardId: '',   //当前项目id
    imId: '',  //当前群聊id
    showContacts:false,
    selectedUser:""
  }

  componentDidMount() {
    const { fileInfo, pageSource, boardId, } = this.$router.params

    this.setState({
      file_info: fileInfo && JSON.parse(fileInfo),
      page_source: pageSource,
    })
    wx.setNavigationBarTitle({
      title:"聆悉"
    })
  }

  concatHistory = (arr) => {
    let { currentGroupSessionList } = this.props;
    let obj = {};
    let h = currentGroupSessionList.concat(arr);
    let history = [];
    h.forEach(item => {
      if (item && !obj[item.idServer]) {
        history.push(item);
        obj[item.idServer] = true;
      }
    })
    return history;
  }

  setNumbers(number, start, end) {
    let arr = [];
    if (start) {
      for (let i = number; i >= start; i--) {
        arr.push(i);
      }
    }
    if (end) {
      for (let i = number; i <= end; i++) {
        arr.push(i);
      }
    }
    return arr;
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

  componentWillUnmount() {
    const {
      globalData: {
        store: { dispatch, getState }
      }
    } = Taro.getApp();

    const {
      im: state,
      im: { nim }
    } = getState();

    let tempState = { ...state };
    let keys = Object.keys(tempState).filter(item => item.indexOf('history_') != -1);
    keys.forEach(item => {
      delete tempState[item]
    })
    tempState.history_newSession = [];
    // 删除存在的历史记录--防止数据量过大报错
    dispatch({
      type: 'im/updateStateByReplace',
      state: { ...tempState },
      desc: 'update sessions'
    });

    const { page_source } = this.state

    //重置当前聊天群id，和当前聊天群信息
    const {
      resetCurrentChatTo,
      resetCurrentGroup,
      resetCurrentGroupSessionList
    } = this.props;
    resetCurrentChatTo();
    resetCurrentGroup();
    resetCurrentGroupSessionList();

    if (page_source === 'auccessJoin' || page_source === 'sceneEntrance') {
      const switchTabCurrentPage = 'currentPage_BoardDetail_or_Login'
      Taro.setStorageSync('switchTabCurrentPage', switchTabCurrentPage);  //解决wx.switchTab不能传值
      Taro.switchTab({
        url: `../../pages/boardChat/index`
      })
    }
  }
  // 输入了艾特符号
  onPrefix = (val)=>{
    let {currentBoard,userUID } = this.props;
    if(currentBoard.users.filter(item => item.user_id != userUID).length >= 1)
    this.setState({
      showContacts:true
    })
  }

  // 关闭回调
  contactsClose = ()=>{
    // 动画完成后关闭
    setTimeout(()=>{
      this.setState({
        showContacts:false
      })
    },350)
  }
  // 选择了艾特别人
  selectContacts = (val) => {
    this.setState({
      selectedUser: val
    })
  }
  // 发送按钮
  onSend = ()=>{
    this.setState({
      selectedUser:""
    })
  }
  onTapName = ()=>{
    let { dispatch,currentGroup } = this.props;
    dispatch({
      type:"im/updateStateFieldByCover",
      payload:{
        currentBoardDetail:currentGroup
      }
    })
    Taro.navigateTo({
      url: `/pages/chatDetail/index`
    })
  }

  render() {

    const { file_info = {}, page_source ,showContacts ,selectedUser} = this.state
    const { isShowFileComment ,currentBoard ,userUID,currentGroup} = this.props

    return (
      <View className={styles.wrapper} 
      // onClick={this.inputDown}
      >
        {
          isShowFileComment === true && page_source && page_source === 'isFileComment' ? (<FileChat fileInfo={file_info} />
          ) : ''
        }
        <View className={styles.headerWraper}>
          <ChatHeader onTapBoardName={this.onTapName} currentProject={currentGroup}/>
        </View>
        <View className={styles.chatContentWrapper}>
          <ChatContent />
        </View>
        <View className={styles.userInputWrapper} onClick={this.inputDownChild}>
          <UserInput onPrefix={this.onPrefix} prefixUser={selectedUser} onSend={this.onSend} im_id={currentGroup.im_id} fromPage='chat'/>
        </View>
        { showContacts && <Contacts onClose={this.contactsClose} users={currentBoard.users.filter(item => item.user_id != userUID)} onSelect={this.selectContacts}/>}
      </View>
    );
  }
}

export default Chat;
