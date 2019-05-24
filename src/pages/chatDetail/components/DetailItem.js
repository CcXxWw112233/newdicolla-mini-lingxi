import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import styles from './DetailItem.scss';

class DetailItem extends Component {
  render() {
    const {
      itemText,
      itemTextKeyValue,
      onItemClick,
      isCanOperator,
      isShowBottomBorder
    } = this.props;
    const isHasItemTextKeyValue =
      Array.isArray(itemTextKeyValue) && itemTextKeyValue.length === 2;
    const [key, value] = itemTextKeyValue;
    return (
      <View className={styles.wrapper}>
        <View
          className={`${styles.contentWrapper} ${
            isShowBottomBorder ? styles.contentWrapperBottomBorder : ''
          }`}
        >
          {!isHasItemTextKeyValue && (
            <View className={styles.itemText}>{itemText}</View>
          )}
          {isHasItemTextKeyValue && (
            <View className={styles.itemKeyValueWrapper}>
              <View className={styles.itemKeyValueKey}>{key}</View>
              <View className={styles.itemKeyValueValue}>{value}</View>
              <View />
            </View>
          )}
          {isCanOperator && (
            <View className={styles.operator} onClick={() => onItemClick()}>
              <AtIcon value="chevron-right" size="20" />
            </View>
          )}
        </View>
      </View>
    );
  }
}

DetailItem.defaultProps = {
  itemText: '查找聊天记录', //item 只是一个整个的字符串的情况
  itemTextKeyValue: [], //['key', 'value'] item 存在样式的区别，优先级高于 itemText
  onItemClick: function() {}, //点击之后的回调
  isCanOperator: false, // 是否可以操作，也就是是否需要显示最右边的图标
  isShowBottomBorder: false, //是否显示底部的 border.
};

export default DetailItem;
