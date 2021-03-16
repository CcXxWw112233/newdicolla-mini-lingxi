import Taro, { Component } from "@tarojs/taro";
import {
  View,
  WebView,
  Image,
  Text,
  Button,
  ScrollView
} from "@tarojs/components";
import { AtSwipeAction } from "taro-ui";
import { isApiResponseOk } from "../../utils/request";
import styles from "./index.scss";
import { getQrCodeHistory, getQrCodeInfo, removeQrcode, qrCodeIsInvitation, FollowQrcode } from "../../services/invitation";
import { BOARDSTATISTICS, BoardUrl, DELETE, EDIT, TASKSTATISTICS, TaskUrl, SCANCODESUCCESS } from "./constans";
import { BASE_URL } from "../../gloalSet/js/constant";
import NoDataSvg from "../../asset/no_data.svg";

export default class QrcodeHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrcode_history: []
    };
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
    const { board_ids, query_condition, report_code } = res.data;
    let urls = "";
    if (report_code === BOARDSTATISTICS) {
      urls = BoardUrl;
    } else if (report_code === TASKSTATISTICS) {
      urls = TaskUrl;
    }
    const web_redirect_url = `${BASE_URL}/mini_web${urls}`;
    Taro.setStorageSync("query_condition", query_condition);
    Taro.hideLoading()
    Taro.navigateTo({
      url: `../seeBoardChart/index?web_redirect_url=http://192.168.1.81:8665/board_statistics.html&web_param_board_id=${board_ids}` // `${web_redirect_url}`
    });
    // this.setState({
    //   loading: false,
    //   show_err: false,
    //   wsrc: `${web_redirect_url}?board_ids=${board_ids}&token=${Taro.getStorageSync(
    //     "access_token"
    //   )}&${query_condition}`
    // });
  };

  handleClick = (val) => {
    // console.log(val)
    switch (val.type) {
      case DELETE:
        console.log('删除');
        wx.showActionSheet({
          alertText:"确定删除吗？",
          itemList: ["确定"],
          itemColor: "red",
          success: (res) => {
            if (res.tapIndex === 0) {
              // 是删除
              removeQrcode({ id: val.id }).then(resp => {
                if (isApiResponseOk(resp)) {
                  this.getQrcodeHistory()
                }
              }).catch(console.error)
            }
          }
        })
        break;
      case EDIT:
        console.log('编辑');
        break;
    }
  }

  /**
   * 校验id
   * @param {} id
   */
  qarCodeIsInvitation = ({ id }) => {
    qrCodeIsInvitation({ id }).then( async res => {
      if (isApiResponseOk(res)) {
        const { rela_id } = res.data
        await this.followQrcodeList(rela_id)
        this.handleHistoryInfo({ id: rela_id })
      }
    })
  }

  /**
   * 关注二维码
   */
   followQrcodeList = report_id => {
     return FollowQrcode({ id: report_id }).then(res => {
       this.getQrcodeHistory()
       return res
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
          title: '加载中...'
        })
        const { errMsg, path } = val;
        if (errMsg === SCANCODESUCCESS) {
          const url = decodeURIComponent(path);
          const splitArr = url.split("id/");

          this.qarCodeIsInvitation({ id: splitArr[1] });
        } else {
          Taro.hideLoading()
        }
      }
    });
  };

  render() {
    const { qrcode_history } = this.state;
    return (
      <View className={styles.container}>
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
                    autoClose
                    onClick={this.handleClick}
                    key={item.id}
                    options={[
                      {
                        text: "修改",
                        type: EDIT,
                        id: item.id,
                        style: {
                          backgroundColor: "#6190E8"
                        }
                      },
                      {
                        text: "删除",
                        type: DELETE,
                        id: item.id,
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
                      <View className={styles.more}>...</View>
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
              请前往电脑端，扫描统计二维码
            </View>
            <View className={styles.scanCodeBtn}>
              <Button type='primary' plain='true' onClick={this.toScanCode}>
                扫描二维码
              </Button>
            </View>
          </View>
        )}
      </View>
    );
  }
}
