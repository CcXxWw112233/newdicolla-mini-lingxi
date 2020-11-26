import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components';
import styles from './index.scss';
import GroupItem from '../boardChat/components/GroupItem';
import { connect } from '@tarojs/redux';

@connect(({ im: { currentGroup = {}, userUID, allBoardList = [] } }) => ({
  currentGroup, userUID, allBoardList
}))
export default class SubChat extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      chatlist: []
    }
  }
  componentDidMount() {
    this.filterSubChat();
  }


  genAvatarList = (users = []) => {
    //如果没有头像就获取name的第一个字符生成头像
    const userToAvatar = i => (i && i.avatar ? i.avatar : ((i.name).substr(0, 1)));
    if (users.length <= 4) {
      return users.map(userToAvatar);
    }
    //获取最多4个头像
    return users.slice(0, 4).map(userToAvatar);
  };

  genLastMsg = (lastMsg = {}) => {
    if (JSON.stringify(lastMsg) != "{}" && lastMsg.status === "success") {  //lastMsg不为空并且成功才执行
      const { fromNick, type, text, file, custom, tip, } = lastMsg;
      const typeCond = {
        text,
        audio: '[语音]',
        image: '[图片]',
        video: '[视频]',
        notification: '[系统通知]',
        file: '[文件]',
        custom,
        tip,
      };
      if (type === 'text') {
        return `${fromNick}: ${text}`;
      }
      // if (type === 'file') {
      //     return `${'[文件]'} ${file.name}`;
      // }
      if (type === 'custom') {
        const contentJSON = JSON.parse(lastMsg.content)
        return contentJSON.type === 3 ? '[动态贴图]' : '[动态消息]'
      }
      if (type === 'tip') {
        return `${text}`
      }
      return typeCond[type] ? typeCond[type] : '[未知类型消息]';
    } else {
      return '';
    }
  };
  handleSubChatClick = async (val) => {
    let { dispatch, currentGroup } = this.props;
    let { im_id, board_id } = val;
    // console.log(val)

    await dispatch({
      type: "im/updateBoardUnread",
      payload: {
        param: {
          im_id,
          msgids: []
        },
        im_id,
        board_id,
        unread: 0
      }
    })

    let obj = { ...currentGroup };
    obj.subUnread = obj.subUnread - val.unread;
    dispatch({
      type: "im/updateStateFieldByCover",
      payload: {
        currentSubChat: val,
        currentGroup: obj
      }
    })

    Taro.redirectTo({
      url: "/pages/subChatDetail/index"
    })
  }
  componentWillReceiveProps() {
    this.filterSubChat();
  }

  filterSubChat = () => {
    let { currentGroup, allBoardList } = this.props;
    // console.log(currentGroup.children)
    let child = allBoardList.filter(item => item.type == 3 && item.board_id == currentGroup.board_id);
    this.setState({
      chatlist: child.sort((a, b) => ((b.updateTime)) - ((a.updateTime)))
    })
    console.log(child)
  }
  render() {
    let { chatlist } = this.state;
    let { userUID } = this.props;
    return (
      <View>
        {chatlist.map(value => {
          let {
            im_id,
            board_id,
            board_name,
            name,
            users,
            lastMsg,
            unread,
            apns
          } = value;
          return (
            <GroupItem key={im_id}
              data={value}
              board_id={board_id}
              im_id={im_id}
              name={board_name || name}
              avatarList={this.genAvatarList(users)}
              lastMsg={this.genLastMsg(lastMsg)}
              newsNum={(unread)}
              apns={apns}
              userid={userUID}
              onClickedGroupItem={this.handleSubChatClick.bind(this, value)}
            />
          )
        })}
      </View>
    )
  }
}
