import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import RunningBoardItem from './RunningBoardItem'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import GroupList from '../../boardDetail/components/GroupList'

@connect(({ board }) => ({
  board
}))
export default class RuningBoard extends Component {

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() { }

  componentDidShow() {
    this.getBoardList()
  }

  componentDidHide() { }

  getBoardList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'board/getBoardList',
      payload: {

      }
    })
  }

  render() {
    const { board: { board_list = [] } } = this.props

    return (
      <View className={`${indexStyles.board_item_out} ${globalStyles.global_horrizontal_padding}`}>
        {board_list.map((value, key) => {
          const { board_id } = value
          return (
            <View key={board_id}>
              <RunningBoardItem board_item={value} />
            </View>
          )
        })}
        <View className={indexStyles.no_more_text}>没有更多内容了~</View>
      </View>
    )
  }
}
