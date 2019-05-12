import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Swiper, SwiperItem } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../gloalSet/styles/globalStyles.scss'
import { getMonthDate, isToday, isSamDay } from './getDate'
import { connect } from '@tarojs/redux'

@connect(({ calendar }) => ({
  calendar
}))
export default class CalendarSwiper extends Component {

  constructor(props) {
    super(props)
  }
  state = {
    swiper_list: [0, 1, 2],
    current_indi: 1, //滑动组件当前所在哪个点
    windowWidth: 0,
    selected_timestamp: new Date().getTime(), //当前选择的日期
    show_whole_calendar: '0', // 0 /1 /2 初始/展开/关闭
  }
  componentWillReceiveProps (nextProps) {

  }

  componentWillUnmount () { }

  componentDidMount() {
    this.getDataArray({})
    this.getSelectDateDetail()
    const systemInfo = Taro.getSystemInfoSync()
    const { windowWidth } = systemInfo
    this.setState({
      windowWidth,
    })
  }

  componentDidShow () {
    this.getDataArray({})
    this.getSelectDateDetail()
    const systemInfo = Taro.getSystemInfoSync()
    const { windowWidth } = systemInfo
    this.setState({
      windowWidth,
    })
  }

  componentDidHide () { }

  //获取日历列表数据
  getDataArray = ({year, month}) => {
    const date_array = getMonthDate({year, month})
    this.setState({
      date_array
    })
  }

  //滑动后处理数据
  swiperChangeHandle = (decoration) => {
    const { select_year, select_month, select_date_no  } = this.state
    let select_year_new = select_year
    let select_month_new = select_month
    let select_date_no_new = select_date_no

    if('to_left' == decoration) { //增加
      if(select_month == 12) {
        select_month_new = 1
        select_year_new = select_year + 1
      }else {
        select_month_new = select_month + 1
      }
    } else { //减少
      if(select_month == 1) {
        select_month_new = 12
        select_year_new = select_year - 1
      }else {
        select_month_new = select_month - 1
      }
    }
    const new_timestamp = new Date(`${select_year_new}/${select_month_new}/${select_date_no_new}`).getTime()
    this.updateSelecedTime(new_timestamp)
    this.getDataArray({year: select_year_new, month: select_month_new})
    this.getSelectDateDetail(new_timestamp)
  }

  //监听滑动
  swiperChange = (e) => {
    const { detail: { current }} = e
    const { current_indi } = this.state
    let decoration
    if(0 == current_indi) {
      if(1 == current) {
        decoration = 'to_left'
      }else if(2 == current){
        decoration = 'to_right'
      }
    }else if(1 == current_indi) {
      if(0 == current) {
        decoration = 'to_right'
      }else if(2 == current){
        decoration = 'to_left'
      }
    }else if(2 == current_indi) {
      if(0 == current) {
        decoration = 'to_left'
      }else if(1 == current){
        decoration = 'to_right'
      }
    }
    this.swiperChangeHandle(decoration)
    this.setState({
      current_indi: current
    })
  }

  //选择日期
  selectDate = ( string) => {
    const arr = string.split('__')
    const timestamp = arr[0]
    const no_in_select_month = arr[1]
    if(!no_in_select_month || no_in_select_month != 'undefined') {
      return
    }
    this.updateSelecedTime(Number(timestamp))
    this.getSelectDateDetail(timestamp)
  }

  //获取选择日期的详情
  getSelectDateDetail(timestamp) {
    const select_date = timestamp? new Date(Number(timestamp)):new Date()
    const select_year = select_date.getFullYear()
    const select_month = select_date.getMonth() + 1
    const select_date_no= select_date.getDate()
    const select_week_day = select_date.getDay()
    const select_week_day_arr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const select_week_day_dec = select_week_day_arr[select_week_day]
    this.setState({
      select_year,
      select_month,
      select_date_no,
      select_week_day_dec,
    })
  }

  setShowWholeCalendar() {
    const { show_whole_calendar } = this.state
    let show_flag = '0'
    if('0' == show_whole_calendar) {
      show_flag = '2'
    }else if('1' == show_whole_calendar) {
      show_flag = '2'
    }else if('2' == show_whole_calendar) {
      show_flag = '1'
    }else {

    }
    this.setState({
      show_whole_calendar: show_flag
    })
  }

