import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import ChatHeader from './components/ChatHeader.js'
import styles from './index.scss'

class Chat extends Component {
  componentDidHide() {
    //退出聊天页的时候需要，重置 currentChatTo 为 ''

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
    return(<View className={styles.wrapper}>
      <View className={styles.headerWraper}>
      <ChatHeader />
      </View>
    </View>)
  }
}

export default Chat
