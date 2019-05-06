import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'

import './index.scss'

class Board extends Component {

    config = {
    navigationBarTitleText: '项目'
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
        <View><Text>项目</Text></View>
      </View>
    )
  }
}

export default Board
