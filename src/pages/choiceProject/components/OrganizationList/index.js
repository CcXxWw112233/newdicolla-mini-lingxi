import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ accountInfo, my }) => ({
  accountInfo, my
}))
export default class OrganizationList extends Component {

  componentWillReceiveProps () {
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.getCurrentUserOrgs()
  }

  componentDidHide () { }

  determineEvent() {

  }

  cancelEvent() {

  }

  selectiveTheOrganization() {
    console.log('1111');
  }

  getCurrentUserOrgs = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'my/getOrgList',
      payload: {}
    })
  }

  setCurrentOrg = (current_org) => {
    const { dispatch } = this.props
    //切换组织
    dispatch({
      type: 'my/changeCurrentOrg',
      payload: {
        _organization_id: current_org
      }
    })

  }

  render () {
    const { org_list = [] } = this.props.my
    const { account_info = {} } = this.props.accountInfo
    const { user_set = {} } = account_info
    const { current_org } = user_set
    return (
      <View>
          <Button className={indexStyles.cancel_style} onClick={this.cancelEvent}>取消</Button>
          <View onClick={this.selectiveTheOrganization}>全部组织</View>
          <Button className={indexStyles.determine_style} onClick={this.determineEvent}>确定</Button>

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
