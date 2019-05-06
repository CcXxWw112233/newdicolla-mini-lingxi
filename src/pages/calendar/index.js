import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'

import './index.scss'

class Calendar extends Component {

    config = {
    navigationBarTitleText: '日历'
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
        <View><Text>日历</Text></View>
      </View>
    )
  }
}

export default Calendar
