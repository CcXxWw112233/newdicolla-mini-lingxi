import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import CustomNavigation from '../../components/customNavigation/CustomNavigation.js'
import accept_Invitation_Logo from '../../asset/Invitation/accept_Invitation_Logo.png'
import guide_share_01 from '../../asset/Invitation/guide_share_01.png'
import guide_share_02 from '../../asset/Invitation/guide_share_02.png'
import guide_share_03 from '../../asset/Invitation/guide_share_03.png'
import { flush } from 'redux-saga/effects'

@connect(({ invitation: { qrCodeInfo = {} } }) => ({
  qrCodeInfo
}))
export default class acceptInvitation extends Component {
  state = {
    is_mask_show: false, //是否显示引导分享遮罩
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

      this.setState({
        is_mask_show: true,
      })

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

  closeMask = () => {
    this.setState({
      is_mask_show: false,
    })
  }

  render() {
    const { qrCodeInfo = {} } = this.props
    const user_name = qrCodeInfo.user_name
    const { is_mask_show } = this.state

    const SystemInfo = Taro.getSystemInfoSync()
    const screen_Height = SystemInfo.screenHeight
    const statusBar_Height = SystemInfo.statusBarHeight
    const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48

    /***
     * 引导页面遮罩高度 = 屏幕高度 - 导航栏高度
     */
    return (
      <View>
        <CustomNavigation back_Icon='home_icon' />
        {is_mask_show && is_mask_show === true ? <View className={indexStyles.mask} style={{ height: screen_Height - (statusBar_Height + navBar_Height) + 'px', marginTop: statusBar_Height + navBar_Height + 'px' }}>

          <Image src={guide_share_01} className={indexStyles.guide_share_style_01} />
          <Image src={guide_share_02} className={indexStyles.guide_share_style_02} />
          <View onClick={this.closeMask} className={indexStyles.guide_close_style}>
            <Image src={guide_share_03} className={indexStyles.guide_close_image_style} />
          </View>

        </View> : ''
        }

        <View className={`${globalStyles.global_horrizontal_padding}`}>
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

