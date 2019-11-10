import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Aavatar from '../../components/avatar/index'
import { connect } from '@tarojs/redux'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'

@connect(({ accountInfo, my }) => ({
  accountInfo, my
}))
export default class My extends Component {
  config = {
    navigationBarTitleText: '我的'
  }

  componentWillReceiveProps() {
  }

  componentWillUnmount() { }

  componentDidShow() {
    this.getAccountInfo()
  }

  componentDidHide() { }

  //获取用户信息
  getAccountInfo() {
    const { dispatch, accountInfo } = this.props
    const { account_info = {} } = accountInfo
    if (JSON.stringify(account_info) == '{}') {
      dispatch({
        type: 'accountInfo/getAccountInfo',
        payload: {}
      })
    }
  }

  gotoAccountDetail = () => {
    Taro.navigateTo({
      url: '../../pages/personalCenter/index'
    })
  }

  render() {
    const { account_info = {} } = this.props.accountInfo
    const { avatar, name, user_set = {} } = account_info
    const { org_name, current_org } = user_set
    return (
      <View className={indexStyles.index}>
        <View className={indexStyles.contain1} onClick={this.gotoAccountDetail}>
          <View>
            <Aavatar avartarTotal={'single'} size={48} src={avatar} />
          </View>
          <View className={indexStyles.contain1_detail}>
            <View className={indexStyles.contain1_name}>{name}</View>
            {current_org != '0' && (
              <View className={indexStyles.contain1_org}>{org_name}</View>
            )}
          </View>
          <View className={`${indexStyles.contain1_next}`}>
            <Text className={`${globalStyle.global_iconfont} ${indexStyles.contain1_name}`}>&#xe654;</Text>
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

