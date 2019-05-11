import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ accountInfo, my }) => ({
  accountInfo, my
}))
export default class selectOrg extends Component {

  config = {
    navigationBarTitleText: '选择组织'
  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillUnmount () { }

  componentDidShow () {
    this.getCurrentUserOrgs()
  }

  componentDidHide () { }

  getCurrentUserOrgs = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'my/getOrgList',
      payload: {}
    })
  }

  setCurrentOrg = (current_org) => {
    const { dispatch } = this.props
    dispatch({
      type: 'accountInfo/updateDatas',
      payload: {
        current_org
      }
    })
    dispatch({
      type: 'my/changeCurrentOrg',
      payload: {
        org_id: current_org
      }
    })
  }

  render () {
    const { org_list = [] } = this.props.my
    const { current_org } = this.props.accountInfo

    return (
      <View className={indexStyles.index}>
        <View className={indexStyles.contain2}>
          <View className={indexStyles.list_item_out} onClick={this.setCurrentOrg.bind(this, '0')}>
            <View className={indexStyles.list_item}>
              <View className={indexStyles.list_item_name}>全组织</View>
              <View className={`${indexStyles.list_item_iconnext}`}>
                {current_org == '0' && (
                  <Text className={`${globalStyle.global_iconfont}`}>&#xe641;</Text>
                )}
              </View>
            </View>
          </View>
          {org_list.map((value, key) => {
            const { name, id, } = value
            return (
              <View className={indexStyles.list_item_out} key={id} onClick={this.setCurrentOrg.bind(this, id)}>
                <View className={indexStyles.list_item}>
                  <View className={indexStyles.list_item_name}>{name}</View>
                  <View className={`${indexStyles.list_item_iconnext}`}>
                    {current_org == id && (
                      <Text className={`${globalStyle.global_iconfont}`}>&#xe641;</Text>
                    )}
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

