import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import Aavatar from '../../components/avatar/index'

import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'

export default class My extends Component {
  config = {
    navigationBarTitleText: '我的'
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
    return (
      <View className={indexStyles.index}>
        <View className={indexStyles.contain1}>
          <View>
            <Aavatar avartarTotal={'single'} size={48} />
          </View>
          <View className={indexStyles.contain1_detail}>
            <View className={indexStyles.contain1_name}>严士威</View>
            <View className={indexStyles.contain1_org}>哈哈哈阿瑟东拉哈是得利卡及时了解卡上劳动课哈哈哈阿瑟东拉哈是得利卡及时了解卡上劳动课</View>
          </View>
          <View className={`${indexStyles.contain1_next}`}>
            <Text className={`${globalStyle.global_iconfont} ${indexStyles.contain1_name}`}>&#xe646;</Text>
          </View>
        </View>
        <View className={indexStyles.contain2}>
          <View className={indexStyles.contain2_item}>
            <View className={indexStyles.contain2_item_top}>
              <Text className={`${globalStyle.global_iconfont} ${indexStyles.app_icon}`}>&#xe645;</Text>
            </View>
            <View className={indexStyles.contain2_item_bott}>优秀案例</View>
          </View>
          <View className={indexStyles.contain2_item}>
            <View className={indexStyles.contain2_item_top}>
              <Text className={`${globalStyle.global_iconfont} ${indexStyles.app_icon}`}>&#xe645;</Text>
            </View>
            <View className={indexStyles.contain2_item_bott}>政策法规</View>
          </View>
          <View className={indexStyles.contain2_item}>
            <View className={indexStyles.contain2_item_top}>
              <Text className={`${globalStyle.global_iconfont} ${indexStyles.app_icon}`}>&#xe645;</Text>
            </View>
            <View className={indexStyles.contain2_item_bott}>我的展示</View>
          </View>
          <View className={indexStyles.contain2_item}>
            <View className={indexStyles.contain2_item_top}>
              <Text className={`${globalStyle.global_iconfont} ${indexStyles.app_icon}`}>&#xe645;</Text>
            </View>
            <View className={indexStyles.contain2_item_bott}>投资地图</View>
          </View>

        </View>
      </View>
    )
  }
}

