import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../gloalSet/styles/globalStyles.scss'

export default class CardTypeSelect extends Component {

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className={indexStyles.select_list_out}>
        <View className={indexStyles.select_list}>
          <View className={`${indexStyles.select_item} ${indexStyles.selected}`}>
            <View className={`${indexStyles.select_item_left}`}>
              任务1任务1任务1任务1任务1任务1任务1任务1任务1任务1
            </View>
            <View className={`${indexStyles.select_item_right}`}>
              <Text className={`${globalStyles.global_iconfont} ${indexStyles.select_item_itemcheck}`}>&#xe641;</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
