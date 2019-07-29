import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Button} from '@tarojs/components'
import indexStyles from './index.scss'
import accept_Invitation_Logo from '../../asset/Invitation/accept_Invitation_Logo.png'
import forward_Tips from '../../asset/Invitation/forward_Tips.png'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'


export default class acceptInvitation extends Component {
    config = {
      navigationBarTitleText: '灵犀协作'
    }
    onShareAppMessage () {
      return {
        title: '灵犀',
        path: '/page/acceptInvitation/index?id=123'
      }
    }
    componentWillReceiveProps () {
    }
    componentWillUnmount () {
    }
    componentDidShow () {
    }
    componentDidHide () {
    }

    acceptTheInvitation = ()=> {
      Taro.navigateTo({
        url: '../../pages/nowOpen/index'
      })
    }
  
    render () {
      return (
      <View className={`${globalStyles.global_horrizontal_padding}`}>
        <View className={indexStyles.contain}>
          <Image src={forward_Tips} className={indexStyles.forwardTips}>
          点击【转发】邀请微信好友
          </Image>
        </View>
        <View className={indexStyles.contain1}>
          <Image src={accept_Invitation_Logo} className={indexStyles.logo} />
        </View>
        <View className={indexStyles.tipsText}>你的好友 xxx 邀请你\n加入项目</View>
        <Button className={`${indexStyles.login_btn_wx} ${indexStyles.acceptBtn}`} onClick={this.acceptTheInvitation}>接受邀请</Button>
      </View>
      )
    }
  }
  
  