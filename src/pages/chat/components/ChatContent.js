import Taro, { Component } from '@tarojs/taro';
import { View, ScrollView } from '@tarojs/components';
import styles from './ChatContent.scss';
import ChatItem from './ChatItem.js';
import { connect } from '@tarojs/redux';

@connect(
  ({
    im: { currentChatTo, sessionlist, currentBoard, currentGroupSessionList }
  }) => ({
    currentChatTo,
    sessionlist,
    currentBoard,
    currentGroupSessionList
  })
)
class ChatContent extends Component {
  getAvatarByFromNick = nick => {
    const { currentBoard } = this.props;
    let ret =
      currentBoard && currentBoard.users.find(i => i.full_name === nick);
    return ret ? ret.avatar : '';
  };
  mapSessionToNews = ({
    updateTime,
    lastMsg: { flow, fromNick, status, type, text }
  }) => {
    return {
      flow,
      fromNick,
      avatar: this.getAvatarByFromNick(fromNick),
      status,
      time: updateTime,
      type,
      text
    };
  };
  genCurrentGroupSessionList = () => {
    const { currentChatTo, sessionlist } = this.props;
    //生成当前的聊天信息
    return sessionlist
      .filter(i => i.id === currentChatTo)
      .map(this.mapSessionToNews)
      .sort((a, b) => a.updateTime - b.updateTime);
  };
  updateCurrentGroupSessionList = (nextSessionlist, sessionlist) => {
    const { currentChatTo, currentGroupSessionList } = this.props;
    const currentGroupSessionListLen = currentGroupSessionList.length;
    //list 按时间倒序排列
    return nextSessionlist
      .filter(i => i.id === currentChatTo)
      .sort((a, b) => a.updateTime - b.updateTime)
      .filter((_, ind) => ind >= currentGroupSessionListLen)
      .map(this.mapSessionToNews)
      .sort((a, b) => a.updateTime - b.updateTime);
  };
  onScrolltoupper = () => {
    console.log('chat content on scroll to upper...')
  }
  onScroll = () => {
    console.log('on scroll...........................')
  }
  updateCurrentGroupSessionListWhenSessionlistChange = nextProps => {
    const { sessionlist: nextSessionlist } = nextProps;
    const { sessionlist, dispatch } = this.props;
    const isArrChange = (arr1 = [], arr2 = []) => arr1.length !== arr2.length;
    if (isArrChange(sessionlist, nextSessionlist)) {
      dispatch({
        type: 'im/updateStateFieldByExtension',
        payload: {
          currentGroupSessionList: this.updateCurrentGroupSessionList(
            nextSessionlist,
            sessionlist
          )
        },
        desc: 'update current group sessionlist'
      });
    }
  };
  componentWillReceiveProps(nextProps) {
    this.updateCurrentGroupSessionListWhenSessionlistChange(nextProps);
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
        >
        {currentGroupSessionList.map(i => (
          <View className={styles.ChatItemWrapper} key={i.time}>
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
      </ScrollView>
    );
  }
}

export default ChatContent;
