import Taro, { Component, navigateBack } from '@tarojs/taro';
import { View } from '@tarojs/components';
import styles from './index.scss';
import ChatHeader from './components/ChatHeader.js';
import ChatContent from './components/ChatContent.js';
import UserInput from './components/UserInput.js';
import { connect } from '@tarojs/redux';

@connect(({
  chat:{}
})=>({}),)

class Chat extends Component {

  state = {

  }

  componentWillMount () {
    const sourcePage = this.$router.params;  
    this.setState({
      sourcePage
    }) 
  }

  componentWillUnmount () {
    //利用小程序的生命周期,当页面卸载的时候,跳转到指定的界面
    const { sourcePage } = this.state
    if (sourcePage.push === 'auccessJoin') { //关闭所有页面,打开首页
      Taro.switchTab({url: `../../pages/calendar/index`
      })
    }
  }

  config = {
    disableScroll: true //页面整体不能上下滚动
  };

  inputDown = (e) => {
    const { dispatch} = this.props;
    dispatch({
      type: 'chat/updateStateFieldByCover',
      payload: {
        handleInputMode: 'text'
      },
      desc: 'handleInputDown'
    });
    console.log('ssssss','out');
  }
  inputDownChild = (e) => {
    e.stopPropagation();
  }
  render() {
    return (
      <View className={styles.wrapper} onClick ={this.inputDown}>
        <View className={styles.headerWraper}>
          <ChatHeader />
        </View>
        <View className={styles.chatContentWrapper}>
          <ChatContent />
        </View>
        <View className={styles.userInputWrapper}  onClick = {this.inputDownChild}>
          <UserInput  />
        </View>
      </View>
    );
  }
}

export default Chat;
