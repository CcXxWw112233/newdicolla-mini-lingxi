import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import accept_Invitation_Logo from '../../asset/Invitation/accept_Invitation_Logo.png'
import forward_Tips from '../../asset/Invitation/forward_Tips.png'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import CustomNavigation from './components/CustomNavigation.js'

@connect(({ invitation: { qrCodeInfo = {} } }) => ({
  qrCodeInfo
}))
export default class acceptInvitation extends Component {
  config = {
    navigationStyle: 'custom',
  }
  state = {

  }
  onShareAppMessage() {
    const { queryId } = this.state
    return {
      title: '灵犀',
      path: `/pages/acceptInvitation/index?id=${queryId}`,
      // 此处应写pages,官方文档写的是page是错误的.
    }
  }
  componentDidMount() {
  }
  componentWillReceiveProps() {
  }
  componentWillUnmount() {
  }
  componentDidShow(e) {
    const options = this.$router.params
    this.scanQRCodeJoin(options)
    this.isLoginStatus()
  }

  componentDidHide() { }

  scanQRCodeJoin(options) {

    let queryId
    if (options.scene) {  //扫码场景进入
      const sceneArr = options.scene.split('&')[0]
      queryId = sceneArr.slice(5)
    } else {  //其他场景进入
      queryId = options.id
    }

    this.setState({
      queryId,
    })
    const { dispatch } = this.props
    const params = {
      id: queryId
    }
    dispatch({
      type: 'invitation/qrCodeIsInvitation',
      payload: params
    })
  }

  isLoginStatus() {
    const access_token = Taro.getStorageSync('access_token')
    if (!access_token) {
      Taro.setStorageSync('isLoginStatus', 'yes')
    }
  }

  acceptTheInvitation = () => {
    const { queryId } = this.state
    const { dispatch, qrCodeInfo = {} } = this.props
    const boardId = qrCodeInfo.id
    Taro.setStorageSync('id', queryId)
    Taro.setStorageSync('board_Id', boardId)
    dispatch({
      type: 'invitation/userScanCodeJoinOrganization',
      payload: {
        id: queryId,
        board_Id: boardId,
        pageRoute: 'acceptInvitation',
      }
    })
  }

  render() {
    const { qrCodeInfo = {} } = this.props
    const user_name = qrCodeInfo.user_name
    return (
      <View>
        <CustomNavigation />
        <View className={`${globalStyles.global_horrizontal_padding}`}>
          <View className={indexStyles.effective_contain}>
            <Image src={forward_Tips} className={indexStyles.effective_forwardTips}></Image>
            {/* <View className={indexStyles.forwardTipsText}>点击【转发】邀请微信好友</View> */}
          </View>
          <View className={indexStyles.effective_contain1}>
            <Image src={accept_Invitation_Logo} className={indexStyles.effective_logo} />
          </View>
          <View className={indexStyles.effective_tipsText}>
            <Text>你的好友{user_name}邀请你\n加入项目</Text>
          </View>
          <Button className={`${indexStyles.effective_login_btn_wx} ${indexStyles.effective_acceptBtn}`} onClick={this.acceptTheInvitation}>接受邀请</Button>
        </View>
      </View>
    )
  }
}

