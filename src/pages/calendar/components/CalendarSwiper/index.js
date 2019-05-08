import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Swiper, SwiperItem } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../gloalSet/styles/globalStyles.scss'

export default class CalendarSwiper extends Component {

  state = {
    swiper_list: [0, 1, 2],
    current_indi: 1,
    windowWidth: 0
  }
  componentWillReceiveProps (nextProps) {

  }

  componentWillUnmount () { }

  componentDidShow () {
    const systemInfo = Taro.getSystemInfoSync()
    const { windowWidth } = systemInfo
    console.log(windowWidth)

    this.setState({
      windowWidth
    })
  }

  componentDidHide () { }

   swiperChangeHandle = (decoration) => {
    if('to_left' == decoration) {
      console.log('向左')
    } else {
      console.log('向右')

    }
  }

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
    console.log(decoration)
    this.swiperChangeHandle(decoration)
    this.setState({
      current_indi: current
    })
  }
  render () {
    const { swiper_list = [], current_indi, windowWidth } = this.state

    const week_array = ['日', '一', '二', '三', '四', '五', '六']
    const date_array = new Array(35)
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
            return (
              <View className={indexStyles.date_day} key={`${key}_${windowWidth}`} style={`width: ${windowWidth / 7}px`}>
                <View
                  className={`${indexStyles.date_day_inner}  ${key==5 && indexStyles.is_now_date}  ${key==5 && indexStyles.date_day_selected} ${(key < 2 || key > 30) && indexStyles.no_current_month_date}`}>
                  <Text>{key == 5? '今':key}</Text>
                  <View className={`${indexStyles.check_has_task}`}>
                    <View className={`${indexStyles.has_task}`}></View>
                    <View className={`${indexStyles.has_flow}`}></View>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    )
    return (
      <View className={indexStyles.calendar_out}>
        <Swiper
          className={indexStyles.month_area_swiper}
          onChange={this.swiperChange}
          current={current_indi}
          circular>
          {swiper_list.map((value, key) => {
            return (
              <SwiperItem className={indexStyles.month_area} key={key}>
                {renderDate}
              </SwiperItem>
            )
          })}
        </Swiper>
      </View>
    )
  }
}
