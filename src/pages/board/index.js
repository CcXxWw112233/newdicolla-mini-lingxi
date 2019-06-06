import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import RunningBoard from './components/RuningBoard'
import SearchAndMenu from './components/SearchAndMenu'
import BoardTypeSelect from './components/BoardTypeSelect/index'
import { connect } from '@tarojs/redux'

@connect(({ board }) => ({
  board
}))
export default class Board extends Component {
  // 配置信息
  config = {
    "navigationBarTitleText": '项目',
    "enablePullDownRefresh": true,
    "backgroundColor": '#696969',
  }

  // 数据
  state = {
    page_number: 1, // 每次加载的页码，默认加载第一页
    curent_page_number_total: 6,  // 当前加载的条数
    show_board_select_type: '0', //出现项目选择
    search_mask_show: '0', /// 0默认 1 淡入 2淡出
  }
  
  // 上拉刷新
  onPullDownRefresh(res) {
    this.getBoardList()
    Taro.showNavigationBarLoading()
    setTimeout(function () {
      Taro.stopPullDownRefresh()
      Taro.hideNavigationBarLoading()
    }, 300)
  }

  /**
   * 监听滚动事件
   */
  onScrollToLower() {
    this.setState((prevState) => ({
      page_number: ++prevState.page_number,
      curent_page_number_total: prevState.curent_page_number_total
    }), () => {
      // console.log(this.state)
      this.getBoardList()
    })
  }
  
  // componentWillReceiveProps (nextProps) {
  //   // console.log(nextProps)
  //   const { board: { curent_page_number_total } } = nextProps
  //   // 异步的操作
  //   this.setState({
  //     curent_page_number_total
  //   })
    
  // }

  componentDidShow () {
    this.getBoardList()
  }

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
        page_size: 6 // 每页显示的条数
      }
    })
  }
  
  render () {
    const { board: { board_id }} = this.props
    // console.log(this.props, 'Board')
    const screenHeight = Taro.getSystemInfoSync().screenHeight
    // console.log(typeof screenHeight)
    const { show_board_select_type, search_mask_show } = this.state
    return (
      <View>
        <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={search_mask_show} />
        <View>
          <BoardTypeSelect show_board_select_type={show_board_select_type} onSelectType={this.onSelectType} />
        </View>
        <ScrollView
          scrollY={true}
          style={
            {height: `${screenHeight}px`}
          }
          onScrollToLower={this.onScrollToLower}
        >
          <RunningBoard />
        </ScrollView>
        <View style='height: 50px'></View>
      </View>
    )
  }
}

