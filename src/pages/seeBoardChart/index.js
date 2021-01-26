import Taro, { Component } from "@tarojs/taro";
import { View, WebView, Image, Text } from "@tarojs/components";
import { isApiResponseOk } from "../../utils/request";
import { getAccountInfo } from "../../services/login";
import { BASE_URL } from "../../gloalSet/js/constant";
import { qrCodeIsInvitation } from "../../services/invitation";
import NoDataSvg from "../../asset/no_data.svg";
import styles from "./index.scss";
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wsrc: "",
      show_err: false,
      loading: true
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
      queryId = options.id || Taro.getStorageSync("qr_code_check_id");
    }
    console.log("ssssss", options, queryId);
    const {
      globalData: {
        store: { dispatch }
      }
    } = Taro.getApp();
    // Taro.setStorageSync("qrCodeInValidText", "请扫描项目统计二维码");
    if (queryId) {
      Taro.setStorageSync("qr_code_check_id", queryId);
    } else {
      this.setState({
        loading: false,
        show_err: true
      });
      return;
      // Taro.reLaunch({
      //   url: "../../pages/qrCodeInvalid/index"
      // });
    }
    Taro.removeStorageSync("web_redirect_url");
    Taro.removeStorageSync("web_param_board_id");
    const res = await qrCodeIsInvitation({
      id: queryId || Taro.getStorageSync("qr_code_check_id")
    });
    this.setState({
      loading: false
    });
    console.log("ssssss", res);
    if (isApiResponseOk(res)) {
      const { rela_id, rela_content } = res.data;
      Taro.setStorageSync("web_redirect_url", `${BASE_URL}${rela_content}`);
      Taro.setStorageSync("web_param_board_id", rela_id);
      // Taro.removeStorageSync("qrCodeInValidText");
      this.getAuth();
    } else {
      this.setState({
        show_err: true
      });
    }
    // dispatch({
    //   type: "invitation/qrCodeIsInvitation",
    //   payload: {
    //     id: queryId || Taro.getStorageSync("qr_code_check_id")
    //   }
    // }).then(data => {
    //   debugger
    //   if (data) {
    //     const { rela_id, rela_content } = data;
    //     Taro.setStorageSync("web_redirect_url", `${BASE_URL}${rela_content}`);
    //     Taro.setStorageSync("web_param_board_id", rela_id);
    //     Taro.removeStorageSync("qrCodeInValidText");
    //     this.getAuth();
    //   }
    // });
  };
  getAuth = async () => {
    const res = await getAccountInfo();
    const web_redirect_url = Taro.getStorageSync("web_redirect_url");
    const web_param_board_id = Taro.getStorageSync("web_param_board_id");
    if (isApiResponseOk(res)) {
      this.setState({
        wsrc: `${web_redirect_url}?board_id=${web_param_board_id}&token=${Taro.getStorageSync(
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
    this.checkScenen();
  }
  //检查进入的场景
  checkScenen = () => {
    const options = this.$router.params;
    const { web_redirect_url, scene } = options;
    if (web_redirect_url) {
      console.log("ssssssss", 1);
      this.offcialMessageEntry();
    } else if (scene) {
      console.log("ssssssss", 2);
      //扫码场景
      this.qarCodeIsInvitation();
    } else {
      console.log("ssssssss", 3);
      // 正常进入
      this.nomalTabBarEntry();
    }
  };

  nomalTabBarEntry = () => {
    const web_redirect_url = Taro.getStorageSync("web_redirect_url");
    const web_param_board_id = Taro.getStorageSync("web_param_board_id");
    if (web_redirect_url && web_param_board_id) {
      this.setState({
        loading: false,
        show_err: false,
        wsrc: `${web_redirect_url}?board_id=${web_param_board_id}&token=${Taro.getStorageSync(
          "access_token"
        )}`
      });
    } else {
      this.setState({
        loading: false,
        show_err: true
      });
    }
  };

  offcialMessageEntry = () => {
    const { web_param_board_id, web_redirect_url } = this.$router.params;
    Taro.setStorageSync("web_redirect_url", `${BASE_URL}${web_redirect_url}`);
    Taro.setStorageSync("web_param_board_id", web_param_board_id);
    this.setState(
      {
        show_err: false,
        loading: false
      },
      () => {
        this.getAuth();
      }
    );
  };

  render() {
    const { show_err, loading } = this.state;
    return (
      <View>
        {!loading &&
          (show_err ? (
            <View className={styles.err_area}>
              <View className={styles.img_area}>
                <Image src={NoDataSvg} />
              </View>
              <View className={styles.err_text}>
                请前往电脑端，扫描统计二维码
              </View>
            </View>
          ) : (
            <WebView src={this.state.wsrc} />
          ))}
      </View>
    );
  }
}
