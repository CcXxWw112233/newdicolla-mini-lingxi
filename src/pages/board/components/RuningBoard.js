import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import RunningBoardItem from './RunningBoardItem'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ board }) => ({
  board
}))
export default class RuningBoard extends Component {

  render () {
    const { board: { board_list = [], curent_page_number_total, page_size }} = this.props
    console.log(this.props, 'RuningBoard')
    return (
      <View className={`${indexStyles.board_item_out} ${globalStyles.global_horrizontal_padding}`}>
        {board_list.map((value, key) => {
          const { board_id } = value
          return (
            <View key={board_id}>
              <RunningBoardItem board_item={value}/>
            </View>
          )
        })}
        {
          curent_page_number_total >= page_size ?  <View className={indexStyles.no_more_text}>疯狂加载中...</View> :
          <View className={indexStyles.no_more_text}>没有更多内容了~</View>
        }
      </View>
    )
  }
}
