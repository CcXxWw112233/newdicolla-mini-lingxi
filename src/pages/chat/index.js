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
    isIphoneX: false, //是否iPhone X及以上设备
  }

  componentDidMount() {
    try {
      var res = Taro.getSystemInfoSync()
      console.log(res, 'ssss111');
      if (res.platform === "devtools") {
        this.setState({
          isIphoneX: true
        })
        if (res.system >= 11.0) {
          if (model.search('iPhone X') != -1 && model.search('iPhone 11') != -1) {
            // this.setState({
            //   isIphoneX: true
            // })
          }
        }
      }
    } catch (e) {

    }
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
    const { isIphoneX } = this.state
    console.log(isIphoneX, 'ssss');

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
        {
          isIphoneX === 'true' ? (<View className={styles.bottomView}></View>
          ) : ''
        }
      </View>
    );
  }
}

export default Chat;
