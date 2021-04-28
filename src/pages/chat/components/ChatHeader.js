import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import styles from './ChatHeader.scss';
import globalStyles from './../../../gloalSet/styles/globalStyles.scss';
import { connect } from '@tarojs/redux';

@connect(({ im: { currentGroup ,allBoardList} }) => ({
  currentGroup,allBoardList
}))
class ChatHeader extends Component {
  constructor(){
    super(...arguments)
    this.state = {
      hasSublist:true
    }
  }
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
  componentDidMount(){
    // console.log(this.props)
    let { currentProject = {} } = this.props;
    let { children = [] } = currentProject;
    if(!children.length){
      this.setState({
        hasSublist: false
      })
    }
  }
  getSubUnread = ()=>{
    let { allBoardList ,currentGroup} = this.props;
    let sub = allBoardList.filter(item => item.type == 3 && item.board_id == currentGroup.board_id);
    let number = sub.reduce((total,item) => {
      return total += Number(item.unread || 0);
    },0)
    return number ;
  }
  render() {
    const { currentProject: { name = '未知群名'} = {} , hideSubList ,currentProject} = this.props;
    let { hasSublist } = this.state;
    let subUnread = this.getSubUnread();
    return (
      <View className={styles.wrapper}>
        <View className={styles.contentWrapper}>
          <View className={`${styles.title} ${globalStyles.global_iconfont}`} >
            <Text className={currentProject.mark ? globalStyles.global_itemMark : ""}
            style={{backgroundColor: currentProject.mark ? currentProject.mark :""}}></Text>
            群组信息
            {/* &#xe8ed; */}
          </View>
          <View
            className={styles.operatorWrapper}
            onClick={this.onGoToSubChatList}>
            {!hideSubList && hasSublist &&
            <View
              className={`${globalStyles.global_iconfont} ${styles.operator}`}
            >
              {subUnread  && <View className={styles.badge}>
                { subUnread > 99 ? '99+' : subUnread }
                </View>}
                &#xe89c;
            </View>
          } 
            <View
              className={`${globalStyles.global_iconfont} ${styles.operator}`}
              onClick={this.onShowBoardDetail}
            >
             &#xe8b4;
            </View>
          </View>
          

        </View>
      </View>
    );
  }
}

ChatHeader.defaultProps = {
  currentProject: {} //当前的群信息
};

export default ChatHeader;
