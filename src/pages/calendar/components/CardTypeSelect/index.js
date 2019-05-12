import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../gloalSet/styles/globalStyles.scss'

import { connect } from '@tarojs/redux'

@connect(({ calendar: { board_list, selected_board } }) => ({
  board_list, selected_board
}))
export default class CardTypeSelect extends Component {

  componentWillReceiveProps (nextProps) {

  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  quitCoperate = () => {
    this.props.onSelectType && this.props.onSelectType({show_type: '2'})
  }

  updateSelectedBoard = (board_str) => {
    const { dispatch, schedule } = this.props
    const { board_id, board_name } = JSON.parse(board_str)
    dispatch({
      type: 'calendar/updateDatas',
      payload: {
        selected_board: board_id
      }
    })
    this.quitCoperate()
    if('1' == schedule) {
      dispatch({
        type: 'calendar/getScheCardList',
        payload: {
          selected_board: board_id
        }
      })
    } else if('0' == schedule) {
      dispatch({
        type: 'calendar/getNoScheCardList',
        payload: {
          selected_board: board_id
        }
      })
    }
  }

  render () {
    const { show_card_type_select, board_list = [], selected_board } = this.props

    return (
      <View className={indexStyles.select_list_out}>
        <View className={`${indexStyles.select_list} ${'0' == show_card_type_select && indexStyles.select_list_normal} ${'1' == show_card_type_select && indexStyles.select_list_show} ${'2' == show_card_type_select && indexStyles.select_list_hide}`}>
          <View className={`${indexStyles.select_item} ${indexStyles.selected}`} onClick={this.updateSelectedBoard.bind(this, '0')}>
            <View className={`${indexStyles.select_item_left}`}>
              所有参与项目
            </View>
            {'0' == selected_board && (
              <View className={`${indexStyles.select_item_right}`}>
                <Text className={`${globalStyles.global_iconfont} ${indexStyles.select_item_itemcheck}`}>&#xe641;</Text>
              </View>
            )}

          </View>
          {board_list.map((value, key) => {
            const { board_name, board_id } = value
            return(
              <View className={`${indexStyles.select_item} ${indexStyles.selected}`} key={board_id} onClick={this.updateSelectedBoard.bind(this, board_id)}>
                <View className={`${indexStyles.select_item_left}`}>
                  {board_name}
                </View>
                {board_id == selected_board && (
                  <View className={`${indexStyles.select_item_right}`}>
                    <Text className={`${globalStyles.global_iconfont} ${indexStyles.select_item_itemcheck}`}>&#xe641;</Text>
                  </View>
                )}
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}

CardTypeSelect.defaultProps = {
  schedule: '2', //1排期 0 没有排期
}
