import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import Aavatar from '../../components/avatar/index'

import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'

export default class selectOrg extends Component {

  config = {
    navigationBarTitleText: '选择组织'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  setTitle = () => {
      Taro.setNavigationBarTitle({
        title: '哈哈哈阿瑟东拉哈是得利卡及时了解卡上劳动课哈哈哈阿瑟东拉哈是得利卡及时了解卡上劳动课'
      })
  }
  render () {
    const org_list = [1, 2, 3, 4]
    return (
      <View className={indexStyles.index}>
        <View className={indexStyles.contain2}>
          {org_list.map((value, key) => {
            return (
              <View className={indexStyles.list_item_out} key={key}>
                <View className={indexStyles.list_item}>
                  <View className={indexStyles.list_item_name}>姓名</View>
                  <View className={indexStyles.list_item_detail}>刘谢</View>
                  <View className={`${indexStyles.list_item_iconnext}`}>
                    <Text className={`${globalStyle.global_iconfont}`}>&#xe646;</Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}

