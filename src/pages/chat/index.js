import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import styles from './index.scss';
import ChatHeader from './components/ChatHeader.js';
import ChatContent from './components/ChatContent.js';
import UserInput from './components/UserInput.js'

@connect(
  ({ im: { currentGroup } }) => ({
    currentGroup
  }))
class Chat extends Component {

  componentWillMount() {}
  componentWillUnmount() {

  }
  componentDidHide() {

  }
  onPullDownRefresh() {
    //监听用户下拉刷新事件
  }
  onReachBottom() {
    //监听用户上拉触底事件
  }
  onPageScroll() {
    //监听用户滑动页面事件
  }
  render() {
    return (
      <View className={styles.wrapper}>
        <View className={styles.headerWraper}>
          <ChatHeader />
        </View>
        <View className={styles.chatContentWrapper}>
          <ChatContent />
        </View>
        <View className={styles.userInputWrapper}>
          <UserInput />
        </View>
      </View>
    );
  }
}

export default Chat;
