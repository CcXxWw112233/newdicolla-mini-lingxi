import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import Aavatar from '../../components/avatar/index'
import { connect } from '@tarojs/redux'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'

@connect(({ accountInfo, my }) => ({
  accountInfo, my
}))
export default class My extends Component {
  constructor(){
    super(...arguments)
    this.state={name:'hello world'}
  }
  config = {
    navigationBarTitleText: '我的'
  }

  componentWillReceiveProps () {
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.getAccountInfo()
  }

  componentDidHide () { }

  //获取用户信息
  getAccountInfo() {
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
    //   dispatch({
    //     type: 'accountInfo/updateDatas',
    //     payload: {
    //       account_info
    //     }
    //   })
    // }
  }

  gotoAccountDetail = ()=> {
    Taro.navigateTo({
      url: '../../pages/personalCenter/index'
    })
  }

  addAction = ()=>{
    console.log(this.props)
    let {dispatch} = this.props
    const { my: { count = 0 } } = this.props
    let newCount = count
    dispatch({
      type:'my/updateDatas',
      payload:{
        count: ++ newCount
      }
    })
  }
  minusAction(){
    let {dispatch} = this.props
    const { my: { count = 0 } } = this.props
    let newCount = count
    dispatch({
      type:'my/updateDatas',
      payload:{
        count: --newCount
      }
    })
  }
  render () {
    const { account_info = {} } = this.props.accountInfo
    const { avatar, name, user_set = {} } = account_info
    const { org_name, current_org } = user_set
    let {count}=this.props.my
    console.log(count)
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


        <View>数字为：{count}</View>
        <Button onClick={() => this.addAction()}>+</Button>
        <Button onClick={this.minusAction}>-</Button>
      </View>
    )
  }
 
}

