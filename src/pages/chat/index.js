import Taro, { Component, Canvas } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { View } from "@tarojs/components";
import styles from "./index.scss";
import ChatHeader from "./components/ChatHeader.js";
import ChatContent from "./components/ChatContent.js";
import UserInput from "./components/UserInput.js";
import FileChat from "./components/fileChat.js";
import Contacts from "../Contacts";
@connect(
  ({
    chat: {},
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
    }
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
          type: "im/updateStateFieldByCover",
          payload: {
            currentBoardId: boardId
          },
          desc: "im set current board id."
        });
      },
      setCurrentBoard: (board = {}) => {
        dispatch({
          type: "im/updateStateFieldByCover",
          payload: {
            currentBoard: board
          },
          desc: "im set current board."
        });
      },

      resetCurrentChatTo: () =>
        dispatch({
          type: "im/updateStateFieldByCover",
          payload: {
            currentChatTo: ""
          },
          desc: "reset currentChatTo"
        }),
      resetCurrentGroup: () =>
        dispatch({
          type: "im/updateStateFieldByCover",
          payload: {
            currentGroup: {}
          },
          desc: "reset currentGroup"
        }),

      resetCurrentGroupSessionList: () =>
        dispatch({
          type: "im/updateStateFieldByCover",
          payload: {
            currentGroupSessionList: []
          },
          desc: "reset currentGroupSessionList"
        }),
      checkTeamStatus: boardId => {
        dispatch({
          type: "im/checkTeamStatus",
          payload: {
            boardId
          },
          desc: "check im team status."
        });
      },
      setCurrentChatTo: im_id =>
        dispatch({
          type: "im/updateStateFieldByCover",
          payload: {
            currentChatTo: im_id
          },
          desc: "set currentChatTo"
        }),
      setCurrentGroup: (group = {}) => {
        dispatch({
          type: "im/updateStateFieldByCover",
          payload: {
            currentGroup: group
          },
          desc: "set current chat group."
        });
      },
      updateCurrentChatUnreadNewsState: im_id =>
        dispatch({
          type: "im/updateCurrentChatUnreadNewsState",
          payload: {
            im_id
          },
          desc: "update currentChat unread news"
        })
    };
  }
)
class Chat extends Component {
  config = {
    disableScroll: true //??????????????????????????????
  };
  constructor(props) {
    super(props);
    this.page_number = 1;
    this.loadNumber = 1;
  }

  state = {
    file_info: {}, //??????????????????
    page_source: "", //????????????
    boardId: "", //????????????id
    imId: "", //????????????id
    showContacts: false,
    selectedUser: ""
  };

  componentDidMount() {
    const { fileInfo, pageSource, boardId } = this.$router.params;

    this.setState({
      file_info: fileInfo && JSON.parse(fileInfo),
      page_source: pageSource
    });
    wx.setNavigationBarTitle({
      title: "??????"
    });
  }

  concatHistory = arr => {
    let { currentGroupSessionList } = this.props;
    let obj = {};
    let h = currentGroupSessionList.concat(arr);
    let history = [];
    h.forEach(item => {
      if (item && !obj[item.idServer]) {
        history.push(item);
        obj[item.idServer] = true;
      }
    });
    return history;
  };

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

  inputDown = e => {
    const { dispatch } = this.props;
    dispatch({
      type: "chat/updateStateFieldByCover",
      payload: {
        handleInputMode: "text"
      },
      desc: "handleInputDown"
    });
  };

  inputDownChild = e => {
    e.stopPropagation();
  };

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
    let keys = Object.keys(tempState).filter(
      item => item.indexOf("history_") != -1
    );
    keys.forEach(item => {
      delete tempState[item];
    });
    tempState.history_newSession = [];
    // ???????????????????????????--???????????????????????????
    dispatch({
      type: "im/updateStateByReplace",
      state: { ...tempState },
      desc: "update sessions"
    });

    const { page_source } = this.state;

    //?????????????????????id???????????????????????????
    const {
      resetCurrentChatTo,
      resetCurrentGroup,
      resetCurrentGroupSessionList
    } = this.props;
    resetCurrentChatTo();
    resetCurrentGroup();
    resetCurrentGroupSessionList();

    if (page_source === "auccessJoin" || page_source === "sceneEntrance") {
      const switchTabCurrentPage = "currentPage_BoardDetail_or_Login";
      Taro.setStorageSync("switchTabCurrentPage", switchTabCurrentPage); //??????wx.switchTab????????????
      Taro.switchTab({
        url: `../../pages/boardChat/index`
      });
    }
  }
  // ?????????????????????
  onPrefix = val => {
    let { currentBoard, userUID } = this.props;
    if (currentBoard.users.filter(item => item.user_id != userUID).length >= 1)
      this.setState({
        showContacts: true
      });
  };

  // ????????????
  contactsClose = () => {
    // ?????????????????????
    setTimeout(() => {
      this.setState({
        showContacts: false
      });
    }, 350);
  };
  // ?????????????????????
  selectContacts = val => {
    this.setState({
      selectedUser: val
    });
  };
  // ????????????
  onSend = () => {
    this.setState({
      selectedUser: ""
    });
  };
  onTapName = () => {
    let { dispatch, currentGroup } = this.props;
    dispatch({
      type: "im/updateStateFieldByCover",
      payload: {
        currentBoardDetail: currentGroup
      }
    });
    Taro.navigateTo({
      url: `/pages/chatDetail/index`
    });
  };

  render() {
    const {
      file_info = {},
      page_source,
      showContacts,
      selectedUser
    } = this.state;
    const {
      isShowFileComment,
      currentBoard,
      userUID,
      currentGroup
    } = this.props;

    return (
      <View
        className={styles.wrapper}
        // onClick={this.inputDown}
      >
        {isShowFileComment === true &&
        page_source &&
        page_source === "isFileComment" ? (
          <FileChat fileInfo={file_info} />
        ) : (
          ""
        )}
        <View className={styles.headerWraper}>
          <ChatHeader
            onTapBoardName={this.onTapName}
            currentProject={currentGroup}
          />
        </View>
        <View className={styles.chatContentWrapper}>
          <ChatContent />
        </View>
        <View className={styles.userInputWrapper} onClick={this.inputDownChild}>
          <UserInput
            onPrefix={this.onPrefix}
            prefixUser={selectedUser}
            onSend={this.onSend}
            im_id={currentGroup.im_id}
            fromPage="chat"
          />
        </View>
        {showContacts && (
          <Contacts
            onClose={this.contactsClose}
            users={currentBoard.users.filter(item => item.user_id != userUID)}
            onSelect={this.selectContacts}
          />
        )}
      </View>
    );
  }
}

export default Chat;
