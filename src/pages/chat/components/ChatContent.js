import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import styles from './ChatContent.scss';
import ChatItem from './ChatItem.js';
import { connect } from '@tarojs/redux';
import { isPlainObject } from './../../../utils/util';
import { genNews, isValidMsg } from './../../../models/im/utils/genNews.js';
@connect(
  ({
    im: {
      currentChatTo,
      sessionlist,
      currentBoard,
      currentGroupSessionList,
      rawMessageList
    }
  }) => ({
    currentChatTo,
    sessionlist,
    currentBoard,
    currentGroupSessionList,
    rawMessageList
  })
)
class ChatContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollIntoViewEleId: ''
    };
    //是否正在 touch 聊天列表
    this.isTouchingScrollView = false;
  }
  genCurrentGroupSessionList = () => {
    const { currentChatTo, rawMessageList, currentBoard } = this.props;
    return rawMessageList[currentChatTo] &&
      isPlainObject(rawMessageList[currentChatTo])
      ? Object.values(rawMessageList[currentChatTo])
          .filter(msg => isValidMsg(msg, currentChatTo))
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
    console.log('touch end.........................................');
  };
  updateScrollViewPosition = nextProps => {
    const { currentGroupSessionList: nextCurrentGroupSessionList } = nextProps;
    const { currentGroupSessionList } = this.props;
    if (currentGroupSessionList.length !== nextCurrentGroupSessionList.length) {
      if (!this.isTouchingScrollView) {
        this.setState(
          {
            scrollIntoViewEleId: 'scroll_bottom_id'
          },
          () => {
            this.setState({
              scrollIntoViewEleId: ''
            });
          }
        );
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
  componentWillReceiveProps(nextProps) {
    //这里接收到的nextProps的值是有问题的
    //导致更新现有消息的消息列表只能在 nim 的  onMsg 的方法回调中处理
    this.updateScrollViewPosition(nextProps);
  }
  componentDidShow() {
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
    const { currentGroupSessionList } = this.props;
    const { scrollIntoViewEleId } = this.state;

    return (
      <ScrollView
        className={styles.wrapper}
        scrollY
        scrollWithAnimation
        scrollTop={0}
        lowerThreshold={20}
        upperThreshold={20}
        onScrolltoupper={this.onScrolltoupper}
        onScroll={this.onScroll}
        enableBackToTop={true}
        scrollIntoView={scrollIntoViewEleId}
        onTouchStart={this.onScrollViewTouchStart}
        onTouchEnd={this.onScrollViewTouchEnd}
      >
        <View className={styles.contentWrapper}>
          {currentGroupSessionList.map((i, index, arr) => {
            return (
              <View className={styles.chatItemWrapper} key={i.time}>
                {this.isShouldShowTimestamp(index, arr) && (
                  <ChatItem type="timestamp" time={i.time} />
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
                />
              </View>
            );
          })}
        </View>
        <View id="scroll_bottom_id" className={styles.scrollToBottomIdEle} />
      </ScrollView>
    );
  }
}

export default ChatContent;
