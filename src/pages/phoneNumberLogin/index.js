import Taro, { Component } from '@tarojs/taro'
import { View, Button, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import indexStyles from './index.scss'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import linxi_logo from '../../asset/login/lingxi_logo.png'

const getEffectOrReducerByName = name => `login/${name}`
@connect(({ login }) => ({
  login
}))
export default class phoneNumberLogin extends Component {

  config = {
    navigationBarTitleText: '手机号登录',
    user_key: '',
    sourcePage: '',
  }

  componentWillReceiveProps(nextProps) { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentWillMount() {
    const { user_key, sourcePage } = this.$router.params
    this.setState({
      user_key: user_key,
      sourcePage: sourcePage
    })
  }

  componentDidHide() { }

  onGetPhoneNumberLogin = (userInfo) => {
    if (userInfo.detail.encryptedData) {   //同意
      Taro.login().then(res => {
        const code = res.code
        const parmas = {
          encryptedData: userInfo.detail.encryptedData,
          iv: userInfo.detail.iv,
          code: code, key: this.state.user_key,
        }
        const { dispatch } = this.props
        const sourcePage = this.state.sourcePage
        const phoneNumberBind = 'phoneNumberBind'

        dispatch({
          type: getEffectOrReducerByName('weChatPhoneLogin'),
          payload: {
            parmas,
            sourcePage,
            phoneNumberBind,
          }
        })
      })
    } else { //拒绝,保持当前页面，直到同意
      Taro.showToast({
        icon: 'none',
        title: '您拒绝了授权手机号登录',
        duration: 2000
      })
    }

  }
  gotoLoginPage = () => {
    Taro.navigateBack()
  }
  render() {
    return (
      <View className={`${globalStyles.global_horrizontal_padding}`}>
        <View className={indexStyles.contain1}>
          <Image src={linxi_logo} className={indexStyles.linxi_logo} />
        </View>
        <View className={indexStyles.confirm_detail}>您未绑定账号</View>
        <Button className={`${indexStyles.login_btn_wx} ${indexStyles.login_btn}`} open_type='getPhoneNumber' onGetPhoneNumber={this.onGetPhoneNumberLogin}>微信手机号快捷登录</Button>
        <View className={`${indexStyles.change_login_type_out}`}>
          <View onClick={this.gotoLoginPage} className={`${indexStyles.change_login_type}`}>账号密码登录</View>
        </View>
      </View>
    )
  }
}

