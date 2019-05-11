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
    navigationBarTitleText: '项目'
  }

  state = {

  }

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.getBoardList()
  }

  componentDidHide () { }

  onSelectType = (e) => {

  }

  getBoardList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'board/getBoardList',
      payload: {

      }
    })
  }

  render () {
    const { board: { board_id }} = this.props

    return (
      <View >
        <SearchAndMenu onSelectType={this.onSelectType}  />
        {/*<BoardTypeSelect />*/}
        <RunningBoard />
        <View style='height: 50px'></View>

      </View>
    )
  }
}

