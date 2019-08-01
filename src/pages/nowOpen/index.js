import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button} from '@tarojs/components'
import indexStyles from './index.scss'
import now_Open_Image from '../../asset/Invitation/now_Open_Image.png'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ nowOpen }) => ({
  nowOpen
}))
export default class nowOpen extends Component {
    config = {
      navigationBarTitleText: '灵犀协作'
    }
    componentWillReceiveProps () {
    }
    componentWillUnmount () { 
    }
    componentDidShow () {
    }
    componentDidHide () {
    }
    gotoLoginPage = () => {
      Taro.navigateTo({
        url: '../../pages/login/index?isSource=Invitation'
      })
    }
    getUserInfo = (res) => {
      const { detail = {} }  = res
      const { encryptedData, iv } = detail
      if(!!encryptedData) {
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
                parmas
              }
            })
          })
        })
      }
    }

    render () {
      return (
        <View className={`${globalStyles.global_horrizontal_padding}`}>
          <View className={indexStyles.contain1}>
            <Image src={now_Open_Image} className={indexStyles.nowOpenImage} />
          </View>
          <View className={indexStyles.textStyle}>即可开启协作之旅</View>
          <Button className={`${indexStyles.login_btn_wx} ${indexStyles.login_btn}`} open_type={'getUserInfo'} onGetUserInfo={this.getUserInfo}>使用微信登录</Button>
          <View className={`${indexStyles.change_login_type_out}`}>
            <View onClick={this.gotoLoginPage} className={`${indexStyles.change_login_type}`}>已有账户登录</View>
          </View>
        </View>
      )
    }
  }
  
  