import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import styles from './AvatarList.scss';
import globalStyles from './../../../gloalSet/styles/globalStyles.scss';

class AvatarList extends Component {
  shouldShowAvatarMax = 19;
  isValidImgUrl = url => {
    return /^http[s]?:/.test(url);
  };
  onClickAvatarItem = (which, e) => {
    if (e) e.stopPropagation();
    console.log(which, 'on avatar item clicked.');
  };
  render() {
    const { avatarList } = this.props;
    return (
      <View className={styles.wrapper}>
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
                  index === this.shouldShowAvatarMax ? 'all' : item.id,
                  e
                )
              }
            >
              {index <= this.shouldShowAvatarMax ? (
                this.isValidImgUrl(item.avatar) ? (
                  index === this.shouldShowAvatarMax ? (
                    <View
                      className={`${globalStyles.global_iconfont} ${
                        styles.avatarItemAvatar
                      } ${
                        index === this.shouldShowAvatarMax
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
                ) : index === this.shouldShowAvatarMax ? (
                  <View
                    className={`${globalStyles.global_iconfont} ${
                      styles.avatarItemAvatar
                    } ${
                      index === this.shouldShowAvatarMax
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
              {index <= this.shouldShowAvatarMax ? (
                <Text className={styles.avatarItemName}>
                  {index === this.shouldShowAvatarMax
                    ? '查看全sdfdsf部'
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
  avatarList: [] //头像对象数组
};

export default AvatarList;
