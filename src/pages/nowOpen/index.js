import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import now_Open_Image from '../../asset/Invitation/now_Open_Image.png'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import invitation_cover_img from '../../asset/Invitation/invitation_cover.png'

@connect(({ nowOpen }) => ({
  nowOpen
}))
export default class nowOpen extends Component {
  config = {
    navigationBarTitleText: '聆悉'
  }
  gotoLoginPage = () => {
    Taro.navigateTo({
      url: '../../pages/login/index?redirect=Invitation'
    })
  }
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
              sourcePage: 'Invitation',
            }
          })
        })
      })
    }
  }

  render() {
    return (
      <View className={`${indexStyles.index}`}>
        <View className={indexStyles.contain1}>
          <Image src={invitation_cover_img} className={indexStyles.nowOpenImage} />
        </View>
        <View className={indexStyles.textStyle}>欢迎来到聆悉协作</View>
        <Button className={`${indexStyles.login_btn_wx} ${indexStyles.login_btn}`} open_type={'getUserInfo'} onGetUserInfo={this.getUserInfo}>
          <Text className={`${globalStyle.global_iconfont} ${indexStyles.wx_iconfont}`}>&#xe846;</Text>
          <View className={indexStyles.wx_text}>使用微信登录</View>
        </Button>
        <View className={`${indexStyles.login_btn} ${indexStyles.login_btn_Account}`}>
          <View onClick={this.gotoLoginPage} className={`${indexStyles.change_login_type}`}>手机号码登录/注册
</View>
        </View>

        <View className={indexStyles.loginMark}>登录代表您已同意<Text className={indexStyles.loginMarkText}>聆悉用户服务协议、隐私政策</Text></View>

      </View>
    )
  }
}

