import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import styles from './ChatDetail.scss';
import globalStyles from './../../../gloalSet/styles/globalStyles.scss';
import AvatarList from './components/AvatarList.js'


@connect(({ im: { currentGroup } }) => ({
  currentGroup
}))
class ChatDetail extends Component {
  onShowBoardDetail = e => {
    if (e) e.stopPropagation();
  };
  setNavigationBarTitle = () => {
    const { currentGroup: { name = '未知群名' } = {} } = this.props;
    Taro.setNavigationBarTitle({title: name.substring(0, 15)})
  }
  componentWillMount() {
    this.setNavigationBarTitle()

  }
  render() {
    const { currentGroup: { users = [] } = {} } = this.props;
    const avatarList = users.map(i => ({id: i.id, name: i.full_name, avatar: i.avatar}))
    return (
      <View>
        <AvatarList avatarList={avatarList} />
        {/* <View className={styles.contentWrapper}>
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
        </View> */}
      </View>
    );
  }
}

ChatDetail.defaultProps = {
  currentGroup: {} //当前的群信息
};

export default ChatDetail;
