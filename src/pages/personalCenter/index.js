import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import Aavatar from '../../components/avatar/index'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtDivider  } from "taro-ui"

import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'

class PersonalCenter extends Component {
  config = {
    navigationBarTitleText: '个人信息'
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
    const logoutModal = (
      <View>
        <AtModal isOpened style="width: 270px">
          <AtModalContent>
            <View className={indexStyles.comfir_modal_conent}>
              <View>退出登录</View>
              <View>确认要退出登录</View>
            </View>

          </AtModalContent>
          <AtModalAction>
            <Button>取消</Button>
            <Button>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
    return (
      <View className={indexStyles.index}>
        <View className={indexStyles.contain1}>
          <View>
            <Aavatar avartarTotal={'single'} size={48} />
          </View>
          <View className={indexStyles.contain1_name}>严士威</View>
        </View>
        <View className={indexStyles.contain2}>
          <View className={indexStyles.list_item}>
            <View className={indexStyles.list_item_name}>姓名</View>
            <View className={indexStyles.list_item_detail}>刘谢</View>
            <View className={`${indexStyles.list_item_iconnext}`}>
              <Text className={`${globalStyle.global_iconfont}`}>&#xe646;</Text>
            </View>
          </View>
          <View className={indexStyles.list_item}>
            <View className={indexStyles.list_item_name}>组织</View>
            <View className={indexStyles.list_item_detail}>阿萨德阿萨德阿萨德阿萨德阿萨德阿萨德阿萨德阿萨德阿萨德</View>
            <View className={`${indexStyles.list_item_iconnext}`}>
              <Text className={`${globalStyle.global_iconfont}`}>&#xe646;</Text>
            </View>
          </View>
          <View className={indexStyles.list_item}>
            <View className={indexStyles.list_item_name}>手机号</View>
            <View className={indexStyles.list_item_detail}>13833332222</View>
            <View className={`${indexStyles.list_item_iconnext}`}>
              <Text className={`${globalStyle.global_iconfont}`}>&#xe646;</Text>
            </View>
          </View>
          <View className={indexStyles.list_item}>
            <View className={indexStyles.list_item_name}>邮箱号</View>
            <View className={indexStyles.list_item_detail}>1212@212ss</View>
            <View className={`${indexStyles.list_item_iconnext}`}>
              <Text className={`${globalStyle.global_iconfont}`}>&#xe646;</Text>
            </View>
          </View>

        </View>
        <View className={indexStyles.logout}>
          切换账号
        </View>
        {logoutModal}
      </View>
    )
  }
}

export default PersonalCenter
