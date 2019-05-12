//该文件为公共与业务逻辑相关
import Taro from '@tarojs/taro'

export const getCurrentOrgByStorage = () => {
  const account_info_string = Taro.getStorageSync('account_info')
  let current_org = '0'
  if(!!account_info_string) {
    const account_info = JSON.parse(account_info_string)
    const { user_set = {} } = account_info
    current_org = user_set['current_org']
  }
  return current_org
}
