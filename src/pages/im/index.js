import Taro, { Component } from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import styles from './index.scss';
import SearchInput from './../groupMember/components/SearchInput.js';
import UserInput from './../../pages/chat/components/UserInput.js';

@connect(({ im }) => ({
  im
}))
class Im extends Component {
  componentDidMount() {
    //1. 在登录完成， 向后端请求数据的数据头中注入完 Ahthorization 后，调用这个方法

    //因为向后端请求这些数据需要在请求头中注入 Authorization
    //所以最早也只能在用户登陆之后，向请求头中注入完 Authorization后，发起这些请求

    const initImData = async () => {
      const { dispatch } = this.props;
      const { account, token } = await dispatch({
        type: 'im/fetchIMAccount'
      });
      await dispatch({
        type: 'im/initNimSDK',
        payload: {
          account,
          token
        }
      });
      return await dispatch({
        type: 'im/fetchAllIMTeamList'
      });
    };
    initImData().catch(e => Taro.showToast({ title: String(e), icon: 'none' }));
  }
  handleJumpToBoardDetail = () => {
    //2. 在项目列表页中, 点击项目 item 的时候跳转页面到项目详情页
    Taro.navigateTo({
      url: `/pages/boardDetail/index?boardId=1078128714971222016`
    });
  };

  //3. 是否需要为该项目显示右上角的新消息红点
  isBoardShouldShowNewMsgDot = (board_id = '') => {
    //需要拿到 model - im 中的:
    //allBoardList
    //sessionlist

    //1. 拿到当前项目的 im info object
    // let currentBoardImInfo = allBoardList.find(i => i.board_id === board_id);
    // if (!currentBoardImInfo) return false;

    //2. 拿到当前项目的 im_id 及其所有子群的 im_id
    // const currentBoardImIdAndChildsId = [currentBoardImInfo.im_id].concat(
    //   currentBoardImInfo.childs
    //     ? currentBoardImInfo.childs.map(i => i.im_id)
    //     : []
    // );

    //3. 所有属于当前项目及其子群的对话中，是否有未读的消息，
    // 如果有，返回 true,
    // 如果没有，返回 false

    // return sessionlist
    //   .filter(i => currentBoardImIdAndChildsId.find(id => id === i.to))
    //   .some(i => i.unread);
  };
  render() {
    return (
      <View className='global_horrizontal_padding'>
        <Button onClick={this.handleJumpToBoardDetail}>跳转到项目详情页</Button>
        <View className={styles.searchInputWrapper}>
          <SearchInput />
        </View>
        <View style={{ position: 'fixed', bottom: 0 }}>
          <UserInput />
        </View>
      </View>
    );
  }
}

export default Im;
