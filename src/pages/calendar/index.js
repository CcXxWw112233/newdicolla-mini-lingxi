import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import CardList from './components/CardList'
import indexStyles from './index.scss'
import CardTypeSelect from './components/CardTypeSelect/index'
import SearchAndMenu from '../board/components/SearchAndMenu'
import CalendarSwiper from './components/CalendarSwiper'

import { connect } from '@tarojs/redux'

@connect(({ calendar }) => ({
  calendar
}))
export default class Calendar extends Component {

  config = {
    navigationBarTitleText: '日历'
  }

  state= {
    show_card_type_select: '0',
    search_mask_show: '0'
  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillUnmount () { }

  componentDidShow () {
    this.getOrgBoardList()
  }

  //获取项目列表
  getOrgBoardList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'calendar/getOrgBoardList',
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

  render () {
    const { show_card_type_select, search_mask_show } = this.state
    return (
      <View>
        <SearchAndMenu onSelectType={this.onSelectType}search_mask_show={search_mask_show} />
        <CalendarSwiper  />
        <CardTypeSelect show_card_type_select={show_card_type_select} onSelectType={this.onSelectType}/>
        <CardList />
        <View style='height: 50px'></View>
      </View>
    )
  }
}

