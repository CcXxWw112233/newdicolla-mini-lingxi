import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtTag } from 'taro-ui'

export default class index extends Component {

  componentWillReceiveProps() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { label_data = [] } = this.props
    return (
      <View className={indexStyles.list_item}>
        <View className={`${indexStyles.list_item_left_iconnext}`}>
          <Text className={`${globalStyle.global_iconfont}`}>&#xe6ac;</Text>
        </View>
        <View className={indexStyles.list_item_name}>标签</View>
        <View className={indexStyles.tagCell_list_item_detail}>
          {
            label_data.map((tag, key) => {
              const rgb = tag.label_color;
              return (
                <View className={indexStyles.tagCell_list_item}>
                  <AtTag type='primary' customStyle={{
                    color: `rgba(${rgb},1)`,
                    backgroundColor: `rgba(${rgb},.2)`,
                    border: `1px solid rgba(${rgb},1)`,
                  }}>
                    {tag.label_name}
                  </AtTag>
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}
