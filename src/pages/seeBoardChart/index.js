import Taro, { Component } from "@tarojs/taro";
import {
  View,
  WebView,
  Image,
  Text,
  Button,
  ScrollView
} from "@tarojs/components";
import { isApiResponseOk } from "../../utils/request";
import { getAccountInfo } from "../../services/login";
import { BASE_URL } from "../../gloalSet/js/constant";
import {
  FollowQrcode,
  getQrCodeHistory,
  getQrCodeInfo,
  qrCodeIsInvitation
} from "../../services/invitation";
import NoDataSvg from "../../asset/no_data.svg";
import styles from "./index.scss";
import { SCANCODESUCCESS } from "./constans";

export default class index extends Component {
  config = {
    navigationBarTitleText: "统计报表"
  };

  constructor(props) {
    super(props);
    this.state = {
      wsrc: "",
      show_err: false,
      loading: true,
      qrcode_history: []
    };
  }
  //检查二维码是否过期
  qarCodeIsInvitation = async params => {
    // const { id } = this.$router.params || {};
    const options = params || this.$router.params;
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
    Taro.removeStorageSync("query_condition");
    const res = await qrCodeIsInvitation({
      id: queryId || Taro.getStorageSync("qr_code_check_id")
    });

    this.setState({
      loading: false
    });
    console.log("ssssss", res);
    if (isApiResponseOk(res)) {
      const { rela_id, rela_content } = res.data;
      const response = await this.getQrcodeInfo(rela_id);
      const { board_ids, query_condition } = response.data;
      Taro.setStorageSync(
        "web_redirect_url",
        "http://192.168.1.81:8665/board_statistics.html" ||
          `${BASE_URL}${rela_content}`
      );
      Taro.setStorageSync("web_param_board_id", board_ids);
      Taro.setStorageSync("query_condition", query_condition);
      // Taro.removeStorageSync("qrCodeInValidText");
      this.getAuth(rela_id);
      this.followQrcodeList(rela_id);
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

  /**
   * 关注二维码
   */
  followQrcodeList = report_id => {
    FollowQrcode({ id: report_id });
  };
  /**
   * 获取列表中的详情
   * @param {*} id
   * @returns
   */
  getQrcodeInfo = id => {
    return getQrCodeInfo({ id }).then(res => {
      return res;
    });
  };
  getAuth = async id => {
    const res = await getAccountInfo();
    const web_redirect_url = Taro.getStorageSync("web_redirect_url");
    const web_param_board_id = Taro.getStorageSync("web_param_board_id");
    const query_condition = Taro.getStorageSync("query_condition");
    if (isApiResponseOk(res)) {
      this.setState({
        show_err: false,
        loading: false,
        wsrc: `${web_redirect_url}?board_ids=${web_param_board_id}&token=${Taro.getStorageSync(
          "access_token"
        )}&${query_condition}`
      });
    } else {
      const redirectPath = `../seeBoardChart/index`;
      Taro.setStorageSync("redirectPath", redirectPath);
      Taro.navigateTo({
        url: `../index/index?redirect=${redirectPath}`
      });
    }
  };
  componentDidMount() {
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

  /**
   * 获取扫码的列表记录
   */
  getQrcodeHistory = () => {
    return getQrCodeHistory({}).then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          qrcode_history: res.data
        });
      }
      return res.data;
    });
  };

  nomalTabBarEntry = async () => {
    // const res = await this.getQrcodeHistory();
    // console.log(res);
    // /**
    //  * 判定是否有历史记录
    //  */
    // if (res.length >= 1) {
    //   this.setState({
    //     loading: true
    //   });
    //   return;
    // }

    const web_redirect_url = Taro.getStorageSync("web_redirect_url");
    const web_param_board_id = Taro.getStorageSync("web_param_board_id");
    const query_condition = Taro.getStorageSync("query_condition");
    if (web_redirect_url && web_param_board_id) {
      this.setState({
        loading: false,
        show_err: false,
        wsrc: `${web_redirect_url}?board_ids=${web_param_board_id}&token=${Taro.getStorageSync(
          "access_token"
        )}&${query_condition}`
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
    Taro.setStorageSync("web_redirect_url", web_redirect_url || `${BASE_URL}${web_redirect_url}`);
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

  /**
   * 扫码按钮
   */
  toScanCode = () => {
    Taro.scanCode({
      onlyFromCamera: true,
      scanType: ["qrCode"],
      success: val => {
        const { errMsg, path } = val;
        if (errMsg === SCANCODESUCCESS) {
          const url = decodeURIComponent(path);
          const splitArr = url.split("id/");

          this.qarCodeIsInvitation({ id: splitArr[1] });
        }
      }
    });
  };

  /**
   * 查看详情
   */
  handleHistoryInfo = async val => {
    const res = await this.getQrcodeInfo(val.id);
    // console.log(res);
    const { board_ids, query_condition } = res.data;

    const web_redirect_url = Taro.getStorageSync("web_redirect_url");
    this.setState({
      loading: false,
      show_err: false,
      wsrc: `${web_redirect_url}?board_ids=${board_ids}&token=${Taro.getStorageSync(
        "access_token"
      )}&${query_condition}`
    });
  };

  /**
   * 返回列表
   */
  handleBackList = () => {
    this.setState(
      {
        loading: true,
        show_err: false,
        wsrc: ""
      },
      () => {
        this.getQrcodeHistory();
      }
    );
  };

  render() {
    // const SystemInfo = Taro.getSystemInfoSync();
    // const screen_Width = SystemInfo.screenWidth;
    // const statusBar_Height = SystemInfo.statusBarHeight;
    // const navBar_Height = SystemInfo.platform == "ios" ? 44 : 48;
    const { show_err, loading, qrcode_history } = this.state;
    return (
      <View>
        {/* <View className={styles.navibar} style={{ height: statusBar_Height + navBar_Height + 'px' }}>
        <View className={styles.statusBar_Scss} style={{ height: statusBar_Height + 'px' }}></View>
          <View className={styles.navBar_Scss} style={{ height: navBar_Height + 'px' }}>
            <View className={styles.backmenu} onClick={this.handleBackList}>
              <Text>&#xe7be;</Text>
            </View>
            <View className={styles.title}>统计</View>
            <View className={styles.more}></View>
          </View>
        </View> */}
        {!loading &&
          (show_err ? (
            <View className={styles.err_area}>
              <View className={styles.img_area}>
                <Image src={NoDataSvg} />
              </View>
              <View className={styles.err_text}>
                请前往电脑端，扫描统计二维码
              </View>
              <View className={styles.scanCodeBtn}>
                <Button type="primary" plain="true" onClick={this.toScanCode}>
                  扫描二维码
                </Button>
              </View>
            </View>
          ) : (
            <View className={styles.webview_container}>
              {/* <View className={styles.operations}>操作</View> */}
              <WebView src={this.state.wsrc} />
            </View>
          ))}
        {/* {loading && qrcode_history.length >= 1 && (
          <ScrollView
            scrollY
            className={styles.scrollView}
            // style={{ height: `calc(100vh - ${statusBar_Height + navBar_Height + 'px'})` }}
          >
            <View className={styles.history_list}>
              {qrcode_history.map(item => {
                return (
                  <View
                    className={styles.list_item}
                    key={item.id}
                    onClick={() => this.handleHistoryInfo(item)}
                  >
                    <View className={styles.item_icon}>
                      {item.report_code === BOARDSTATISTICS && (
                        <Text className={styles.iconfont}>&#xe69b;</Text>
                      )}
                      {item.report_code === TASKSTATISTICS && (
                        <Text className={styles.iconfont}>&#xea2d;</Text>
                      )}
                    </View>
                    <View className={styles.item_content}>
                      <View className={styles.title}>{item.report_title}</View>
                      <View className={styles.subtitle}>
                        {item.report_subtitle}
                      </View>
                    </View>
                    <View className={styles.more}>...</View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )} */}
      </View>
    );
  }
}
