import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Input, Button } from '@tarojs/components'
import indexStyles from './index.scss'
import auccess_Join_image from '../../asset/Invitation/auccess_Join.png'
import pc_Website_image from '../../asset/Invitation/pcWebsite.png'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ im:
  {
    allBoardList,
    currentBoard,
  },
}) => ({
  allBoardList,
  currentBoard,
}),
  dispatch => {
    return {
      setCurrentBoardId: boardId => {
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentBoardId: boardId
          },
          desc: 'im set current board id.'
        })
      },
      setCurrentBoard: (board = {}) => {
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentBoard: board
          },
          desc: 'im set current board.'
        })
      },
      checkTeamStatus: boardId => {
        dispatch({
          type: 'im/checkTeamStatus',
          payload: {
            boardId
          },
          desc: 'check im team status.'
        })
      },


      setCurrentChatTo: im_id =>
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentChatTo: im_id
          },
          desc: 'set currentChatTo'
        }),
      setCurrentGroup: (group = {}) => {
        dispatch({
          type: 'im/updateStateFieldByCover',
          payload: {
            currentGroup: group
          },
          desc: 'set current chat group.'
        });
      },
      updateCurrentChatUnreadNewsState: im_id =>
        dispatch({
          type: 'im/updateCurrentChatUnreadNewsState',
          payload: {
            im_id
          },
          desc: 'update currentChat unread news'
        }),
    }
  }
)

export default class auccessJoin extends Component {
  config = {
    navigationBarTitleText: '聆悉'
  }
  constructor() {
    super(...arguments)
    this.state = {
      copyText: '复制',
      pcWebsite: 'lingxi.di-an.com',
      board_id: '',
    }
  }

  componentDidMount() {
    const param = this.$router.params
    const route = param.pageRoute
    const { boardId } = param

    this.setState({
      board_id: boardId,
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

  copyPCWebsite = () => {
    const { pcWebsite } = this.state
    Taro.setClipboardData({
      data: pcWebsite,
      success: function () {
      }
    }).then()

    this.setState({
      copyText: '复制成功',
    })
  }

  enterUse = () => {

    //查找当前文件对应的board, 对应的im_id
    const { board_id } = this.state

    const { setCurrentBoardId, setCurrentBoard, allBoardList, checkTeamStatus, } = this.props
    const fileIsCurrentBoard = allBoardList.filter((item, index) => {
      if (item.board_id === board_id) {
        return item
      }
    })

    if (fileIsCurrentBoard.length === 0) return
    const { im_id } = fileIsCurrentBoard && fileIsCurrentBoard[0]

    const getCurrentBoard = (arr, id) => {
      const ret = arr.find(i => i.board_id === id);
      return ret ? ret : {};
    };
    Promise.resolve(setCurrentBoardId(board_id))
      .then(() => {
        setCurrentBoard(getCurrentBoard(allBoardList, board_id))
      }).then(() => {
        checkTeamStatus(board_id)
      }).then(() => {
        this.validGroupChat({ im_id })
      })
      .catch(e => console.log('error in boardDetail: ' + e));
  }

  validGroupChat = ({ im_id },) => {
    const {
      setCurrentChatTo,
      setCurrentGroup,
      updateCurrentChatUnreadNewsState,
      currentBoard,
    } = this.props

    if (!im_id) {
      Taro.showToast({
        title: '当前群未注册',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    //生成与 云信后端返回数据相同格式的 id
    const id = `team-${im_id}`;
    //设置currentChatTo之后，会自动将该群的新接收的消息更新为已读，
    //但是如果该群之前有未读消息的时候，需要先更新该群的未读消息状态
    const getCurrentGroup = (currentBoard, im_id) => {
      if (!currentBoard.childs || !Array.isArray(currentBoard.childs)) {
        currentBoard.childs = [];
      }
      const ret = [currentBoard, ...currentBoard.childs].find(
        i => i.im_id === im_id
      );
      return ret ? ret : {};
    };

    Promise.resolve(setCurrentChatTo(id))
      .then(() => setCurrentGroup(getCurrentGroup(currentBoard, im_id)))
      .then(() => updateCurrentChatUnreadNewsState(id))
      .then(() => {
        const { board_id } = currentBoard
        Taro.navigateTo({
          url: `../../pages/chat/index?boardId=${board_id}&pageSource=auccessJoin`
        })
      })
      .catch(e => Taro.showToast({ title: String(e), icon: 'none', duration: 2000 }));
  }

  render() {
    const { copyText } = this.state
    return (
      <View className={`${indexStyles.index}`} >
        <View className={indexStyles.contain1}>
          <Image src={auccess_Join_image} className={indexStyles.auccess_Join} />
        </View>
        <View className={indexStyles.text1}>已成功加入项目</View>
        {/* <View className={indexStyles.text2}>
          <Text>在PC上输入以下网址可访问聆悉网页版</Text>
        </View>
        <View className={indexStyles.cardTip}>
          <Image src={pc_Website_image} className={indexStyles.pc_Website_image} />
          <View className={indexStyles.pcWebsiteStyle}>
            <View className={indexStyles.cardContentStyle}>
              <View className={indexStyles.inputStyle}>
                <Text className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}>&#xe6bd;</Text>
                <Text selectable={true}>{pcWebsite}</Text>
              </View>
              {copyText === '复制成功' ?
                <View className={indexStyles.copySuccessStyle}>{copyText}</View>
                :
                <View className={indexStyles.copyButtonStyle} onClick={this.copyPCWebsite} >{copyText}</View>
              }
            </View>
          </View>
            </View>*/}
        <Button className={`${indexStyles.effective_login_btn_wx} ${indexStyles.effective_acceptBtn}`} onClick={this.enterUse}>进入小程序使用</Button>
      </View>
    )
  }
}



