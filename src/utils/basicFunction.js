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

export const timestampToTimeEN = (timestamp) => {
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
  month = month < 10 ? `0${month}` : month
  date_no = date_no < 10 ? `0${date_no}` : date_no
  hours = hours < 10 ? `0${hours}` : hours
  min = min < 10 ? `0${min}` : min

  return `${month}/${date_no} ${hours}:${min}`
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

// 获取当前月份的天数
export const getDaysOfEveryMonth = () => {//返回天数
  var baseMonthsDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];//各月天数
  var thisYear = new Date().getFullYear();//今年
  var thisMonth = new Date().getMonth();//今月
  var thisMonthDays = [];//这个月有多少天
  //判断是闰年吗？闰年2月29天
  const isLeapYear = (fullYear) => {
    return (fullYear % 4 == 0 && (fullYear % 100 != 0 || fullYear % 400 == 0));
  }

  const getThisMonthDays = (days) => {//传天数，返天数数组
    var arr = [];
    for (var i = 1; i <= days; i++) {
      arr.push(i);
    }
    return arr;
  }

  if (isLeapYear(thisYear) && thisMonth == 1) {//闰年2月29天
    thisMonthDays = getThisMonthDays(baseMonthsDay[thisMonth] + 1);
  } else {
    thisMonthDays = getThisMonthDays(baseMonthsDay[thisMonth]);
  }
  return thisMonthDays.length;
}

// 显示不同类型的时间 时、天、月
export const renderRestrictionsTime = (itemValue) => {
  if (!itemValue) return ''
  const { deadline_time_type, deadline_value, deadline_type, last_complete_time } = itemValue
  let total_time = '' //总时间
  let surplus_time = '' //剩余时间戳
  let now = parseInt(new Date().getTime() / 1000)
  let time_ceil = 60 * 60 //单位(3600秒)
  const take_time = now - Number(last_complete_time) //花费时间
  switch (deadline_time_type) {
    case 'hour': // 天
      total_time = deadline_value * time_ceil
      break;
    case 'day':
      total_time = deadline_value * 24 * time_ceil
      break
    case 'month':
      total_time = 30 * deadline_value * 24 * time_ceil
      break
    default:
      break;
  }
  surplus_time = total_time - take_time //86400


  let description = ''
  let time_dec = surplus_time < 0 ? '已逾期' : '剩余'
  let month_day_total = getDaysOfEveryMonth() //当前月份总天数

  let month = ''
  let day = ''
  let hour = ''
  let min = ''

  let modulus_time = Math.abs(surplus_time)
  if (modulus_time <= time_ceil) { //
    description = `${time_dec}${parseInt(modulus_time / 60)}分钟`
    // 分
  } else if (modulus_time > time_ceil && modulus_time <= 24 * time_ceil) {
    hour = parseInt(modulus_time / time_ceil)
    min = parseInt((modulus_time % time_ceil) / 60)
    if (min < 1) {
      description = `${time_dec}${hour}小时`
    } else {
      description = `${time_dec}${hour}小时${min}分钟`
    }
    // 时/分
  } else if (modulus_time > (24 * time_ceil) && modulus_time <= (month_day_total * 24 * time_ceil)) {
    day = parseInt(modulus_time / (24 * time_ceil))
    hour = parseInt(((modulus_time % (24 * time_ceil))) / time_ceil)
    if (hour < 1) {
      description = `${time_dec}${day}天`
    } else {
      description = `${time_dec}${day}天${hour}小时`
    }
    // 天/时
  } else if (modulus_time > month_day_total * 24 * time_ceil) {
    month = parseInt(modulus_time / (month_day_total * 24 * time_ceil))
    hour = parseInt((modulus_time % (month_day_total * 24 * time_ceil) / (24 * time_ceil)))
    description = `${time_dec}${month}月${hour}小时`
  } else {

  }
  return description
}

//流程审批,判断当前用户在不在审批人数组中
export const loadFindAssignees = (assignees = []) => {
  const account_info_string = Taro.getStorageSync('account_info')
  const account_info = JSON.parse(account_info_string)
  const { id } = account_info
  //判断当前等登录用户 在不在审批人assignees当中
  //不在就返回false
  //在当中根据processed状态为1,返回true,不在为返回false
  var currntAssignees = assignees.find(item => item.id == id);
  if (currntAssignees) {
    const { processed } = currntAssignees
    if (processed == '1') {
      return true
    } else {
      return false
    }
  }
  else {
    return false;
  }
}