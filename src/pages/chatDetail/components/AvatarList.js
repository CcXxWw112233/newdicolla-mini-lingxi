import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import styles from './AvatarList.scss';
import globalStyles from './../../../gloalSet/styles/globalStyles.scss';
import defaultPhoto from "./../../../asset/chat/defaultPhoto.png";

class AvatarList extends Component {
  state={
    isShowAll:false
  }
  isValidImgUrl = url => {
    return /^http[s]?:/.test(url);
  };
  onClickAvatarItem = (which, e) => {
    const { onShowAll } = this.props
    if (e) e.stopPropagation();
    if (which === 'all') {
      onShowAll()
    }
    console.log(which, 'on avatar item clicked.');
  };

  componentDidMount() {
    const { avatarList = [],shouldShowAvatarMax,isshowAdd } = this.props;
    // this.setState({
    //   avatarList:avatarList,
    //   shouldShowAvatarMax:shouldShowAvatarMax,
    // })
    var list = avatarList;
      list.unshift({})
    this.setState({
      isShowAll:true,
      avatarList:list,
      shouldShowAvatarMax:avatarList.length
    })
  }
  checkMoreGroupMenmber() {
    const { avatarList = [],shouldShowAvatarMax } = this.props;
    var list = avatarList;
    list.unshift({})
    this.setState({
      isShowAll:true,
      avatarList:list,
      shouldShowAvatarMax:avatarList.length
    })
  }
  
  inviteMember() {
    Taro.navigateTo({
      url:'/pages/chatDetail/components/inviteMember/index'
    })
  }
  render() {
    const { name, } = this.props;
    const {shouldShowAvatarMax,avatarList,isShowAll} = this.state;   
  
    return (
       <View className={index}>
        <View className={styles.wrapper_top}>
          <View className={styles.wrapper_groupName}>群名:{name}</View>
          <View className={styles.wrapper_group_population}>群成员:{avatarList.length}/500</View>
        </View>
      <View className={`${styles.wrapper}`}>

        {avatarList && avatarList.map((item, index) => {
          const isaddMember = ((index === shouldShowAvatarMax && !isShowAll) || (index == 0 && isShowAll))
          return (
            <View
              key={item.id}
              className={`${styles.avatarItemWrapper} ${(index + 1) % 5 === 0
                ? styles.avatarItemWrapperWithNoMargin
                : ''
                }`}
              // onClick={e =>
              //   this.onClickAvatarItem(
              //     index === shouldShowAvatarMax ? 'all' : item.id,
              //     e
              //   )
              // }
            >

              {index <= shouldShowAvatarMax ? (
                this.isValidImgUrl(item.avatar) ? (
                  isaddMember ? (
                    <View
                      className={`${globalStyles.global_iconfont} ${styles.avatarItemAvatar
                        } ${isaddMember
                          ? styles.avatarItemNameShowAll
                          : ''
                        }`}
                      style={{
                        fontSize: '20px'
                      }}
                      onClick={this.inviteMember}
                    >
                      {' '}
                      &#xe7b7;{' '}
                    </View>
                  ) : (
                      <Image
                        className={styles.avatarItemAvatar}
                        src={item.avatar}
                        mode='aspectFill'
                      />
                    )
                ) : isaddMember ? (
                  <View
                    className={`${globalStyles.global_iconfont} ${styles.avatarItemAvatar
                      } ${isaddMember
                        ? styles.avatarItemNameShowAll
                        : ''
                      }`}
                    style={{
                      fontSize: '20px'
                    }}
                    onClick={this.inviteMember}
                  >
                    {' '}
                    &#xe7b7;{' '}
                  </View>
                ) : (
                      <Image src={defaultPhoto} className={`${globalStyles.global_iconfont} ${styles.avatarItemAvatar}`}></Image>
                    )
              ) : null}
              {index <= shouldShowAvatarMax ? (
                <Text className={styles.avatarItemName}>
                  {isaddMember
                    ? '邀请成员'
                    : item.name}
                </Text>
              ) : null}
            </View>
          );
        })}
        {/* {
          avatarList.length > shouldShowAvatarMax &&  <View className={styles.checkMoreGroupMenmber} onClick={this.checkMoreGroupMenmber}>更多成员</View>
        } */}
       
       </View>
      </View>
    );
  }
}

AvatarList.defaultProps = {
  avatarList: [], //头像对象数组
  shouldShowAvatarMax: 19, //头像的最大显示数量，超过之后，显示 显示全部 头像按钮
  onShowAll: function () { }, //查看全部按钮
};

export default AvatarList;
