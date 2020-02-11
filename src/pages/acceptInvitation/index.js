import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import CustomNavigation from './components/CustomNavigation.js'
import invitation_cover_img from '../../asset/Invitation/invitation_cover.png'
import guide_share_img from '../../asset/Invitation/guide_share.png'

@connect(({
  invitation: {
    qrCodeInfo = {},
  }
}) => ({
  qrCodeInfo,
}))
export default class acceptInvitation extends Component {
  config = {
    navigationStyle: 'custom',
  }
  state = {
    is_mask_show: false, //是否显示引导分享遮罩
  }
  onShareAppMessage() {
    const { queryId } = this.state
    return {
      title: '聆悉',
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
    Taro.setStorageSync('id', queryId)
    Taro.setStorageSync('board_Id', qrCodeInfo.rela_id)
    dispatch({
      type: 'invitation/userScanCodeJoinOrganization',
      payload: {
        id: queryId,
        relaId: qrCodeInfo.rela_id,
        relaType: qrCodeInfo.rela_type,
        pageRoute: 'acceptInvitation',
      }
    })
  }


  closeMask = () => {
    this.setState({
      is_mask_show: false,
    })
  }

  getJoinRelaType = (joinRelaType) => {
    let relaTypeName = '';
    if (["11",].indexOf(joinRelaType) != -1) {
      relaTypeName = '组织';
    }
    else if (["1", "2", "12"].indexOf(joinRelaType) != -1) {
      relaTypeName = '项目';
    }
    else if (["3", "4", "5"].indexOf(joinRelaType) != -1) {
      relaTypeName = '任务';
    }
    else if (["6", "7", "8"].indexOf(joinRelaType) != -1) {
      relaTypeName = '流程';
    }
    else if (["9", "10"].indexOf(joinRelaType) != -1) {
      relaTypeName = '文件';
    }
    else {
      relaTypeName = ''
    }
    return relaTypeName;
  }

  render() {
    const { qrCodeInfo = {}, } = this.props
    const { user_name, rela_name, rela_type } = qrCodeInfo
    const relaType = this.getJoinRelaType(rela_type)

    /**
     * 引导页面遮罩高度 = 屏幕高度 - 导航栏高度
     */
    const SystemInfo = Taro.getSystemInfoSync()
    // const screen_Height = SystemInfo.screenHeight
    const statusBar_Height = SystemInfo.statusBarHeight;
    const navBar_Height = SystemInfo.platform == 'ios' ? 44 : 48;
    // console.log("我们",wx.getMenuButtonBoundingClientRect());
    return (
      <View>
        <CustomNavigation />

        <View className={`${indexStyles.PageStyle}`}  style={{ marginTop: statusBar_Height + navBar_Height + 'px' }}>
          <View className={indexStyles.guide_share_wrapper}>
            <Image src={guide_share_img} className={indexStyles.guide_share} />
          </View>
          <View className={`${globalStyles.global_horrizontal_padding} `}>
            <View className={indexStyles.effective_contain1}>
              <Image src={invitation_cover_img} className={indexStyles.invitation_cover} />
            </View>
            <View className={indexStyles.effective_tipsText}>
              <Text>
              你的好友
              <Text style={{ display: 'inline-block', width: '6px' }}>  &nbsp; </Text>
                {user_name}
                <Text style={{ display: 'inline-block', width: '6px' }}>  &nbsp;  </Text>
                邀请你\n加入项目
                <Text style={{ display: 'inline-block', width: '6px' }}>  &nbsp;  </Text>
                {rela_name}
                <Text style={{ display: 'inline-block', width: '6px' }}>  &nbsp;  </Text>
                {relaType}
              </Text>
            </View>
            <Button className={`${indexStyles.effective_login_btn_wx} ${indexStyles.effective_acceptBtn}`} onClick={this.acceptTheInvitation}>接受邀请</Button>

          </View>

        </View>
      </View>
    )
  }
}
