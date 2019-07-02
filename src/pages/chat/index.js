import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import styles from './index.scss';
import ChatHeader from './components/ChatHeader.js';
import ChatContent from './components/ChatContent.js';
import UserInput from './components/UserInput.js';
import { connect } from '@tarojs/redux';

@connect(({
  chat:{chatContentHeightStyle}
})=>({chatContentHeightStyle}),)

class Chat extends Component {
  config = {
    disableScroll: true //页面整体不能上下滚动
  };
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
