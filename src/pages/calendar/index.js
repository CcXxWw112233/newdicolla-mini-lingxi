import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import CardList from './components/CardList'
import indexStyles from './index.scss'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import CardTypeSelect from './components/CardTypeSelect/index'
import SearchAndMenu from '../board/components/SearchAndMenu'
import CalendarSwiper from './components/CalendarSwiper'

import { connect } from '@tarojs/redux'

@connect(({ calendar: { no_sche_card_list, selected_board_name } }) => ({
  no_sche_card_list, selected_board_name
}))
export default class Calendar extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state= {
    show_card_type_select: '0',
    search_mask_show: '0'
  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillUnmount () { }

  componentDidShow () {
    const { selected_board_name } = this.props
    Taro.setNavigationBarTitle({
      title: selected_board_name
    })
    this.getOrgList()
    this.getOrgBoardList()
    this.getNoScheCardList()
    this.getScheCardList()
  }

  //获取项目列表
  getOrgBoardList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'calendar/getOrgBoardList',
      payload: {}
    })
  }

  //获取尚未排期列表
  getNoScheCardList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'calendar/getNoScheCardList',
      payload: {}
    })
  }
  // 获取排期列表
  getScheCardList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'calendar/getScheCardList',
      payload: {}
    })
  }

  // 获取组织列表
  getOrgList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'my/getOrgList',
      payload: {}
    })
  }

  componentDidHide () { }

  onSelectType = ({show_type}) => {
    this.setState({
      show_card_type_select: show_type,
      search_mask_show: show_type
    })
  }

  gotoNoSchedule = () => {
    const { selected_board_name } = this.props
    Taro.navigateTo({
      url: `../../pages/noSchedulesCard/index?title=${selected_board_name}`
    })
  }
  render () {
    const { show_card_type_select, search_mask_show } = this.state
    const { no_sche_card_list = [] } = this.props
    return (
      <View>
        <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={search_mask_show} />
        <CalendarSwiper  />
        <CardTypeSelect show_card_type_select={show_card_type_select} onSelectType={this.onSelectType} schedule={'1'}/>
        {no_sche_card_list.length && (
          <View className={`${globalStyles.global_card_out} ${indexStyles.no_scheduling}`} onClick={this.gotoNoSchedule}>暂未排期的工作（{no_sche_card_list.length}）</View>
        )}
        <CardList schedule={'1'}/>
        <View style='height: 50px'></View>
      </View>
    )
  }
}

