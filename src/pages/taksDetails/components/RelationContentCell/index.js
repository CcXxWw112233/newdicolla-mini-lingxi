import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from '../SonTasksCell/index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux';

@connect(({ tasks: { content_Link = [] } }) => ({
  content_Link,
}))
export default class index extends Component {

  render() {
    const { content_Link } = this.props

    return (

      <View>
        {
          content_Link.length > 0 ? <View className={indexStyles.list_item}>
            <View className={`${indexStyles.list_item_left_iconnext}`}>
              <Text className={`${globalStyle.global_iconfont}`}>&#xe6aa;</Text>
            </View>
            <View className={indexStyles.list_item_name}>关联内容</View>
            <View className={indexStyles.content_list_item_detail}>
              {
                content_Link.map((item, key) => (
                  <View className={indexStyles.content_list_item} key={key}>
                    <View className={`${indexStyles.content_list_item_left_iconnext}`}>
                      <Text className={`${globalStyle.global_iconfont}`}>&#xe66a;</Text>
                    </View>
                    <View className={indexStyles.content_list_item_name}>{item.linked_name}</View>
                  </View>
                ))
              }
            </View>
          </View> : ''
        }

      </View>
    )
  }
}
