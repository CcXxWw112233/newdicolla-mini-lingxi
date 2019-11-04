import Taro, { Component, navigateBack } from '@tarojs/taro';
import { View } from '@tarojs/components';
import styles from './index.scss';
import ChatHeader from './components/ChatHeader.js';
import ChatContent from './components/ChatContent.js';
import UserInput from './components/UserInput.js';
import { connect } from '@tarojs/redux';

@connect(({
  chat: { }
}) => ({}))

class Chat extends Component {

  state = {
  }

  componentWillMount() { }

  config = {
    disableScroll: true //页面整体不能上下滚动
  };

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
  render() {

    return (
      <View>
        <View className={styles.wrapper} onClick={this.inputDown}>
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
      </View>
    );
  }
}

export default Chat;
