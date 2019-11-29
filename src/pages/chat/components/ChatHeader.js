import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import styles from './ChatHeader.scss';
import globalStyles from './../../../gloalSet/styles/globalStyles.scss';
import { connect } from '@tarojs/redux';

@connect(({ im: { currentGroup } }) => ({
  currentGroup
}))
class ChatHeader extends Component {
  onShowBoardDetail = e => {
    if (e) e.stopPropagation();
    Taro.navigateTo({
      url: `/pages/chatDetail/index`
    })
  };
  render() {
    const { currentGroup: { name = '未知群名' } = {} } = this.props;
    return (
      <View className={styles.wrapper}>
        <View className={styles.contentWrapper}>
          <Text className={styles.title}>{name}</Text>
          <View
            className={styles.operatorWrapper}
            onClick={this.onShowBoardDetail}
          >
            <View
              className={`${globalStyles.global_iconfont} ${styles.operator}`}
            >
              &#xe63f;
            </View>
          </View>
        </View>
      </View>
    );
  }
}

ChatHeader.defaultProps = {
  currentGroup: {} //当前的群信息
};

export default ChatHeader;
