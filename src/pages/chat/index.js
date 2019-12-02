import Taro, { Component, navigateBack } from '@tarojs/taro';
import { View } from '@tarojs/components';
import styles from './index.scss';
import ChatHeader from './components/ChatHeader.js';
import ChatContent from './components/ChatContent.js';
import UserInput from './components/UserInput.js';
import FileChat from './components/fileChat.js';
import { connect } from '@tarojs/redux';

@connect(({
  chat: { }, file: { isShowFileComment }
}) => ({
  isShowFileComment,
}))

class Chat extends Component {

  state = {
    file_info: {},
    page_source: '',
  }

  componentDidMount() {
    const { fileInfo, pageSource, } = this.$router.params
    this.setState({
      file_info: fileInfo && JSON.parse(fileInfo),
      page_source: pageSource,
    })
  }

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

    const { file_info = {}, page_source } = this.state
    const { isShowFileComment } = this.props

    return (
      <View className={styles.wrapper} onClick={this.inputDown}>
        {
          isShowFileComment === true && page_source && page_source === 'isFileComment' ? (<FileChat fileInfo={file_info} />
          ) : ''
        }
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
    );
  }
}

export default Chat;


// FileChat.defaultProps = {
//   fileInfo: '',    //文件信息
//   pageSource: '',   //页面来源
// }
