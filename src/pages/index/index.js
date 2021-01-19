import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { getAccountInfo } from "../../services/login";
import { isApiResponseOk } from '../../utils/request';
import { connect } from '@tarojs/redux'

import styles from './index.scss'

@connect(({ login }) => ({
  login
}))
class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }
  constructor(props) {
    super(props);
    this.state = {
      is_to_login: false,
      isLoading: true
    }

    this.swiperItems = [
      {
        title: "日历清单",
        subTitle: "灵巧清晰管理项目任务",
        imgUrl: "https://dian-lingxi-public.oss-cn-beijing.aliyuncs.com/common/1242739187501895680.png"
      },
      {
        title: "项目圈",
        subTitle: "高效专注地讨论项目事项",
        imgUrl: "https://dian-lingxi-public.oss-cn-beijing.aliyuncs.com/common/1242739259660701696.png"
      },
      {
        title: "文件",
        subTitle: "随时查阅圈评项目文件",
        imgUrl: "https://dian-lingxi-public.oss-cn-beijing.aliyuncs.com/common/1242739366732894208.png"
      }
    ]
  }

  componentDidShow() {
    getAccountInfo().then(res => {
      if (isApiResponseOk(res)) {
        // 注册im
        this.registerIm();

        Taro.redirectTo({
          url: '../../pages/calendar/index'
        })
      }
    }).catch(err => {
    })
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isLoading: false
      }, 800)
    })
  }
  registerIm = () => {
    const initImData = async () => {
      const {
        globalData: {
          store: { dispatch }
        }
      } = Taro.getApp();
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
    initImData().catch(
      e => console.log(String(e))
      // Taro.showToast({ title: String(e), icon: 'none', duration: 2000 })
    );
  }

  toLogin = () => {
    // 验证token
    getAccountInfo().then(res => {
      if (isApiResponseOk(res)) {
        // 注册im
        this.registerIm();

        Taro.redirectTo({
          url: '../../pages/calendar/index'
        })
      } else {
        Taro.redirectTo({
          url: "../../pages/login/index"
        })
      }
    }).catch(err => {
    })
  }

  //获取授权信息，然后进行微信授权登录
  getUserInfo = (res) => {
    const { detail = {} } = res
    const { encryptedData, iv } = detail
    if (!!encryptedData) {
      const { dispatch } = this.props
      Taro.login().then(res => {
        const code = res.code
        Taro.getUserInfo().then(res2 => {
          const parmas = {
            encryptedData: res2.encryptedData, iv: res2.iv, code: code
          }
          dispatch({
            type: 'login/weChatAuthLogin',
            payload: {
              parmas,
            }
          })
        })
      })
    }
  }

  render() {
    let { is_to_login, isLoading } = this.state;
    return (
      <View className={styles.index}>
        {isLoading && (
          <View className={styles.loadingModal}>
            <View>
              加载中,请稍候...
            </View>
          </View>
        )}
        <View className={styles.container}>
          <Swiper indicatorDots={true} className={styles.swipers}
            indicatorActiveColor="#1890FF"
            indicatorColor="rgba(0,0,0,0.09)"
            circular={true}>
            {this.swiperItems.map(item => {
              return (
                <SwiperItem key={item.imgUrl}>
                  <Image className={styles.bannerImage} mode="aspectFit" src={item.imgUrl} />
                  <View className={styles.bannerTitle}>
                    {item.title}
                  </View>
                  <View className={styles.bannerSubTitle}>
                    {item.subTitle}
                  </View>
                </SwiperItem>
              )
            })}
          </Swiper>
          {/* </View> */}
          {
            !is_to_login ? <View>
              <Button className={styles.startBtn} onClick={() => this.setState({ is_to_login: true })}>
                登录/注册
            </Button>
              <View className={styles.startTips}>
                登录后可使用上述所有功能
            </View>
            </View> : (
                <View>
                  <Button className={`${styles.startBtn_wx}`}
                    open-type={'getUserInfo'}
                    onGetUserInfo={this.getUserInfo}>微信授权登录</Button>
                  <Button className={styles.startBtn} onClick={this.toLogin}>
                    已有账号登录
              </Button>
                </View>
              )
          }
        </View>
      </View>
    )
  }
}

export default Index
