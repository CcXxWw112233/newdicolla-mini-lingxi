import Taro, { Component } from "@tarojs/taro";
import { View, WebView } from "@tarojs/components";
import { isApiResponseOk } from "../../utils/request";
import { getAccountInfo } from "../../services/login";
import { BASE_URL } from "../../gloalSet/js/constant";
// import indexStyles from "./index.scss";
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wsrc: ""
    };
  }
  //检查二维码是否过期
  qarCodeIsInvitation = async () => {
    // const { id } = this.$router.params || {};
    const options = this.$router.params;
    let queryId;
    if (options.scene) {
      //扫码场景进入
      const sceneArr = options.scene.split("&")[0];
      queryId = sceneArr.slice(5);
    } else {
      //其他场景进入
      queryId = options.id;
    }
    console.log("options", options, queryId);
    const {
      globalData: {
        store: { dispatch }
      }
    } = Taro.getApp();
    Taro.setStorageSync("qrCodeInValidText", "请重新扫码");
    if (queryId) {
      Taro.setStorageSync("qr_code_check_id", queryId);
    }
    Taro.removeStorageSync("web_redirect_url");
    Taro.removeStorageSync("board_id");
    dispatch({
      type: "invitation/qrCodeIsInvitation",
      payload: {
        id: queryId || Taro.getStorageSync("qr_code_check_id")
      }
    }).then(data => {
      // debugger
      if (data) {
        const { rela_id, rela_content } = data;
        Taro.setStorageSync("web_redirect_url", `${BASE_URL}${rela_content}`);
        Taro.setStorageSync("board_id", rela_id);
        Taro.removeStorageSync("qrCodeInValidText");
        this.getAuth();
      }
    });
  };
  getAuth = async () => {
    const res = await getAccountInfo();
    const web_redirect_url = Taro.getStorageSync("web_redirect_url");
    const board_id = Taro.getStorageSync("board_id");
    if (isApiResponseOk(res)) {
      this.setState({
        wsrc: `${web_redirect_url}?board_id=${board_id}&token=${Taro.getStorageSync(
          "access_token"
        )}`
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
    this.qarCodeIsInvitation();
  }
  render() {
    return (
      <View>
        <WebView src={this.state.wsrc} />
      </View>
    );
  }
}
