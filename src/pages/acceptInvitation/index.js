import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button} from '@tarojs/components'
import indexStyles from './index.scss'
import accept_Invitation_Logo from '../../asset/Invitation/accept_Invitation_Logo.png'
import forward_Tips from '../../asset/Invitation/forward_Tips.png'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ invitation: { qrCodeInfo = {} } }) => ({
  qrCodeInfo
}))
export default class acceptInvitation extends Component {
    config = {
      navigationBarTitleText: '灵犀协作'
    }
    state = {
      
    }
    onShareAppMessage (res) {
      const { queryId } = this.state
      return {
        title: '灵犀',
        path: `/pages/acceptInvitation/index?id=${queryId}`,
        // 此处应写pages,官方文档写的是page是错误的.
      }
    }
    componentDidMount () {
      const paramete = this.$router.params
      const queryId = paramete.id
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
    componentWillReceiveProps () {
    }
    componentWillUnmount () {
    }
    componentDidShow () {
    }
    componentDidHide () {
    }

    acceptTheInvitation = () =>  {
      const { queryId } = this.state
      const { dispatch, qrCodeInfo = {} } = this.props
      // const qrCodeInfo = this.props.qrCodeInfo
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

    render () {
      const { qrCodeInfo = {} }= this.props
      const user_name = qrCodeInfo.user_name
      return (
        <View className={`${globalStyles.global_horrizontal_padding}`}>
          <View className={indexStyles.effective_contain}>
            <Image src={forward_Tips} className={indexStyles.effective_forwardTips}></Image>
          </View>
          <View className={indexStyles.effective_contain1}>
            <Image src={accept_Invitation_Logo} className={indexStyles.effective_logo} />
          </View>
          <View className={indexStyles.effective_tipsText}>你的好友{user_name}邀请你加入项目</View>
            <Button className={`${indexStyles.effective_login_btn_wx} ${indexStyles.effective_acceptBtn}`} onClick={this.acceptTheInvitation}>接受邀请</Button>
        </View>
      )
    }
}
  
  