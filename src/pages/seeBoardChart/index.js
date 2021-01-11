import Taro, { Component } from "@tarojs/taro";
import { View, WebView } from "@tarojs/components";
import { isApiResponseOk } from "../../utils/request";
import { getAccountInfo } from "../../services/login";
// import indexStyles from "./index.scss";
export default class index extends Component {
  constructor(props) {
    super(props);
    // chart_url=http://test.lingxi.new-di.com&chart_board_id=asdasdasd
    this.state = {
      wsrc: ""
    };
  }
  getAuth = async () => {
    console.log("params", this.$router.params);
    const res = await getAccountInfo();
    let { chart_url, chart_board_id } = this.$router.params;
    //参数从url中获取，如果没有，代表着不是从扫码进来，而是授权登录后进来，导致参数链条断了，所以从缓存中取
    if (!chart_url && !chart_board_id) {
      chart_url = Taro.getStorageSync("chart_url");
      chart_board_id = Taro.getStorageSync("chart_board_id");
    } else {
      Taro.setStorageSync("chart_url", chart_url);
      Taro.setStorageSync("chart_board_id", chart_board_id);
    }
    if (isApiResponseOk(res)) {
      this.setState({
        wsrc: `${chart_url}?chart_board_id=${chart_board_id}&token=${Taro.getStorageSync('access_token')}`
      });
    } else {
      const redirectPath = `../seeBoardChart/index`;
      Taro.setStorageSync("redirectPath", redirectPath);
      Taro.navigateTo({
        url: `../index/index?redirect=${redirectPath}`
      });
    }
  };
  componentDidShow() {
    this.getAuth();
  }
  render() {
    return (
      <View>
        <WebView src={this.state.wsrc} />
      </View>
    );
  }
}
