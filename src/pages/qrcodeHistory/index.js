import Taro, { Component } from "@tarojs/taro";
import {
  View,
  WebView,
  Image,
  Text,
  Button,
  ScrollView,
  Textarea
} from "@tarojs/components";
import { AtSwipeAction, AtFloatLayout } from "taro-ui";
import { isApiResponseOk } from "../../utils/request";
import styles from "./index.scss";
import {
  getQrCodeHistory,
  getQrCodeInfo,
  removeQrcode,
  qrCodeIsInvitation,
  FollowQrcode,
  EditHistoryTitle
} from "../../services/invitation";
import {
  BOARDSTATISTICS,
  BoardUrl,
  DELETE,
  EDIT,
  TASKSTATISTICS,
  TaskUrl,
  SCANCODESUCCESS
} from "./constans";
import { BASE_URL } from "../../gloalSet/js/constant";
import NoDataSvg from "../../asset/no_data.svg";

export default class QrcodeHistory extends Component {
  config = {
    enablePullDownRefresh: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      qrcode_history: [],
      history_title: "",
      openConfirm: false
    };
    this.activeData = {};
  }
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

  componentDidMount() {
    this.getQrcodeHistory();
  }

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

  /**
   * 查看详情
   */
  handleHistoryInfo = async val => {
    const res = await this.getQrcodeInfo(val.id);
    // console.log(res);
    const { board_ids, query_condition, report_code, id } = res.data;
    let urls = "";
    if (report_code === BOARDSTATISTICS) {
      urls = BoardUrl;
    } else if (report_code === TASKSTATISTICS) {
      urls = TaskUrl;
    }
    const web_redirect_url = `${BASE_URL}/mini_web${urls}`;
    Taro.setStorageSync("query_condition", query_condition);
    Taro.hideLoading();
    // http://192.168.1.81:8665/board_statistics.html -- 本地地址
    Taro.navigateTo({
      url: `../seeBoardChart/index?web_redirect_url=${web_redirect_url}&web_param_board_id=${board_ids}&id=${id}` // `${web_redirect_url}`
    });
    // this.setState({
    //   loading: false,
    //   show_err: false,
    //   wsrc: `${web_redirect_url}?board_ids=${board_ids}&token=${Taro.getStorageSync(
    //     "access_token"
    //   )}&${query_condition}`
    // });
  };

  async onPullDownRefresh() {
    Taro.showNavigationBarLoading();
    await this.getQrcodeHistory();
    Taro.hideNavigationBarLoading();
    Taro.stopPullDownRefresh();
  }

  handleClick = val => {
    // console.log(val)
    switch (val.type) {
      case DELETE:
        console.log("删除");
        wx.showActionSheet({
          alertText: "确定删除吗？",
          itemList: ["确定"],
          itemColor: "red",
          success: res => {
            if (res.tapIndex === 0) {
              // 是删除
              removeQrcode({ id: val.id })
                .then(resp => {
                  if (isApiResponseOk(resp)) {
                    this.getQrcodeHistory();
                  }
                })
                .catch(console.error);
            }
          }
        });
        break;
      case EDIT:
        console.log("编辑");
        const { data } = val;
        this.activeData = data;
        this.setState({
          openConfirm: true,
          history_title: data.report_title
        });
        break;
    }
  };

  /**
   * 校验id
   * @param {} id
   */
  qarCodeIsInvitation = ({ id }) => {
    qrCodeIsInvitation({ id }).then(async res => {
      if (isApiResponseOk(res)) {
        const { rela_id } = res.data;
        await this.followQrcodeList(rela_id);
        this.handleHistoryInfo({ id: rela_id });
      } else {
        Taro.hideLoading()
        Taro.showModal({
          showCancel: false,
          title: '扫码错误',
          content: res.message
        })
      }
    }).catch(() => {
      Taro.hideLoading()
    });
  };

  /**
   * 关注二维码
   */
  followQrcodeList = report_id => {
    return FollowQrcode({ id: report_id }).then(res => {
      this.getQrcodeHistory();
      return res;
    });
  };

  /**
   * 扫码按钮
   */
  toScanCode = () => {
    Taro.scanCode({
      onlyFromCamera: true,
      scanType: ["qrCode"],
      success: val => {
        Taro.showLoading({
          title: "加载中..."
        });
        const { errMsg, path } = val;
        if (errMsg === SCANCODESUCCESS) {
          const url = decodeURIComponent(path);
          const splitArr = url.split("id/");

          this.qarCodeIsInvitation({ id: splitArr[1] });
        } else {
          Taro.hideLoading();
        }
      }
    });
  };

  /**
   * 保存修改的title
   */
  saveTitle = () => {
    const { history_title } = this.state;
    Taro.showLoading({
      title: "加载中"
    });
    EditHistoryTitle({ id: this.activeData.id, report_title: history_title })
      .then(res => {
        // console.log(res)
        Taro.hideLoading();
        if (isApiResponseOk(res)) {
          this.getQrcodeHistory();
          Taro.showToast({
            title: "修改成功"
          });
          this.setState({
            openConfirm: false,
            history_title: ""
          });
          this.activeData = {};
        }
      })
      .catch(() => {
        Taro.hideLoading();
      });
  };

  componentDidShow() {
    this.getQrcodeHistory();
  }

  render() {
    const { qrcode_history } = this.state;
    return (
      <View className={styles.container}>
      <View className={styles.topbg_View}></View>
      <View className={styles.bg_View}>

        {qrcode_history.length ? (
          <ScrollView
            scrollY
            className={styles.scrollView}
            // style={{ height: `calc(100vh - ${statusBar_Height + navBar_Height + 'px'})` }}
          >
            <View className={styles.history_list}>
              {qrcode_history.map(item => {
                return (
                  <AtSwipeAction
                    className={styles.actionBox}
                    autoClose
                    onClick={this.handleClick}
                    key={item.id}
                    options={[
                      {
                        text: "修改",
                        type: EDIT,
                        id: item.id,
                        data: item,
                        style: {
                          backgroundColor: "#6190E8"
                        }
                      },
                      {
                        text: "删除",
                        type: DELETE,
                        id: item.id,
                        data: item,
                        style: {
                          backgroundColor: "#FF4949"
                        }
                      }
                    ]}
                  >
                    <View
                      className={styles.list_item}
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
                        <View className={styles.title}>
                          {item.report_title}
                        </View>
                        <View className={styles.subtitle}>
                          {item.report_subtitle}
                        </View>
                      </View>
                      <View className={styles.more}>
                        <Text className={styles.iconfont}>&#xe7be;</Text>
                      </View>
                    </View>
                  </AtSwipeAction>
                );
              })}
            </View>
          </ScrollView>
        ) : (
          <View className={styles.err_area}>
            <View className={styles.img_area}>
              <Image src={NoDataSvg} />
            </View>
            <View className={styles.err_text}>
              访问 <Text className={styles.com_domain}>lingxi.di-an.com</Text> ，扫描统计二维码
            </View>
            {/* <View className={styles.scanCodeBtn}> */}
              <Button   onClick={this.toScanCode}>
              扫描二维码
              </Button>
            {/* </View> */}
          </View>
        )}
      </View>

        <AtFloatLayout
          isOpened={this.state.openConfirm}
          title="修改标题"
          onClose={val => {
            this.setState({
              openConfirm: false
            });
          }}
        >
          <View className={styles.confirmTitle}>
            <View className={styles.text_content}>
              <Textarea
                placeholder="请输入您的标题"
                value={this.state.history_title}
                autoFocus
                onInput={val => {
                  this.setState({
                    history_title: val.target.value
                  });
                }}
              />
            </View>
            <View className={styles.text_button}>
              <Button
                size="mini"
                type="default"
                onClick={() => {
                  this.setState({
                    openConfirm: false,
                    history_title: ""
                  });
                }}
              >
                取消
              </Button>
              <Button size="mini" type="primary" onClick={this.saveTitle}>
                确定
              </Button>
            </View>
          </View>
        </AtFloatLayout>
      </View>
    );
  }
}
