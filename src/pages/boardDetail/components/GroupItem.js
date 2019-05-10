import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import {AtIcon } from 'taro-ui'
import styles from './GroupItem.scss';
import Avatar from './Avatar';

class GroupItem extends Component {
  render() {
    const {
      avatarList,
      label,
      name,
      lastMsg,
      newsNum,
      showNewsDot,
      isSubGroup
    } = this.props;
    console.log(avatarList, '============== label ====================')
    return (
      <View className={styles.wrapper} style={{paddingLeft: isSubGroup ? '32px' : '17px', paddingRight: isSubGroup ? '32px' : '17px'}}>
        <View className={styles.contentWrapper}>
          <View className={styles.avatarWrapper}>
            <Avatar urlList={avatarList} value={newsNum} showDot={showNewsDot} />
          </View>
          <View className={styles.groupInfoWrapper}>
            <View className={styles.groupInfoTitleWrapper}>
              <View className={styles.groupInfoTItleLabel}>{label}</View>
              <View className={styles.groupInfoTItleTitle}>{name}</View>
            </View>
            <View className={styles.groupInfoLastMsg}>{lastMsg}</View>
          </View>
          {!isSubGroup && <View className={styles.operatorWrapper}>
            <View className={styles.operator}>
            <AtIcon value='chevron-up' size='20' />
            </View>
          </View>}
        </View>
      </View>
    );
  }
}

GroupItem.defaultProps = {
  avatarList: [], //头像 url 字符串数组, 1 - 5 个
  label: '', //群类型
  name: '', //群名称
  lastMsg: '',
  newsNum: 0, //新消息数量
  showNewsDot: false, //是否显示消息红点
  //最后一条消息，消息类型需要父组件处理，这里只接收结果字符串，
  //比如说消息类型是 text 时可以直接显示消息内容，如果是图片或者表情或者文件等其他内容时，需要另外的显示方式
  isSubGroup: false //是否为子群组，外层的群组和子群组的样式有区别
};

export default GroupItem;
