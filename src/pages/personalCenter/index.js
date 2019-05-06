import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'

import './index.scss'

class PersonalCenter extends Component {

    config = {
    navigationBarTitleText: '我的'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  setTitle = () => {
      Taro.setNavigationBarTitle({
        title: '哈哈哈阿瑟东拉哈是得利卡及时了解卡上劳动课哈哈哈阿瑟东拉哈是得利卡及时了解卡上劳动课'
      })
  }
  render () {
    return (
      <View className='index'>
        <View onClick={this.setTitle}><Text>我的</Text></View>
      </View>
    )
  }
}

export default PersonalCenter
