import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'

export default class index extends Component {

  componentWillReceiveProps () { }

  componentDidMount() { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    
    return (
      <View className={indexStyles.viewStyle}>
        <View className={indexStyles.list_item}>
          <View className={`${indexStyles.list_item_left_iconnext}`}>
            <Text className={`${globalStyle.global_iconfont}`}>&#xe6aa;</Text>
          </View>
          <View className={indexStyles.list_item_name}>关联内容</View>
          <View className={indexStyles.relationContentCell_list_item_detail}>
            <View className={indexStyles.relationContentCell_list_item}>
              <View className={`${indexStyles.relationContentCell_list_item_left_iconnext}`}>
                <Text className={`${globalStyle.global_iconfont}`}>&#xe66a;</Text>
              </View>
              <View className={indexStyles.relationContentCell_list_item_name}>这是关联的任务</View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
