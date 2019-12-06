import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import CardList from '../calendar/components/CardList'
import CardTypeSelect from '../calendar/components/CardTypeSelect/index'
import SearchAndMenu from '../board/components/SearchAndMenu'

import { connect } from '@tarojs/redux'

@connect(({ calendar }) => ({
  calendar
}))
export default class Calendar extends Component {

  config = {
    navigationBarTitleText: ''
  }

  state = {
    show_card_type_select: '0',
    search_mask_show: '0'
  }

  componentWillReceiveProps(nextProps) {

  }

  componentWillMount() {
    const { title } = this.$router.params
    Taro.setNavigationBarTitle({
      title
    })
  }

  componentDidShow() {
    this.getOrgBoardList()
    this.getNoScheCardList()
  }

  //获取项目列表
  getOrgBoardList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'calendar/getOrgBoardList',
      payload: {}
    })
  }

  getNoScheCardList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'calendar/getNoScheCardList',
      payload: {}
    })
  }

  componentDidHide() { }

  onSelectType = ({ show_type }) => {
    this.setState({
      show_card_type_select: show_type,
      search_mask_show: show_type
    })
  }

  render() {
    const { show_card_type_select, search_mask_show } = this.state
    return (
      <View>
        <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={search_mask_show} prohibitStyle='prohibitStyle' />
        <CardTypeSelect show_card_type_select={show_card_type_select} onSelectType={this.onSelectType} schedule={'0'} />
        <CardList schedule={'0'} />
        <View style='height: 50px'></View>
      </View>
    )
  }
}

