import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import RunningBoard from '../board/components/RuningBoard'
import SearchAndMenu from '../board/components/SearchAndMenu'
import { connect } from '@tarojs/redux'

@connect(({ board }) => ({
    board
}))
export default class Board extends Component {
    config = {
        "navigationBarTitleText": '项目圈',
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
        const { board: { board_id } } = this.props
        const { show_board_select_type, search_mask_show } = this.state
        return (
            <View >
                <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={search_mask_show} />
                <View>
                </View>
                <RunningBoard />
                <View style='height: 50px'></View>
            </View>
        )
    }
}

