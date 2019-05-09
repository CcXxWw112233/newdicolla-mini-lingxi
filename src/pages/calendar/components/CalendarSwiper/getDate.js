const current_date = new Date()
const current_year = current_date.getFullYear()
const current_month = current_date.getMonth() + 1
const current_date_no= current_date.getDate()
const current_date_timestamp = current_date.getTime()
const current_week_day = current_date.getDay()

// console.log(current_date_timestamp, current_year, current_month, current_date_no)

//日期转换为时间戳
function timeToTimestamp(dateString) { // 示例 '2014-04-23 18:55:49'
  const date = new Date(dateString)
  return date.getTime()
}

//获取某年某月总共几天
function getDaysNumInMonth(year, month) {
  month = parseInt(month, 10);
  const d = new Date(year, month, 0);
  return d.getDate();
}

//获取某个一月份详细数据
function getOneMonthDateDetail(year, month) {
  const total_day = getDaysNumInMonth(year, month)
  const date_arr = []
  for(let i = 1; i < total_day + 1; i ++) {
    const obj = getNeedDate(`${year}/${month}/${i}`)
    date_arr.push(obj)
  }
  return date_arr
}

//获取周几
function getWeekDay(index) {
  const week_day_arr = new Array(7)
  week_day_arr[0] = '周日'
  week_day_arr[1] = '周一'
  week_day_arr[2] = '周二'
  week_day_arr[3] = '周三'
  week_day_arr[4] = '周四'
  week_day_arr[5] = '周五'
  week_day_arr[6] = '周六'
  return week_day_arr[index]
}

//传入日期，获取所需传入日期的年月日周几
function getNeedDate(timestring) {
  if(!timestring) {
    return {}
  }
  const date = new Date(timestring)
  const year = date.getFullYear() //年
  const month = date.getMonth() + 1 //月
  const date_no = date.getDate() //日
  const week_day = date.getDay() //周几
  const date_string = `${year}/${month}/${date_no}`
  const date_decription = `${year}年${month}月${date_no}日 ${getWeekDay(week_day)}`
  const date_timestamp = new Date(date_string).getTime()
  return {
    year,
    month,
    date_no,
    week_day,
    is_today: isToday(date_timestamp),
    date_string,
    date_decription,
    timestamp: date_timestamp,
    week_day_name: getWeekDay(week_day),
    is_has_task: true, //是否有任务
    is_has_flow: false, //是否有里程碑流程
  }
}

//获取一系列日期所属月份
function getDateTop(gold_year, gold_month) {
  return current_year == gold_year ? `${gold_month}月` : `${gold_year}年${gold_month}月`
}
//传入年份，月份获取当前月和前后一个月的数据
function getAroundDate ({year = current_year, month = current_month}) {
  //前一个月
  const front_one_year = month == 1 ? year - 1 : year
  const front_one_month = month == 1 ? 12 : month - 1
  //后一个月
  const behind_one_year = month == 12 ? year + 1 : year
  const behind_one_month = month == 12 ? 1 : month + 1

  const base_month_date = getOneMonthDateDetail(year, month) //基准月份数据
  const front_month_date = getOneMonthDateDetail(front_one_year, front_one_month)
  const behind_month_date = getOneMonthDateDetail(behind_one_year, behind_one_month)
  const three_month_date_arr = [
    {
      date_top: getDateTop(front_one_year, front_one_month),
      date_inner: front_month_date,
     },
    {
      date_top: getDateTop(year, month),
      date_inner: base_month_date,
    },
    {
      date_top: getDateTop(behind_one_year, behind_one_month),
      date_inner: behind_month_date,
    },
  ]
  const gold_arr = getCalendarData(three_month_date_arr)
  return gold_arr
}

//获取日历组件所需要的日期列表
function getCalendarData(gold_date_arr) {
  const month_select_last = gold_date_arr[0]['date_inner']
  const month_select = gold_date_arr[1]['date_inner']
  const month_select_next = gold_date_arr[2]['date_inner']
  const calendar_date_length = 35
  let date_list = new Array(calendar_date_length) //所需要的日历数据
  //所选月第一天在周几
  const month_select_first_week_day = month_select[0]['week_day']
  //所选月的上一个月要在日历前面摆放的日期
  const calendar_date_last_month = month_select_last.slice(month_select_last.length - month_select_first_week_day, month_select_last.length)
  // 所选月的下一个月要在日历摆放的日期
  const calendar_date_next_month_length = calendar_date_length - calendar_date_last_month.length - month_select.length
  const calendar_date_next_month = month_select_next.slice(0, calendar_date_next_month_length)

  //处理上一个月和下一个月所在日历表中的数据
  let calendar_date_last_month_new = []
  let calendar_date_next_month_new = []
  for(let val of calendar_date_last_month) {
    val['no_in_select_month'] = true
    calendar_date_last_month_new.push(val)
  }
  for(let val of calendar_date_next_month) {
    val['no_in_select_month'] = true
    calendar_date_next_month_new.push(val)
  }
  //最终转换数据
  date_list = [].concat(calendar_date_last_month, month_select, calendar_date_next_month)
  return date_list
}

export const getMonthDate = ({year = current_year, month = current_month}) => {
  return getAroundDate({year, month})
}

export const isToday = (timestamp) => {
  return new Date(timestamp).toDateString() === new Date().toDateString()
}

export const isSamDay = (timestamp, timestamp2) => {
  return new Date(timestamp).toDateString() === new Date(timestamp2).toDateString()
}

export const select_year = current_year
export const select_month = current_month
export const select_date = current_date_no
export const select_week_day = current_week_day
