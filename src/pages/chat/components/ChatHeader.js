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
    let { onTapBoardName } = this.props;
    onTapBoardName && onTapBoardName();
  };
  onGoToSubChatList = ()=>{
    let { currentGroup } = this.props;
    Taro.navigateTo({
      url: `/pages/subBoardChat/index`
    })
    wx.setNavigationBarTitle({
      title: currentGroup.name
    })
    console.log(this.props)
    console.log('打开子圈列表')
  }
  render() {
    const { currentProject: { name = '未知群名',subUnread = 0 } = {} , hideSubList ,currentProject} = this.props;
    return (
      <View className={styles.wrapper}>
        <View className={styles.contentWrapper}>
          <View className={`${styles.title} ${globalStyles.global_iconfont}`} onClick={this.onShowBoardDetail}>
            <Text className={currentProject.mark ? globalStyles.global_itemMark : ""}
            style={{backgroundColor: currentProject.mark ? currentProject.mark :""}}></Text>
            {name}
            &#xe8ed;
          </View>
          {!hideSubList &&
          <View
            className={styles.operatorWrapper}
            onClick={this.onGoToSubChatList}>
            <View
              className={`${globalStyles.global_iconfont} ${styles.operator}`}
            >
              {subUnread  && <View className={styles.badge}>
                { subUnread > 99 ? '99+' : subUnread }
                </View>}
                &#xe6ec;
            </View>
          </View>}

        </View>
      </View>
    );
  }
}

ChatHeader.defaultProps = {
  currentProject: {} //当前的群信息
};

export default ChatHeader;
