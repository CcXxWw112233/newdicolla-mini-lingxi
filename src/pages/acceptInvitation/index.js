import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button} from '@tarojs/components'
import indexStyles from './index.scss'
import accept_Invitation_Logo from '../../asset/Invitation/accept_Invitation_Logo.png'
import Invalid_Image from '../../asset/Invitation/qrCode_Invalid.png'
import forward_Tips from '../../asset/Invitation/forward_Tips.png'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ invitation: { qrCodeInfo } }) => ({
  qrCodeInfo
}))
export default class acceptInvitation extends Component {
    config = {
      navigationBarTitleText: '灵犀协作'
    }
    state = {
      
    }
    onShareAppMessage () {
      return {
        title: '灵犀',
        path: '/page/acceptInvitation/index?id=123'
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
      const { dispatch } = this.props
      const qrCodeInfo = this.props.qrCodeInfo
      const boardId = qrCodeInfo.id
      dispatch({
        type: 'invitation/userScanCodeJoinOrganization',
        payload: {
          id: queryId,
          board_Id: boardId
        }
      })
    }
  

    /*
    renderXX = () => {
      const qrCodeInfo = this.props.qrCodeInfo
      const user_name = qrCodeInfo.user_name
      return (
        <View className={`${globalStyles.global_horrizontal_padding}`}>
        {}
        <View className={indexStyles.effective_contain}>
          <Image src={forward_Tips} className={indexStyles.effective_forwardTips}>
          </Image>
        </View>
        <View className={indexStyles.effective_contain1}>
          <Image src={accept_Invitation_Logo} className={indexStyles.effective_logo} />
        </View>
        <View className={indexStyles.effective_tipsText}>你的好友 {user_name} 邀请你加入项目</View>
        <Button className={`${indexStyles.effective_login_btn_wx} ${indexStyles.effective_acceptBtn}`} onClick={this.acceptTheInvitation}>接受邀请</Button>
      </View>
      )
    }
    renderYY = () => {
      return (
        <View className={`${globalStyles.global_horrizontal_padding}`}>
        <View className={indexStyles.invalid_contain1}>
          <Image src={Invalid_Image} className={indexStyles.invalid_qrCode_Invalid} />
        </View>
        <View className={indexStyles.invalid_text1}>二维码已失效</View>
        <View className={indexStyles.invalid_text2}>请联系邀请人重新获取邀请码</View>
      </View>
      )
    }
    render () {
      const qrCodeInfo = this.props.qrCodeInfo
      const theLoad = qrCodeInfo.code
      return ( 
        theLoad = 1 ? this.renderXX() : this.renderYY()
      )
    }
    */

   render () {
    const qrCodeInfo = this.props.qrCodeInfo
    const user_name = qrCodeInfo.user_name
    return ( 
        <View className={`${globalStyles.global_horrizontal_padding}`}>
        {}
        <View className={indexStyles.effective_contain}>
          <Image src={forward_Tips} className={indexStyles.effective_forwardTips}>
          </Image>
        </View>
        <View className={indexStyles.effective_contain1}>
          <Image src={accept_Invitation_Logo} className={indexStyles.effective_logo} />
        </View>
        <View className={indexStyles.effective_tipsText}>你的好友 {user_name} 邀请你加入项目</View>
        <Button className={`${indexStyles.effective_login_btn_wx} ${indexStyles.effective_acceptBtn}`} onClick={this.acceptTheInvitation}>接受邀请</Button>
      </View>
    )
  }
}
  
  