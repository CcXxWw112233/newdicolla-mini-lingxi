import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import styles from './ChatContent.scss';
import ChatItem from './ChatItem.js';
import { connect } from '@tarojs/redux';
import { isPlainObject } from './../../../utils/util';

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
    this.isTouchingScrollView = false;
  }

  getAvatarByFromNick = nick => {
    const { currentBoard } = this.props;
    let ret =
      currentBoard && currentBoard.users.find(i => i.full_name === nick);
    return ret ? ret.avatar : '';
  };
  mapSessionToNews = ({ time, flow, fromNick, status, type, text }) => {
    return {
      flow,
      fromNick,
      avatar: this.getAvatarByFromNick(fromNick),
      status,
      time,
      type,
      text
    };
  };
  genCurrentGroupSessionList = () => {
    const { currentChatTo, rawMessageList, sessionlist } = this.props;
    console.log(
      currentChatTo,
      '========================== currentChatTo ========================='
    );
    return rawMessageList[currentChatTo] &&
      isPlainObject(rawMessageList[currentChatTo])
      ? Object.values(rawMessageList[currentChatTo]).map(this.mapSessionToNews)
      : [];
    //生成当前的聊天信息
    return sessionlist
      .filter(
        i =>
          i.id === currentChatTo && i.lastMsg && i.lastMsg.status === 'success'
      )
      .map(this.mapSessionToNews)
      .sort((a, b) => a.updateTime - b.updateTime);
  };
  updateCurrentGroupSessionList = nextRawMessageList => {
    const { currentGroupSessionList, currentChatTo } = this.props;
    const len = currentGroupSessionList.length;
    if (!nextRawMessageList[currentChatTo]) return [];
    return Object.values(nextRawMessageList[currentChatTo])
      .filter((_, ind) => ind >= len)
      .map(this.mapSessionToNews);
  };
  // updateCurrentGroupSessionList = (nextSessionlist, sessionlist) => {
  //   const { currentChatTo, currentGroupSessionList } = this.props;
  //   const currentGroupSessionListLen = currentGroupSessionList.length;
  //   //list 按时间倒序排列
  //   return nextSessionlist
  //     .filter(
  //       i =>
  //         i.id === currentChatTo && i.lastMsg && i.lastMsg.status === 'success'
  //     )
  //     .filter((_, ind) => ind >= currentGroupSessionListLen)
  //     .map(this.mapSessionToNews)
  //     .sort((a, b) => a.updateTime - b.updateTime);
  // };
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
  updateCurrentGroupSessionListWhenCurrentGroupRawMessageListChange = nextProps => {
    const { rawMessageList: nextRawMessageList } = nextProps;
    const { dispatch } = this.props;

    Promise.resolve(
      dispatch({
        type: 'im/updateStateFieldByExtension',
        payload: {
          currentGroupSessionList: this.updateCurrentGroupSessionList(
            nextRawMessageList
          )
        },
        desc: 'update current group sessionlist'
      })
    ).then(() => {

    });
  };
  updateScrollViewPosition = () => {
    if (!this.isTouchingScrollView) {
      this.setState({
        scrollIntoViewEleId: 'scroll_bottom_id'
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    //这里接收到的nextProps的值是有问题的
    //导致更新现有消息的消息列表只能在 nim 的  onMsg 的方法回调中处理
    this.updateScrollViewPosition()
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
          {currentGroupSessionList.map(i => (
            <View className={styles.chatItemWrapper} key={i.time}>
              <ChatItem
                flow={i.flow}
                fromNick={i.fromNick}
                avatar={i.avatar}
                status={i.status}
                time={i.time}
                type={i.type}
                text={i.text}
              />
            </View>
          ))}
        </View>
        <View id="scroll_bottom_id" className={styles.scrollToBottomIdEle} />
      </ScrollView>
    );
  }
}

export default ChatContent;
