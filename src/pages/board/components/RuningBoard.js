import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import RunningBoardItem from './RunningBoardItem'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import GroupList from '../../boardDetail/components/GroupList'

@connect(({ board, im: { allBoardList } }) => ({
  board, allBoardList,

}),
  dispatch => {
    return {
      setCurrentBoardId: boardId =>
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentBoardId: boardId
          },
          desc: 'im set current board id.'
        }),
      setCurrentBoard: (board = {}) =>
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentBoard: board
          },
          desc: 'im set current board.'
        }),
      resetCurrentChatTo: () =>
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentChatTo: ''
          },
          desc: 'reset currentChatTo'
        }),
      resetCurrentGroup: () =>
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentGroup: {}
          },
          desc: 'reset currentGroup'
        }),

      resetCurrentGroupSessionList: () =>
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentGroupSessionList: []
          },
          desc: 'reset currentGroupSessionList'
        }),
      checkTeamStatus: boardId =>
        dispatch({
          type: 'im/checkTeamStatus',
          payload: {
            boardId
          },
          desc: 'check im team status.'
        })
    };
  }
)
export default class RuningBoard extends Component {

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() { }

  componentDidShow() {
    this.getBoardList()
  }

  componentDidHide() { }

  getBoardList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'board/getBoardList',
      payload: {

      }
    })
  }

  render() {
    const {
      allBoardList,
      setCurrentBoardId,
      setCurrentBoard,
      checkTeamStatus
    } = this.props;
    const { board: { board_list = [] } } = this.props;
    console.log("allBoardList", allBoardList);

    return (
      <View>
        <View className={`${indexStyles.board_item_out} ${globalStyles.global_horrizontal_padding}`}>
          <View key={board_id}>
            {/* <RunningBoardItem board_item={value}/> */}
            <GroupList />
          </View>
        </View>
      </View>
    )
  }
}
