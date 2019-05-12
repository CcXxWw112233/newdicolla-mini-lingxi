import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../gloalSet/styles/globalStyles.scss'

export default class BoardTypeSelect extends Component {

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  quitCoperate = () => {
    this.props.onSelectType && this.props.onSelectType({show_type: '2'})
  }

  render () {
    const { show_board_select_type } = this.props

    return (
      <View className={indexStyles.select_list_out} >
        <View className={`${indexStyles.select_list} ${'0' == show_board_select_type && indexStyles.select_list_normal} ${'1' == show_board_select_type && indexStyles.select_list_show} ${'2' == show_board_select_type && indexStyles.select_list_hide}`}>
          <View className={`${indexStyles.select_item} ${indexStyles.selected}`} onClick={this.quitCoperate}>
            <View className={`${indexStyles.select_item_left}`}>
              正在进行的项目
            </View>
            <View className={`${indexStyles.select_item_right}`}>
              <Text className={`${globalStyles.global_iconfont} ${indexStyles.select_item_itemcheck}`}>&#xe641;</Text>
            </View>
          </View>
          <View className={`${indexStyles.select_item} ${indexStyles.selected}`}>
            <View className={`${indexStyles.select_item_left}`} style={{color: '#8c8c8c'}}>
              已归档的项目
            </View>
            <View className={`${indexStyles.select_item_right}`}>
              {/*<Text className={`${globalStyles.global_iconfont} ${indexStyles.select_item_itemcheck}`}>&#xe641;</Text>*/}
            </View>
          </View>
        </View>
      </View>
    )
  }
}
