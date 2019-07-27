//该文件为公共与业务逻辑相关
import Taro from '@tarojs/taro'
import { number, string } from 'prop-types';

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

export const getOrgName = ({org_id, org_list = []}) => {
  const name = (org_list.find(item => item['id'] == org_id) || {}).name
  return name
}

export const timestampToTimeZH = (timestamp) => {
  if(!timestamp) {
    return ''
  }
  const length = timestamp.length
  const newTimestampStr = length < 13? Number(timestamp) * 1000 :  Number(timestamp)
  const date = new Date(newTimestampStr)
  const current_year = new Date().getFullYear()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let date_no = date.getDate()
  let hours = date.getHours()
  let min = date.getMinutes()
  year = current_year != year?`${year}年`: ''
  month = month < 10? `0${month}`: month
  date_no = date_no < 10 ? `0${date_no}`: date_no
  hours = hours < 10 ? `0${hours}`: hours
  min = min < 10 ? `0${min}`: min

  return `${year}${month}月${date_no}日 ${hours}:${min}`
}

export const timestampFormat = (timestamp,format='yyyy-MM-dd h:m:s') => {
  if(!timestamp) {
    return ''
  }
  let thisDate = null;
  if( typeof timestamp === 'number' || typeof timestamp === 'string'){
    thisDate = new Date(timestamp)
  }else{
    thisDate = timestamp;
  }

  let date = {
    "M+": thisDate.getMonth() + 1,
    "d+": thisDate.getDate(),
    "h+": thisDate.getHours(),
    "m+": thisDate.getMinutes(),
    "s+": thisDate.getSeconds(),
    "q+": Math.floor((thisDate.getMonth() + 3) / 3),
    "S+": thisDate.getMilliseconds()
 };
 if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (thisDate.getFullYear() + '').substr(4 - RegExp.$1.length));
 }
 for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1
           ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
 }
 return format;
}
