import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../gloalSet/styles/globalStyles.scss'

import { connect } from '@tarojs/redux'

@connect(({ searchMenu }) => ({
  searchMenu
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

  render () {
    const { show_card_type_select } = this.props
    const card_list = [1, 2 ,3, 4, 5, 6, 7 ]

    return (
      <View className={indexStyles.select_list_out}>
        <View className={`${indexStyles.select_list} ${'0' == show_card_type_select && indexStyles.select_list_normal} ${'1' == show_card_type_select && indexStyles.select_list_show} ${'2' == show_card_type_select && indexStyles.select_list_hide}`}>
          {card_list.map((value, key) => {
            return(
              <View className={`${indexStyles.select_item} ${indexStyles.selected}`} key={key} onClick={this.quitCoperate}>
                <View className={`${indexStyles.select_item_left}`}>
                  任务1任务1任务1任务1任务1任务1任务1任务1任务1任务1
                </View>
                <View className={`${indexStyles.select_item_right}`}>
                  <Text className={`${globalStyles.global_iconfont} ${indexStyles.select_item_itemcheck}`}>&#xe641;</Text>
                </View>
              </View>

            )
          })}

        </View>
      </View>
    )
  }
}
