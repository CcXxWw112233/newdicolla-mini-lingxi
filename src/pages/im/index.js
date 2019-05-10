import Taro, { Component } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import Avatar from './../boardDetail/components/Avatar';
import GroupItem from './../boardDetail/components/GroupItem';
@connect(({ im }) => ({
  im
}))
class Im extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'im/initNimSDK',
      payload: {
        account: '1076324637052375040',
        token:
          'd1c46ff800a2fc1f3dc2c8cd09e5336338f18b0a717c845ecc63d0134e18404a'
      }
    });
    dispatch({
      type: 'im/fetchAllIMTeamList'
    });
  }
  handleJumpToBoardDetail = () => {
    Taro.navigateTo({
      url: `/pages/boardDetail/index?boardId=1076314429173403648`
    });
  };
  render() {
    return (
      <View className="global_horrizontal_padding">
        <Text>aaaaaaaaaaaaa</Text>
        <Button onClick={this.handleJumpToBoardDetail}>跳转到项目详情页</Button>
        {/* <View style={{ marginLeft: '50px', marginTop: '50px' }}>
          <Avatar
            urlList={[
              'https://box.bdimg.com/static/fisp_static/common/img/searchbox/logo_news_276_88_1f9876a.png',
              'https://box.bdimg.com/static/fisp_static/common/img/searchbox/logo_news_276_88_1f9876a.png',
              'https://box.bdimg.com/static/fisp_static/common/img/searchbox/logo_news_276_88_1f9876a.png',
              'https://box.bdimg.com/static/fisp_static/common/img/searchbox/logo_news_276_88_1f9876a.png',
              'https://box.bdimg.com/static/fisp_static/common/img/searchbox/logo_news_276_88_1f9876a.png'
            ]}
            value={9}
            showDot={true}
          />
        </View> */}
        <GroupItem
          avatarList={[
            'https://box.bdimg.com/static/fisp_static/common/img/searchbox/logo_news_276_88_1f9876a.png',
            'https://box.bdimg.com/static/fisp_static/common/img/searchbox/logo_news_276_88_1f9876a.png',
            'https://box.bdimg.com/static/fisp_static/common/img/searchbox/logo_news_276_88_1f9876a.png',
            'https://box.bdimg.com/static/fisp_static/common/img/searchbox/logo_news_276_88_1f9876a.png',
            'https://box.bdimg.com/static/fisp_static/common/img/searchbox/logo_news_276_88_1f9876a.png'
          ]}
          label="项目"
          name="这是一个群名称一个群名称一个群名称"
          lastMsg="最后一条消息，消息类型需要父组件处理，这里只接收结果字符串"
          newsNum={12}
          isSubGroup={false}
        />
      </View>
    );
  }
}

export default Im;
