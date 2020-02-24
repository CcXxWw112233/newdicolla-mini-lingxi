import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import styles from './ChatContent.scss';
import ChatItem from './ChatItem.js';
import { connect } from '@tarojs/redux';
import { isPlainObject, filterListAuth } from './../../../utils/util';
import {
  genNews,
  isValidMsg,
  isActivityCustomNews,
  isPinupEmojiNews,
  isNotificationNews
} from './../../../models/im/utils/genNews.js';
import globalStyles from './../../../gloalSet/styles/globalStyles.scss';
import { getImHistory } from '../../../services/im'

@connect(
  ({
    im: {
      currentChatTo,
      sessionlist,
      currentBoard,
      currentGroupSessionList,
      rawMessageList,
      isOnlyShowInform,
      currentGroup,
      userUID,
    },
    im,
    chat: { isUserInputFocus, isUserInputHeightChange }
  }) => {
    let keys = Object.keys(im).filter(item => item.indexOf('history_') != -1);
    let obj = {}
    keys.forEach(item => {
      obj[item] = im[item]
    })
    return {
      currentChatTo,
      sessionlist,
      currentBoard,
      currentGroupSessionList,
      rawMessageList,
      isOnlyShowInform,
      isUserInputFocus,
      isUserInputHeightChange,
      currentGroup,
      userUID,
      ...obj
    }
  },
  dispatch => ({
    toggleIsOnlyShowInform: flag =>
      dispatch({
        type: 'im/updateStateFieldByCover',
        payload: {
          isOnlyShowInform: flag
        },
        desc: 'toggle im isOnlyShowInform'
      })
  })
)
class ChatContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollIntoViewEleId: '', //设置scrollView 自动滚动属性
      chatConetntViewHeightStyle: '',
      isIosHomeIndicator: false,  //是否iPhone X 及以上设备
      firstIn: true,
      loadPrev: false,
      newMsg: false
    };
    //是否正在 touch 聊天列表
    this.isTouchingScrollView = false;
    this.timer = null;
    this.lastId = ""
    this.IsBottom = true;
    this.page_number = 1;
    // 聊天列表-分段赋值
    this.sessionMsgs = {

    }
    this.renderMapList = [];
    this.isLoading = false;
  }
  genCurrentGroupSessionList = () => {
    const {
      currentChatTo,
      rawMessageList,
      currentBoard,
      isOnlyShowInform
    } = this.props;

    return rawMessageList[currentChatTo] &&
      isPlainObject(rawMessageList[currentChatTo])
      ? Object.values(rawMessageList[currentChatTo])
        .filter(msg =>
          isOnlyShowInform
            ? isValidMsg(msg, currentChatTo) && isActivityCustomNews(msg)
            : isValidMsg(msg, currentChatTo) ||
            isPinupEmojiNews(msg) ||
            isNotificationNews(msg)
        )
        .map(msg => genNews(msg, currentBoard))
      : [];
  };
  onScrolltoupper = () => {
    console.log('chat content on scroll to upper...');
    this.loadPrev()
  };
  onScroll = (e) => {
    // console.log(e)
    this.IsBottom = false;
    // console.log('on scroll...........................');
  };
  onScrollViewTouchStart = () => {
    this.setState(
      {
        scrollIntoViewEleId: 'scroll_bottom_id'
      },
      () => {
        this.isTouchingScrollView = true;
      }
    );
  };
  onScrollViewTouchEnd = () => {
    this.isTouchingScrollView = false;
  };
  updateScrollViewPosition = nextProps => {
    const {
      currentGroupSessionList: nextCurrentGroupSessionList,
      isUserInputFocus,
      isUserInputHeightChange: nextIsUserInputHeightChange
    } = nextProps;
    this.setState({
      scrollIntoViewEleId: 'scroll_bottom_id_' + new Date().getTime()
    });

    // const { currentGroupSessionList, isUserInputHeightChange } = this.props;
    // if (nextIsUserInputHeightChange !== isUserInputHeightChange) {
    //   this.setState({
    //     scrollIntoViewEleId: this.state.scrollIntoViewEleId === 'scroll_bottom_id' ? 'scroll_bottom_id2' : 'scroll_bottom_id'
    //   });
    // }
    // if (isUserInputFocus) {
    //   this.setState({
    //     scrollIntoViewEleId: this.state.scrollIntoViewEleId === 'scroll_bottom_id' ? 'scroll_bottom_id2' : 'scroll_bottom_id'
    //   });
    // }
    // if (currentGroupSessionList.length !== nextCurrentGroupSessionList.length) {
    //   if (!this.isTouchingScrollView) {
    //     this.setState({
    //       scrollIntoViewEleId: this.state.scrollIntoViewEleId === 'scroll_bottom_id' ? 'scroll_bottom_id2' : 'scroll_bottom_id'
    //     });
    //   }
    // }

    // let chatContentHeight = 0;
    // const query = Taro.createSelectorQuery();
    // query.select('#chatContent').boundingClientRect();
    // query.exec((res)=>{
    //   console.log("YING",res);
    //   chatContentHeight = res[0].height;
    // });
  };
  isShouldShowTimestamp = (index, arr) => {
    //如果是消息队列中的第一条消息，那么显示时间戳
    if (index === 0) return true;
    //时间间隔 5 分钟
    const timeBetween = 1000 * 60 * 5;
    //如果本条消息的时间戳比上一条消息的时间戳大于 timeBetween 则显示
    const currentMsg = arr[index];
    const prevMsg = arr[index - 1];
    if (
      +currentMsg.time &&
      +prevMsg.time &&
      +currentMsg.time >= +prevMsg.time + +timeBetween
    ) {
      return true;
    }
    return false;
  };

  handleGenSessionListWhenToggleIsOnlyShowInform = flag => {
    // const { dispatch, toggleIsOnlyShowInform } = this.props;
    // Promise.resolve(toggleIsOnlyShowInform(flag)).then(() => {
    //   dispatch({
    //     type: 'im/updateStateFieldByCover',
    //     payload: {
    //       currentGroupSessionList: this.genCurrentGroupSessionList()
    //     },
    //     desc: 'init currentGroupSessionList'
    //   });
    // });
  };



  getHistory = (flow = 'up') => {
    let { dispatch, userUID } = this.props;
    return new Promise((resolve, reject) => {
      let { currentBoard, dispatch, userUID } = this.props;
      let { im_id } = currentBoard;
      this.setState({
        loadPrev: true
      })
      this.isLoading = true;
      // 获取历史记录
      getImHistory({ id: im_id, page_size: 10, page_number: this.page_number }).then(res => {
        // 查询所有已存在的列表
        let readyKey = Object.keys(this.props).filter(item => item.indexOf('history_') != -1);
        let readyList = [];
        // 组合成一个数据
        readyKey.forEach(item => {
          readyList = readyList.concat([...this.props[item]]);
        })
        // 去重新数组
        let arr = [];
        let data = res.data.records;
        // 去重对象- key => true
        let obj = {}
        readyList.forEach(item => {
          if (!obj[item.idServer]) {
            obj[item.idServer] = true;
          }
        })

        // 设定props的key
        let key = 'history_' + new Date().getTime();
        // promise resolve返回数据

        data.forEach(item => {
          // 更新数据流方向
          if ((item.from == userUID && (item.type == 'custom' && JSON.parse(item.content).type == 3))||(item.from == userUID && item.type != 'custom') ) {
            item.flow = 'out'
          }
          if (item.type == 'custom') {
            if (item.content && typeof item.content === 'string') {
              item.content = JSON.parse(item.content);
            }
          }
          // 如果不存在，就push进去，去重
          if (!obj[item.idServer]) {
            arr.push(item);
          }

        })

        // 加载中
        this.setState({
          loadPrev: false
        })

        if(data.length === 0){
          reject()
          return ;
        } 
        // 权限过滤
        let authList = filterListAuth(arr, userUID);

        this.page_number += 1;

        let arrList = authList.sort((a, b) => a.time - b.time)


        // 保存历史数据
        dispatch({
          type: "im/updateStateFieldByCover",
          payload: {
            [key]: arrList
          }
        })
        resolve(authList);
        // 正在加载，加上load锁
        setTimeout(() => {
          this.isLoading = false;
        }, 100)
      })
    })
  }
  // 加载下一页数据
  loadPrev = () => {
    if (!this.isLoading) {
      let keys = Object.keys(this.props).filter(item => item.indexOf('history_') != -1);
      let data = keys[keys.length - 1];
      this.getHistory().then(_ => {
        // console.log(_)
        // let current = this.props[data][this.props[data].length - 1 ];
        if(_.length){
          let current = _[_.length - 1]
          this.setCurrentIdServer(current);
        }
      }).catch(err => {
        // else{
          Taro.showToast({
            title: '没有更多数据了',
            icon: 'none',
            duration: 2000
          });
        // }
      });
    }

  }
  setCurrentIdServer = (data) => {
    let key = "";
    if (data) {
      key = 'item_' + data.idServer
    }
    this.setState({
      scrollIntoViewEleId: key
    })
  }
  // 加载下一页
  loadNext = () => {

  }

  componentDidMount() {
    this.getHistory().then(data => {
      if(data.length < 8){
        this.getHistory().then(res => {
          this.setCurrentIdServer(data[data.length - 1])
        })
      }else{
        this.setCurrentIdServer(data[data.length - 1])
      }

    });
    Taro.getSystemInfo({
      success: (res) => {
        if (res.model.indexOf('iPhone X') > -1 || res.model.indexOf('iPhone 11') > -1) {
          this.setState({
            isIosHomeIndicator: true
          })
        }
      }
    })
    this.setState({
      firstIn: false
    })
    // Taro.pageScrollTo({
    //   scrollTop: 100000,
    //   duration: 100,
    // })
  }
  componentWillReceiveProps(nextProps) {
    //这里接收到的nextProps的值是有问题的
    //导致更新现有消息的消息列表只能在 nim 的  onMsg 的方法回调中处理
    let { history_newSession, userUID } = nextProps;
    if (history_newSession.length) {
      let obj = history_newSession[history_newSession.length - 1];
      if (this.IsBottom || obj.from === userUID)
        this.setCurrentIdServer(obj);
      else if (!this.IsBottom && obj.from != userUID && (this.props.history_newSession.length != history_newSession.length)) {
        this.setState({
          newMsg: true
        })
      }
    }
    //解决长按文件进入聊天页面, 不显示聊天消息列表, 此生命周期里重新渲染一遍
    this.handleGenSessionListWhenToggleIsOnlyShowInform(
      false)
  }

  //通过from字段从群组用户中去查找头像
  getAvatar = (val) => {
    let { currentGroup } = this.props;
    let { from } = val;
    let { users = [] } = currentGroup;
    for (let i = 0; i < users.length; i++) {
      let item = users[i];
      if (item.user_id == from) {
        return item.avatar;
      }
    }
    return "";
  }

  componentDidShow() {

    // const pageSource_chat = Taro.getStorageSync('pageSource_chat')
    let getCurrentGroupSessionList = []
    // if (pageSource_chat === 'chat') {
    // Taro.removeStorageSync('pageSource_chat')
    getCurrentGroupSessionList = this.genCurrentGroupSessionList()
    for (var i = getCurrentGroupSessionList.length - 1; i >= 0; i--) {
      if (getCurrentGroupSessionList[i].status === 'fail') {
        getCurrentGroupSessionList.splice(i, 1);
      }
    }
  }
  onScrolltolower = () => {
    this.IsBottom = true;
    let { loadNext } = this.props;
    // loadNext && loadNext()
    // 清除有新消息按钮
    this.setState({
      newMsg: false
    })
  }
  renderList = () => {
    let keys = [...Object.keys(this.props)];
    // console.log(keys)
    keys = keys.filter(item => item.indexOf('history_') != -1);
    return keys;
  }
  readNewMsg = () => {
    let { history_newSession } = this.props;
    this.setState({
      newMsg: false
    })
    this.setCurrentIdServer(history_newSession[0]);
  }

  render() {
    const {
      currentGroupSessionList,
      isOnlyShowInform,
      isUserInputHeightChange,
    } = this.props;
    const { scrollIntoViewEleId, chatConetntViewHeightStyle, isIosHomeIndicator, firstIn, loadPrev, newMsg } = this.state;

    return (
      <ScrollView
        id='chatContent'
        className={[styles.wrapper, isIosHomeIndicator === false ? styles.maxHeight : styles.minHeight].join(" ")}
        // className={`${styles.wrapper} ${true ? styles.minHeight : styles.maxHeight}`}
        scrollY
        scrollWithAnimation={!firstIn}
        lowerThreshold={20}
        upperThreshold={0}
        onScrolltoupper={this.onScrolltoupper}
        onScroll={this.onScroll}
        onScrolltolower={this.onScrolltolower}
        enableBackToTop
        scrollIntoView={scrollIntoViewEleId}
        onTouchStart={this.onScrollViewTouchStart}
        onTouchEnd={this.onScrollViewTouchEnd}
        style={chatConetntViewHeightStyle}
      >
        {loadPrev && <View className={styles.loadMoreChat}>加载中...</View>}
        {/* <View
          className={`${globalStyles.global_iconfont} ${
            styles.filterInformWrapper
            }`}
          style={{
            color: isOnlyShowInform ? '#1890FF' : '#595959'
          }}
          onClick={() =>
            this.handleGenSessionListWhenToggleIsOnlyShowInform(
              !isOnlyShowInform
            )
          }
        >
          &#xe645;
        </View> */}

        <View
          className={styles.contentWrapper}
          style={{
            paddingBottom: isUserInputHeightChange
              ? isUserInputHeightChange + 'px'
              : '0px'
          }}
        >   {this.renderList().map((item, key) => {
          return (
            <View key={item}>
              {
                this.props[item].map((i, index, arr) => {                  
                  return (
                    <View className={styles.chatItemWrapper} key={i.time} id={'item_' + i.idServer}>
                      {this.isShouldShowTimestamp(index, arr) && (
                        <ChatItem type='timestamp' time={i.time} />
                      )}
                      <ChatItem
                        flow={i.flow}
                        fromNick={i.fromNick}
                        avatar={this.getAvatar(i)}
                        // avatar={i.avatar}
                        status={i.status}
                        time={i.time}
                        type={i.type}
                        text={i.text}
                        file={i.file}
                        content={i.content}
                        pushContent={i.pushContent}
                        groupNotification={i.groupNotification}
                        someMsg={i}
                      />
                    </View>
                  );
                })
              }
            </View>
          )
        })}

        </View>
        <View id={scrollIntoViewEleId} className={styles.scrollToBottomIdEle} />
        {newMsg && <View className={styles.hasNewMsg} onClick={this.readNewMsg}>有新消息<Text className={`${globalStyles.global_iconfont}`} style={{ marginLeft: '5px' }}>&#xe642;</Text></View>}
      </ScrollView>
    );
  }
}

export default ChatContent;
