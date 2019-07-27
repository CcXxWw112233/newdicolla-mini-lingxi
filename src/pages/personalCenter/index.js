import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import Aavatar from '../../components/avatar/index'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtDivider  } from "taro-ui"

import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ accountInfo, my }) => ({
  accountInfo, my
}))
class PersonalCenter extends Component {

  state = {
    show_change_account_modal: false
  }

  config = {
    navigationBarTitleText: '个人信息'
  }

  componentWillReceiveProps () { }

  componentWillUnmount () { }

  componentDidShow () {
    this.getAccountInfo()
  }

  componentDidHide () { }

  //获取用户信息
  getAccountInfo = () => {
    const { dispatch, accountInfo } = this.props
    const { account_info = {}} = accountInfo
    if(JSON.stringify(account_info) == '{}') {
      dispatch({
        type: 'accountInfo/getAccountInfo',
        payload: {}
      })
    }
    // const account_info_string = Taro.getStorageSync('user_info')
    // if(!!!account_info_string) {
    //   dispatch({
    //     type: 'accountInfo/getAccountInfo',
    //     payload: {}
    //   })
    // } else {
    //   const account_info = JSON.parse(account_info_string)
    //   const { user_set = {} } = account_info
    //   const { current_org } = user_set
    //   dispatch({
    //     type: 'accountInfo/updateDatas',
    //     payload: {
    //       account_info,
    //       current_org
    //     }
    //   })
    // }
  }

  //切换账户
  setAccountModalShow = () => {
    const { show_change_account_modal } = this.state
    this.setState({
      show_change_account_modal: !show_change_account_modal
    })
  }

  //确定切换账户
  changeAccount = () => {

    let access_token = Taro.getStorageSync('access_token')
    let refresh_token = Taro.getStorageSync('refresh_token')
    const parmas = {
      accessToken: access_token,
      refreshToken: refresh_token,
    }

    const { dispatch } = this.props
    dispatch({
      type:'accountInfo/changeOut',
      payload: {
        ...parmas
      }
    })
  }

  //前往组织
  gotoChangeOrgPage = () => {
    Taro.navigateTo({
      url: '../../pages/selectOrg/index'
    })
  }

  render () {
    const { show_change_account_modal } = this.state
    const { account_info = {} } = this.props.accountInfo
    const { avatar, name, user_set = {}, mobile, email } = account_info
    const { org_name, current_org } = user_set

    const logoutModal = (
      <View>
        <AtModal
          closeOnClickOverlay={false}
          isOpened={show_change_account_modal}
          style="width: 270px">
          <AtModalContent>
            <View className={indexStyles.comfir_modal_conent}>
              <View className={indexStyles.comfir_modal_conent_title}>切换账号</View>
              <View className={indexStyles.comfir_modal_conent_detail}>确认要切换账号</View>
            </View>

          </AtModalContent>
          <AtModalAction>
            <Button className={indexStyles.btn1} style={{color: '#1890FF'}} onClick={this.changeAccount}>确定</Button>
            <Button className={indexStyles.btn1} style={{color: '#1890FF'}} onClick={this.setAccountModalShow}>取消</Button>
          </AtModalAction>
        </AtModal>
      </View>
    )
    return (
      <View className={indexStyles.index}>
        <View className={indexStyles.contain1}>
          <View>
            <Aavatar avartarTotal={'single'} size={48} src={avatar}/>
          </View>
          <View className={indexStyles.contain1_name}>{name}</View>
        </View>
        <View className={indexStyles.contain2}>
          <View className={indexStyles.list_item}>
            <View className={indexStyles.list_item_name}>姓名</View>
            <View className={indexStyles.list_item_detail}>{name}</View>
            <View className={`${indexStyles.list_item_iconnext}`}>
              {/*<Text className={`${globalStyle.global_iconfont}`}>&#xe654;</Text>*/}
            </View>
          </View>
          <View className={indexStyles.list_item} onClick={this.gotoChangeOrgPage}>
            <View className={indexStyles.list_item_name}>组织</View>
            <View className={indexStyles.list_item_detail}>{current_org == '0'?'全组织': org_name}</View>
            <View className={`${indexStyles.list_item_iconnext}`}>
              <Text className={`${globalStyle.global_iconfont}`}>&#xe654;</Text>
            </View>
          </View>
          <View className={indexStyles.list_item}>
            <View className={indexStyles.list_item_name}>手机号</View>
            <View className={indexStyles.list_item_detail}>{mobile}</View>
            <View className={`${indexStyles.list_item_iconnext}`}>
              {/*<Text className={`${globalStyle.global_iconfont}`}>&#xe654;</Text>*/}
            </View>
          </View>
          <View className={indexStyles.list_item}>
            <View className={indexStyles.list_item_name}>邮箱号</View>
            <View className={indexStyles.list_item_detail}>{email}</View>
            <View className={`${indexStyles.list_item_iconnext}`}>
              {/*<Text className={`${globalStyle.global_iconfont}`}>&#xe654;</Text>*/}
            </View>
          </View>

        </View>
        <View className={indexStyles.logout} onClick={this.setAccountModalShow}>
          切换账号
        </View>
        {logoutModal}
      </View>
    )
  }
}

export default PersonalCenter
