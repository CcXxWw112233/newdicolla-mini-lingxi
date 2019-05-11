import Taro, { Component } from '@tarojs/taro';
import { View, Button, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';

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
      url: `/pages/boardDetail/index?boardId=1078128714971222016`
    });
  };
  render() {
    return (
      <View className="global_horrizontal_padding">
        <Text>aaaaaaaaaaaaa</Text>
        <Button onClick={this.handleJumpToBoardDetail}>跳转到项目详情页</Button>
      </View>
    );
  }
}

export default Im;
