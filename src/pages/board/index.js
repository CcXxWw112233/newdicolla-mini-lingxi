import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import RunningBoard from './components/RuningBoard'
import indexStyles from './index.scss'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { request } from "../../utils/request";
import { getBar } from '../../services/index/index'
import SearchAndMenu from './components/SearchAndMenu'
import BoardTypeSelect from './components/BoardTypeSelect/index'
import { connect } from '@tarojs/redux'
import BoardDetail from '../boardDetail/index'

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

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() { }

  componentDidMount() { }

  componentDidShow() {
    this.getBoardList()
  }

  componentDidHide() { }

  onSelectType = ({ show_type }) => {
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

      }
    })
  }

  render() {
    const { board: { board_list = [] } } = this.props
    const { search_mask_show } = this.state
    return (
      <View >
        <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={search_mask_show} />

        <View className={`${indexStyles.board_item_out} ${globalStyles.global_horrizontal_padding}`}>

          {board_list && board_list.map((value, key) => {
            const { board_id } = value
            return (
              <View key={board_id}>
                {/* {board_id} */}

                <RunningBoard boardId={board_id} />
                {/* <BoardDetail boardId={board_id} /> */}
              </View>
            )
          })}

          <View className={indexStyles.no_more_text}>没有更多内容了~</View>
        </View>
      </View>
    )
  }
}

