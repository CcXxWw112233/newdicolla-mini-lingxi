import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import styles from './AvatarList.scss';
import globalStyles from './../../../gloalSet/styles/globalStyles.scss';

class AvatarList extends Component {
  isValidImgUrl = url => {
    return /^http[s]?:/.test(url);
  };
  onClickAvatarItem = (which, e) => {
    const {onShowAll} = this.props
    if (e) e.stopPropagation();
    if(which === 'all') {
      onShowAll()
    }
    console.log(which, 'on avatar item clicked.');
  };
  render() {
    const { avatarList, shouldShowAvatarMax } = this.props;
    return (
      <View className={`${styles.wrapper}`}>
        {avatarList.map((item, index) => {
          return (
            <View
              key={item.id}
              className={`${styles.avatarItemWrapper} ${
                (index + 1) % 5 === 0
                  ? styles.avatarItemWrapperWithNoMargin
                  : ''
              }`}
              onClick={e =>
                this.onClickAvatarItem(
                  index === shouldShowAvatarMax ? 'all' : item.id,
                  e
                )
              }
            >
              {index <= shouldShowAvatarMax ? (
                this.isValidImgUrl(item.avatar) ? (
                  index === shouldShowAvatarMax ? (
                    <View
                      className={`${globalStyles.global_iconfont} ${
                        styles.avatarItemAvatar
                      } ${
                        index === shouldShowAvatarMax
                          ? styles.avatarItemNameShowAll
                          : ''
                      }`}
                      style={{
                        fontSize: '45px'
                      }}
                    >
                      {' '}
                      &#xe63f;{' '}
                    </View>
                  ) : (
                    <Image
                      className={styles.avatarItemAvatar}
                      src={item.avatar}
                      mode="aspectFill"
                    />
                  )
                ) : index === shouldShowAvatarMax ? (
                  <View
                    className={`${globalStyles.global_iconfont} ${
                      styles.avatarItemAvatar
                    } ${
                      index === shouldShowAvatarMax
                        ? styles.avatarItemNameShowAll
                        : ''
                    }`}
                    style={{
                      fontSize: '45px'
                    }}
                  >
                    {' '}
                    &#xe63f;{' '}
                  </View>
                ) : (
                  <View
                    className={`${globalStyles.global_iconfont} ${
                      styles.avatarItemAvatar
                    }`}
                    style={{
                      fontSize: '52px'
                    }}
                  >
                    &#xe647;
                  </View>
                )
              ) : null}
              {index <= shouldShowAvatarMax ? (
                <Text className={styles.avatarItemName}>
                  {index === shouldShowAvatarMax
                    ? '查看全部'
                    : item.name}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>
    );
  }
}

AvatarList.defaultProps = {
  avatarList: [], //头像对象数组
  shouldShowAvatarMax: 19, //头像的最大显示数量，超过之后，显示 显示全部 头像按钮
  onShowAll: function(){}, //查看全部按钮
};

export default AvatarList;
