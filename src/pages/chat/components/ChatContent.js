import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import styles from './ChatContent.scss';
import ChatItem from './ChatItem.js';
import { connect } from '@tarojs/redux';
import { isPlainObject } from './../../../utils/util';
import {
  genNews,
  isValidMsg,
  isActivityCustomNews,
  isPinupEmojiNews,
  isNotificationNews
} from './../../../models/im/utils/genNews.js';
import globalStyles from './../../../gloalSet/styles/globalStyles.scss';

@connect(
  ({
    im: {
      currentChatTo,
      sessionlist,
      currentBoard,
      currentGroupSessionList,
      rawMessageList,
      isOnlyShowInform
    },
    chat: { isUserInputFocus, isUserInputHeightChange }
  }) => ({
    currentChatTo,
    sessionlist,
    currentBoard,
    currentGroupSessionList,
    rawMessageList,
    isOnlyShowInform,
    isUserInputFocus,
    isUserInputHeightChange
  }),
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
      scrollIntoViewEleId: '' //设置scrollView 自动滚动属性
    };
    //是否正在 touch 聊天列表
    this.isTouchingScrollView = false;
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
  };
  onScroll = () => {
    console.log('on scroll...........................');
  };
  onScrollViewTouchStart = () => {
    this.setState(
      {
        scrollIntoViewEleId: ''
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
      scrollIntoViewEleId: ''
    });
    const { currentGroupSessionList, isUserInputHeightChange } = this.props;
    if (nextIsUserInputHeightChange !== isUserInputHeightChange) {
      this.setState({
        scrollIntoViewEleId: 'scroll_bottom_id'
      });
    }
    if (isUserInputFocus) {
      this.setState({
        scrollIntoViewEleId: 'scroll_bottom_id'
      });
    }
    if (currentGroupSessionList.length !== nextCurrentGroupSessionList.length) {
      if (!this.isTouchingScrollView) {
        this.setState({
          scrollIntoViewEleId: 'scroll_bottom_id'
        });
      }
    }
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
      currentMsg.time &&
      prevMsg.time &&
      currentMsg.time >= prevMsg.time + timeBetween
    ) {
      return true;
    }
    return false;
  };
  handleGenSessionListWhenToggleIsOnlyShowInform = flag => {
    const { dispatch, toggleIsOnlyShowInform } = this.props;
    Promise.resolve(toggleIsOnlyShowInform(flag)).then(() => {
      dispatch({
        type: 'im/updateStateFieldByCover',
        payload: {
          currentGroupSessionList: this.genCurrentGroupSessionList()
        },
        desc: 'init currentGroupSessionList'
      });
    });
  };
  componentWillReceiveProps(nextProps) {
    //这里接收到的nextProps的值是有问题的
    //导致更新现有消息的消息列表只能在 nim 的  onMsg 的方法回调中处理
    this.updateScrollViewPosition(nextProps);
  }
  componentDidShow() {
    // 当进入聊天页面的时候，生成该群或者对话的聊天信息流

    const { dispatch } = this.props;
    dispatch({
      type: 'im/updateStateFieldByCover',
      payload: {
        currentGroupSessionList: this.genCurrentGroupSessionList()
      },
      desc: 'init currentGroupSessionList'
    });
  }
  render() {
    const {
      currentGroupSessionList,
      isOnlyShowInform,
      isUserInputHeightChange
    } = this.props;
    const { scrollIntoViewEleId } = this.state;

    return (
      <ScrollView
        className={styles.wrapper}
        scrollY
        scrollWithAnimation
        lowerThreshold={20}
        upperThreshold={20}
        onScrolltoupper={this.onScrolltoupper}
        onScroll={this.onScroll}
        enableBackToTop
        scrollIntoView={scrollIntoViewEleId}
        onTouchStart={this.onScrollViewTouchStart}
        onTouchEnd={this.onScrollViewTouchEnd}
      >
        <View
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
        </View>
        <View
          className={styles.contentWrapper}
          style={{
            paddingBottom: isUserInputHeightChange
              ? isUserInputHeightChange + 'px'
              : '0px'
          }}
        >
          {currentGroupSessionList.map((i, index, arr) => {
            return (
              <View className={styles.chatItemWrapper} key={i.time}>
                {this.isShouldShowTimestamp(index, arr) && (
                  <ChatItem type='timestamp' time={i.time} />
                )}
                <ChatItem
                  flow={i.flow}
                  fromNick={i.fromNick}
                  avatar={i.avatar}
                  status={i.status}
                  time={i.time}
                  type={i.type}
                  text={i.text}
                  file={i.file}
                  content={i.content}
                  pushContent={i.pushContent}
                  groupNotification={i.groupNotification}
                />
              </View>
            );
          })}
        </View>
        <View id='scroll_bottom_id' className={styles.scrollToBottomIdEle} />
      </ScrollView>
    );
  }
}

export default ChatContent;
