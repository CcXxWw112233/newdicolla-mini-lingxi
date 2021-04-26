import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import styles from './index.scss';
import AvatarList from './components/AvatarList.js';
import DetailItem from './components/DetailItem.js';

@connect(({ im: { currentBoardDetail } }) => ({
  currentBoardDetail
}))
class ChatDetail extends Component {
  handleShowAllGroupMember = () => {
    // this.pageJump('/pages/groupMember/index')
  };
  handleTurnToHistoryPage = () => {
    console.log('should show history page.');
  };
  pageJump = url => {
    if (!url) return
    Taro.navigateTo({
      url,
    })
  }
  setNavigationBarTitle = () => {
    const { currentBoardDetail: { name = '未知群名' } = {} } = this.props;
    Taro.setNavigationBarTitle({ title: name.substring(0, 15) });
  };
  componentWillMount() {
    this.setNavigationBarTitle();
  }
  render() {
    const { currentBoardDetail: { users = [], name = '未知群名' } = {} } = this.props;
    const avatarList = users.map(i => ({
      id: i.id,
      name: i.name,
      avatar: i.avatar
    }));

    return (
      <View>
                <View className={styles.bgView}>

      <View className={styles.wrapper}>
        <View className={styles.avatarWrapper}>
          <AvatarList
            avatarList={avatarList}
            onShowAll={this.handleShowAllGroupMember}
            shouldShowAvatarMax={2}
            name={name}
            isshowAdd={true}
          />
        </View>
        {/* <View className={styles.historyWrapper}>
          <DetailItem
            itemText='查找聊天记录'
            onItemClick={this.handleTurnToHistoryPage}
            isCanOperator
          />
        </View>
        <View className={styles.groupDetailItemWrapper}>
          <DetailItem
            itemTextKeyValue={['群聊名称:', name]}
            isCanOperator={false}
            isShowBottomBorder
          /> */}
          {/* <DetailItem
            itemTextKeyValue={['人数:', users.length]}
            isCanOperator={false}
          /> */}
          {/* <View className={styles.hackAFuckingBorderBottom}></View> */}
        {/* </View> */}
      </View>
      </View>
      </View>
    );
  }
}

ChatDetail.defaultProps = {
  currentBoardDetail: {} //当前的群信息
};

export default ChatDetail;
