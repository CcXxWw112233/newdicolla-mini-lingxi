import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import RunningBoardItem from './RunningBoardItem'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'

export default class RuningBoard extends Component {

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className={`${indexStyles.board_item_out} ${globalStyles.global_horrizontal_padding}`}>
        <RunningBoardItem />
        <RunningBoardItem />
        <RunningBoardItem />
        <RunningBoardItem />
        <RunningBoardItem />

      </View>
    )
  }
}