  updateSelecedTime = (timestamp) => {
    const { dispatch } = this.props
    this.setState({
      selected_timestamp: timestamp
    })
    dispatch({
      type: 'calendar/updateDatas',
      payload: {
        selected_timestamp: timestamp
      }
    })
    //获取排期列表
    dispatch({
      type: 'calendar/getScheCardList',
      payload: {
        selected_timestamp: timestamp
      }
    })
  }

  render () {
    const { swiper_list = [], current_indi, windowWidth, date_array = [], selected_timestamp, select_year, select_month, select_date_no, select_week_day_dec, show_whole_calendar} = this.state

    const week_array = ['日', '一', '二', '三', '四', '五', '六']
    const renderDate = (
      <View className={indexStyles.month_area}>
        <View className={indexStyles.week_head}>
          {week_array.map((value, key) => {
            return (
              <View className={indexStyles.week_day} key={key}>{value}</View>
            )
          })}
        </View>
        <View className={indexStyles.date_area}>
          {date_array.map((value, key) => {
            const { date_no, timestamp, is_today, is_has_task, is_has_flow, no_in_select_month } = value
            const is_selected = isSamDay(selected_timestamp, timestamp)
            return (
              <View className={indexStyles.date_day} key={`${timestamp}_${date_no}`} style={`width: ${windowWidth / 7}px`}>
                <View
                  onClick={this.selectDate.bind(this, `${timestamp}__${no_in_select_month}`)}
                  className={`${indexStyles.date_day_inner}  ${is_today && indexStyles.is_now_date}  ${is_selected && indexStyles.date_day_selected} ${no_in_select_month && indexStyles.no_current_month_date}`}>
                  <Text>{is_today? '今':date_no}</Text>
                  <View className={`${indexStyles.check_has_task} ${no_in_select_month && indexStyles.check_has_task_no_current_moth}`}>
                    {/*{is_has_task && (*/}
                      {/*<View className={`${indexStyles.has_task}`} style={`background-color: ${is_selected? '#ffffff' : '#1890FF' }`}></View>*/}
                    {/*)}*/}
                    {/*{is_has_flow && (*/}
                      {/*<View className={`${indexStyles.has_flow}`}></View>*/}
                    {/*)}*/}
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    )
    const renderDateVisual = (
      <View className={indexStyles.month_area}>
        <View className={indexStyles.week_head}>
          {week_array.map((value, key) => {
            return (
              <View className={indexStyles.week_day} key={key}>{value}</View>
            )
          })}
        </View>
        <View className={indexStyles.date_area}>
          {date_array.map((value, key) => {
            const { date_no, timestamp, is_today, is_has_task, is_has_flow, no_in_select_month } = value
            return (
              <View className={indexStyles.date_day} key={`${timestamp}_${date_no}`} style={`width: ${windowWidth / 7}px`}>
                <View
                  className={`${indexStyles.date_day_inner} ${no_in_select_month && indexStyles.no_current_month_date}`}>
                  <Text>{date_no}</Text>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    )

    return (
      <View className={indexStyles.index}>
        <View  className={indexStyles.calendar_out}>
          <Swiper
            className={`${indexStyles.month_area_swiper} ${show_whole_calendar == '0' && indexStyles.swiper_show_nomal} ${show_whole_calendar == '1'&& indexStyles.swiper_show_whole} ${show_whole_calendar == '2'&& indexStyles.swiper_show_part}`}
            onChange={this.swiperChange}
            current={current_indi}
            duration={100}
            circular>
            {swiper_list.map((value, key) => {
              return (
                <SwiperItem className={indexStyles.month_area} key={key}>
                  {current_indi == key? renderDate : renderDateVisual}
                  </SwiperItem>
              )
            })}
          </Swiper>
          <View className={indexStyles.date_detail_dec}>
            {select_year}年{select_month}月{select_date_no}日 {select_week_day_dec}
          </View>
          <View className={indexStyles.set_calendar}>
            <View className={`${globalStyles.global_iconfont} ${show_whole_calendar == '0' && indexStyles.set_calendar_icon_nomal} ${show_whole_calendar == '1'&& indexStyles.set_calendar_icon_all} ${show_whole_calendar == '2'&& indexStyles.set_calendar_icon_part}`} onClick={this.setShowWholeCalendar}>&#xe653;</View>
          </View>
        </View>
        <View className={`${indexStyles.calendar_back} ${show_whole_calendar == '0' && indexStyles.calendar_back_nomal} ${show_whole_calendar == '1'&& indexStyles.calendar_back_all} ${show_whole_calendar == '2'&& indexStyles.calendar_back_part}`}></View>
      </View>
    )
  }
}
