import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import RunningBoard from './components/RuningBoard'
import indexStyles from './index.scss'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { request} from "../../utils/request";
import { getBar } from '../../services/index/index'
import SearchAndMenu from './components/SearchAndMenu'
import BoardTypeSelect from './components/BoardTypeSelect/index'
import { connect } from '@tarojs/redux'

@connect(({ board }) => ({
  board
}))
export default class Board extends Component {
  config = {
    "navigationBarTitleText": '项目',
    "enablePullDownRefresh": true,
    "backgroundColor": '#696969',
  }

  state = {
    page_number: 1,
    show_board_select_type: '0', //出现项目选择
    search_mask_show: '0', /// 0默认 1 淡入 2淡出
  }

  onPullDownRefresh(res) {
    this.getBoardList()
    Taro.showNavigationBarLoading()
    setTimeout(function () {
      Taro.stopPullDownRefresh()
      Taro.hideNavigationBarLoading()
    }, 300)
  }

  onReachBottom() {
    this.setState((prevState) => ({
      page_number: ++prevState.page_number
    }), () => {
      console.log(this.state)
      this.getBoardList()
    })
  }

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.getBoardList()
  }

  componentDidHide () { }

  onSelectType = ({show_type}) => {
    this.setState({
      show_board_select_type: show_type,
      search_mask_show: show_type
    })
  }

  getBoardList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'board/getBoardList',
      payload: {
        page_number: this.state.page_number,
        page_size: 7
      }
    })
  }

  render () {
    const { board: { board_id }} = this.props
    const { show_board_select_type, search_mask_show } = this.state
    return (
      <View >
        <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={search_mask_show} />
        <View>
          <BoardTypeSelect show_board_select_type={show_board_select_type} onSelectType={this.onSelectType} />
        </View>
        <RunningBoard />
        <View style='height: 50px'></View>
      </View>
    )
  }
}

