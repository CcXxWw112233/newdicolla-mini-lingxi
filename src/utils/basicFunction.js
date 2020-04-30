//该文件为公共与业务逻辑相关
import Taro from '@tarojs/taro'
import { number, string } from 'prop-types';
import { Base64 } from 'js-base64';

export const getCurrentOrgByStorage = () => {
  const account_info_string = Taro.getStorageSync('account_info')
  let current_org = '0'
  if (!!account_info_string) {
    const account_info = JSON.parse(account_info_string)
    const { user_set = {} } = account_info
    current_org = user_set['current_org']
  }
  return current_org
}

export const getOrgName = ({ org_id, org_list = [] }) => {
  const name = (org_list.find(item => item['id'] == org_id) || {}).name
  return name
}

export const timestampToTimeZH = (timestamp) => {
  if (!timestamp) {
    return ''
  }
  const length = timestamp.length
  const newTimestampStr = length < 13 ? Number(timestamp) * 1000 : Number(timestamp)
  const date = new Date(newTimestampStr)
  const current_year = new Date().getFullYear()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let date_no = date.getDate()
  let hours = date.getHours()
  let min = date.getMinutes()
  // year = current_year != year?`${year}年`: ''
  month = month < 10 ? `0${month}` : month
  date_no = date_no < 10 ? `0${date_no}` : date_no
  hours = hours < 10 ? `0${hours}` : hours
  min = min < 10 ? `0${min}` : min

  return `${year}年${month}月${date_no}日 ${hours}:${min}`
}

export const timestampFormat = (timestamp, format = 'yyyy-MM-dd h:m:s') => {
  if (!timestamp) {
    return ''
  }
  let thisDate = null;
  if (typeof timestamp === 'number' || typeof timestamp === 'string') {
    thisDate = new Date(timestamp)
  } else {
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


export const timestampWeek = (format) => {
  if (!format) {
    return ''
  }

  const formatDate = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [year, month, day].map(formatNumber).join('-')
  }

  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }

  //todate默认参数是当前日期，可以传入对应时间 todate格式为2018-10-05
  function getDates(days, format) {
    var dateArry = [];
    for (var i = 0; i < days; i++) {
      var dateObj = dateLater(todate, i);
      dateArry.push(dateObj)
    }
    return dateArry;
  }

  function dateLater(dates, later) {
    let dateObj = {};
    let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
    let date = new Date(dates);
    date.setDate(date.getDate() + later);
    let day = date.getDay();
    let yearDate = date.getFullYear();
    let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
    let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
    dateObj.time = yearDate + '-' + month + '-' + dayFormate;
    dateObj.week = show_day[day];
    return dateObj;
  }
}


export const setBoardIdStorage = (value) => {
  Taro.setStorageSync('storageCurrentOperateBoardId', value)
  // 从缓存中拿到相应的board_id对应上org_id，存储当前项目的org_id => aboutBoardOrganizationId,
  // 如果当前组织确定（非全部组织），则返回当前组织
  const OrganizationId = Taro.getStorageSync('OrganizationId', value)
  if (OrganizationId && OrganizationId != '0') {
    Taro.setStorageSync('aboutBoardOrganizationId', OrganizationId)
    return
  }

  let userAllOrgsAllBoards = Taro.getStorageSync('userAllOrgsAllBoards') || '[]'
  if (userAllOrgsAllBoards) {
    userAllOrgsAllBoards = JSON.parse(userAllOrgsAllBoards)
  }
  let org_id = ''
  for (let val of userAllOrgsAllBoards) {
    for (let val_2 of val['board_ids']) {
      if (value == val_2) {
        org_id = val['org_id']
        break
      }
    }
    if (org_id) {
      break
    }
  }
  Taro.setStorageSync('aboutBoardOrganizationId', org_id || '0')
}

export const setRequestHeaderBaseInfo = ({ data, params = {}, headers = {} }) => {

  // console.log('=========', 'data = ', data, 'params = ', params, 'headers = ', headers);

  let header_base_info_orgid = Taro.getStorageSync('OrganizationId') || '0'
  let header_base_info_board_id = Taro.getStorageSync('storageCurrentOperateBoardId') || '0'

  if (data['_organization_id'] || params['_organization_id']) {
    header_base_info_orgid = data['_organization_id'] || params['_organization_id']
  }

  if (data['boardId'] || params['boardId'] || data['board_id'] || params['board_id']) {
    header_base_info_board_id = data['boardId'] || params['boardId'] || data['board_id'] || params['board_id']
  }

  const header_base_info = Object.assign({
    orgId: header_base_info_orgid,
    boardId: header_base_info_board_id,
    aboutBoardOrganizationId: Taro.getStorageSync('aboutBoardOrganizationId') || '0',
  }, headers['BaseInfo'] || {})
  const header_base_info_str = JSON.stringify(header_base_info)
  const header_base_info_str_base64 = Base64.encode(header_base_info_str)
  const new_herders = {
    BaseInfo: header_base_info_str_base64
  }

  return new_herders
}

// 根据boardid查找得到orgid
export const getOrgIdByBoardId = (boardId) => {
  if (!boardId) {
    return ''
  }
  let userAllOrgsAllBoards = Taro.getStorageSync('userAllOrgsAllBoards') || '[]'
  if (userAllOrgsAllBoards) {
    userAllOrgsAllBoards = JSON.parse(userAllOrgsAllBoards)
  }
  let org_id = ''
  for (let val of userAllOrgsAllBoards) {
    for (let val_2 of val['board_ids']) {
      if (boardId == val_2) {
        org_id = val['org_id']
        break
      }
    }
    if (org_id) {
      break
    }
  }
  return org_id
}
