import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import Invalid_Image from '../../asset/Invitation/qrCode_Invalid.png'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import CustomNavigation from '../acceptInvitation/components/CustomNavigation.js'

export default class qrCodeInvalid extends Component {
  config = {
    navigationStyle: 'custom',
  }
  state = {
    qrCodeInValidText: '请联系邀请人重新获取邀请码'
  }
  componentDidMount() {
    const qrCodeInValidText = Taro.getStorageSync('qrCodeInValidText')
    if (qrCodeInValidText) {
      this.setState({
        qrCodeInValidText
      })
      Taro.removeStorageSync('qrCodeInValidText')
    }
  }

  render() {
    return (
      <View>
        <CustomNavigation />
        <View className={`${globalStyles.global_horrizontal_padding}`}>
          <View className={indexStyles.contain1}>
            <Image src={Invalid_Image} className={indexStyles.qrCode_Invalid} />
          </View>
          <View className={indexStyles.text1}>二维码已失效</View>
          <View className={indexStyles.text2}>{this.state.qrCodeInValidText}</View>
        </View>
      </View>
    )
  }
}
