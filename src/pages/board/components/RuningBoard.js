import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import RunningBoardItem from './RunningBoardItem'
import './index.scss'
import '../../../gloalSet/styles/globalStyles.scss'

export default class RuningBoard extends Component {

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className="board_item_out">
        <RunningBoardItem />
      </View>
    )
  }
}
