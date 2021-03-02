import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import CustomNavigation from '../acceptInvitation/components/CustomNavigation.js'

export default class qrCodeInvalid extends Component {
  config = {
    navigationStyle: 'custom',
  }
  state = {
    qrCodeInValidText: '请联系邀请人重新获取加入'
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
    const { qrCodeInValidText } = this.state;
    return (
      <View className={indexStyles.index}>
        <CustomNavigation />
        <View className={indexStyles.invalid_logoView}>

          <View className={indexStyles.invalid_logo}>
            <Text className={`${globalStyle.global_iconfont}`}>&#xe842;</Text>
          </View>
          <View className={indexStyles.invalid_Text}>页面已失效</View>
          <View className={indexStyles.invalid_subText}>{qrCodeInValidText}</View>
        </View>
      </View>
    )
  }
}
