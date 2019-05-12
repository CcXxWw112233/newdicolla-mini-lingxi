import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import styles from './ChatItem.scss';
import globalStyles from './../../../gloalSet/styles/globalStyles.scss';

class ChatItem extends Component {
  isValidImgUrl = url => {
    return /^http[s]?:/.test(url);
  };
  render() {
    const { flow, fromNick, avatar, type, text } = this.props;
    return (
      <View className={styles.wrapper}>
          <View className={`${styles.contentWrapper} ${ flow === 'in' ? styles.contentWrapperIn : styles.contentWrapperOut}`}>
            <View className={styles.avatarWrapper}>
              {this.isValidImgUrl(avatar) ? (
                <Image src={avatar} className={`${styles.avatar}`} />
              ) : (
                <View
                  className={`${globalStyles.global_iconfont} ${styles.avatar}`}
                  style={{
                    fontSize: '36px',
                    borderRadius: '50%'
                  }}
                >
                  &#xe647;
                </View>
              )}
            </View>
            <View className={styles.newsWrapper}>
              {flow === 'in' &&<View className={styles.newsName}>{fromNick}</View>}
              <View className={styles.newsContentWrapper}>
                {type === 'text' && (
                  <View className={styles.newContent}>{text}</View>
                )}
                <View className={styles.newsContentBubble} />
              </View>
            </View>
          </View>

      </View>
    );
  }
}

ChatItem.defaultProps = {
  flow: '', //消息的来源： 收到别人的消息：in | 自己发出的消息 out
  fromNick: '', //发消息人的 nick name
  avatar: '', //消息人头像
  status: 'success', //是否发送成功
  time: 0, //时间
  type: 'text', //消息类型
  text: '' //消息内容
};

export default ChatItem;
