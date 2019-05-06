import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import RunningBoard from './components/RuningBoard'
import './index.scss'
import '../../gloalSet/styles/globalStyles.scss'


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
      <View className='index global_horrizontal_padding'>
        <RunningBoard />
      </View>
    )
  }
}

export default Board
