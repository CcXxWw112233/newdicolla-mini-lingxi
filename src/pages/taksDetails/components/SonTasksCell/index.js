import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'

export default class index extends Component {

  componentWillReceiveProps() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { child_data } = this.props
    return (
      <View className={indexStyles.list_item}>
        <View className={`${indexStyles.list_item_left_iconnext}`}>
          <Text className={`${globalStyle.global_iconfont}`}>&#xe7f4;</Text>
        </View>
        <View className={indexStyles.list_item_name}>子任务</View>
        <View className={indexStyles.content_list_item_detail}>
          {child_data.map((item, key) => (
            <View className={indexStyles.content_list_item} key={key}>
              <View className={`${indexStyles.content_list_item_left_iconnext}`}>
                <Text className={`${globalStyle.global_iconfont}`}>&#xe661;</Text>
              </View>
              <View className={indexStyles.content_list_item_name}>{item.card_name}</View>
            </View>
          ))
          }
        </View>
      </View>
    )
  }
}
