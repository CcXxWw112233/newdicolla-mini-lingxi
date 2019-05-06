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

  render () {
    return (
      <View className='index'>
        <View><Text>我的</Text></View>
      </View>
    )
  }
}

export default PersonalCenter
