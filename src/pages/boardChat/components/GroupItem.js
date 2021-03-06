import Taro, { Component } from '@tarojs/taro';
import { View, Text, } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import styles from './GroupItem.scss';
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import Avatar from './Avatar';

class GroupItem extends Component {
  handleClickedOperator = e => {
    if (e) e.stopPropagation();
    const { isExpand, onExpandChange } = this.props;
    onExpandChange(!isExpand);
  };
  handleClickedGroupItem = ({ board_id, im_id }, e) => {
    const { onClickedGroupItem } = this.props;
    if (e) e.stopPropagation();
    onClickedGroupItem && onClickedGroupItem({ board_id, im_id });

  };
  apnsAtMe = (apns) => {
    let { userid } = this.props;
    if (apns) {
      if (apns.accounts && apns.accounts.indexOf(userid) != -1) {
        return true;
      }
    }
    return false;
  }
  render() {
    const {
      board_id,
      org_name,
      im_id,
      avatarList,
      name,
      lastMsg,
      newsNum,
      showNewsDot,
      isSubGroup,
      isExpand,
      isShouldShowExpandOpertor,
      data = {},
      apns
    } = this.props;

    return (
      <View
        className={styles.wrapper}
        style={{
          paddingLeft: isSubGroup ? '32px' : '17px',
          paddingRight: isSubGroup ? '32px' : '17px'
        }}
      >
        <View
          className={styles.contentWrapper}
          onClick={e => this.handleClickedGroupItem({ board_id, im_id }, e)}
        >
          <View className={styles.avatarWrapper}>
            <Avatar
              urlList={avatarList}
              value={newsNum < 0 ? 0 : newsNum}
              showDot={showNewsDot}
            />
          </View>
          <View className={styles.groupInfoWrapper}>
            <View className={styles.groupInfoTitleWrapper}>
              <View className={styles.groupInfoTitleTitle}><Text className={data.mark ? globalStyle.global_itemMark : ""} style={{ backgroundColor: data.mark ? data.mark : "" }}></Text> {name}</View>
              {org_name && <View className={styles.groupInfoTitleOrg}>{'#'}{org_name}</View>}
            </View>
            <View className={styles.groupInfoLastMsg}>
              {this.apnsAtMe(apns) && <Text className={styles.apnsAtMe}>[有人@我]</Text>} {lastMsg && lastMsg.replace(/<\/?[^>]*>/g, '\n')}
            </View>
          </View>
          {!isSubGroup && isShouldShowExpandOpertor && (
            <View
              className={styles.operatorWrapper}
              onClick={this.handleClickedOperator}
            >
              <View className={styles.operator}>
                {isExpand ? (
                  <AtIcon value="chevron-up" size="20" />
                ) : (
                    <AtIcon value="chevron-down" size="20" />
                  )}
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }
}

// GroupItem.defaultProps = {
//   board_id: '', //项目 id
//   org_name: '', //组织名称
//   im_id: '', //项目对应的 群 id
//   avatarList: [], //头像 url 字符串数组, 1 - 5 个
//   name: '', //群名称
//   lastMsg: '',
//   newsNum: 0, //新消息数量
//   showNewsDot: false, //是否显示消息红点
//   //最后一条消息，消息类型需要父组件处理，这里只接收结果字符串，
//   //比如说消息类型是 text 时可以直接显示消息内容，如果是图片或者表情或者文件等其他内容时，需要另外的显示方式
//   isSubGroup: false, //是否为子群组，外层的群组和子群组的样式有区别
//   isExpand: false, //操作按钮是否展开状态
//   onExpandChange: function () { }, //操作按钮展开状态改变回调
//   onClickedGroupItem: function () { }, //点击 Groupitem 的回调
//   isShouldShowExpandOpertor: false //是否需要显示展开操作按钮， 如果是子群或者即使是主群但是没有子群，那么也不显示
// };

export default GroupItem;
