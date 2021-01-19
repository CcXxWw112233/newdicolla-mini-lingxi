import Taro, { Component } from '@tarojs/taro'
import { isApiResponseOk } from '../../utils/request'
import { connect } from '@tarojs/redux'
import CustomNavigation from '../acceptInvitation/components/CustomNavigation.js'

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

export default class sceneEntrance extends Component {

    state = {
        params_options: {}, //路由传过来的对象
    }
    config = {
        navigationStyle: 'custom',
    }
    componentDidMount() {
        const options = this.$router.params
        this.sceneEntrancePages(options)
        this.setState({
            params_options: options,
        })
    }

    componentDidShow() {
        this.sceneEntrancePages(this.state.params_options)
    }

    sceneEntrancePages(options) {
        /***
         * redirectType 对象类型 错误页面=0 项目=1 任务=2 会议=3 流程=4 文件=5 每日代办=6
         * contentId 对象id
         * boardId 项目id
         * currentDate 每日代办的日期时间
         */
        const { redirectType, contentId, boardId, currentDate } = options
        const { globalData: { store: { dispatch } } } = Taro.getApp()
        let pageObject
        let that = this

        if (redirectType === '6') {
            Taro.setStorageSync('isTodoList', currentDate)
            Promise.resolve(
                dispatch({
                    type: 'my/changeCurrentOrg',
                    payload: {
                        _organization_id: '0',
                        isTodo: 'todoList',
                    }
                })
            ).then(res => {
                if (isApiResponseOk(res)) {
                    Taro.redirectTo({ url: `../../pages/calendar/index` })
                }
            })
        } else {
            if (redirectType === '0') {  //未知错误
                Taro.setStorageSync('sceneEntrance_Goto_Other', 'errorPage')
                pageObject = 'errorPage'
            } else if (redirectType === '1' || redirectType === '7') {  //1 项目详情  7 公众号未读消息(通知路径/统计未读路径)
                // @通知路径 ： pages/sceneEntrance/index?redirectType=7&boardId=1111111
                // 统计未读路径 ： pages/sceneEntrance/index?redirectType=7&boardId=
                // 进不进具体圈子 看 boardId 是不是空
                if (boardId.match(/^[ ]*$/)) {
                    Taro.redirectTo({ url: `../../pages/boardChat/index` })
                    return
                }

                Taro.setStorageSync('sceneEntrance_Goto_Other', 'chat')
                Taro.setStorageSync('board_Id', boardId)

                Promise.resolve(
                    dispatch({
                        type: 'im/fetchAllIMTeamList',
                        payload: {}
                    })
                ).then(() => {
                    dispatch({
                        type: 'board/getBoardDetail',
                        payload: {
                            id: boardId,
                        }
                    }).then(res => {
                        if (isApiResponseOk(res)) {
                            pageObject = 'chat'

                            const { setCurrentBoardId, setCurrentBoard, allBoardList, checkTeamStatus, } = this.props
                            const fileIsCurrentBoard = allBoardList.filter((item, index) => {
                                if (item.board_id === boardId) {
                                    return item
                                }
                            })

                            if (fileIsCurrentBoard.length === 0) return
                            const { im_id } = fileIsCurrentBoard && fileIsCurrentBoard[0]

                            const getCurrentBoard = (arr, id) => {
                                const ret = arr.find(i => i.board_id === id);
                                return ret ? ret : {};
                            };
                            Promise.resolve(setCurrentBoardId(boardId))
                                .then(() => {
                                    setCurrentBoard(getCurrentBoard(allBoardList, boardId))
                                }).then(() => {
                                    checkTeamStatus(boardId)
                                }).then(() => {
                                    that.validGroupChat({ im_id }, pageObject, contentId)
                                })
                                .catch(e => console.log('error in boardDetail: ' + e));
                        }
                        return
                    })
                })

            } else if (redirectType === '2' || redirectType === '8') {  //2 任务类型 8 日程类型
                pageObject = 'taksDetails'
            } else if (redirectType === '3') { //会议

            } else if (redirectType === '4') { //流程
                pageObject = 'templateDetails'
            } else if (redirectType === '5') {  //文件预览
                Promise.resolve(
                    //解决wx.switchTab不能传值
                    Taro.setStorageSync('switchTabFileInfo', {
                        contentId: contentId,
                        boardId: boardId,
                        push: 'officialAccount',
                    })
                ).then(() => {
                    Taro.redirectTo({ url: `../../pages/file/index` })
                    return
                })
            }
            if (pageObject) {
                Taro.navigateTo({
                    url: `../../pages/${pageObject}/index?contentId=${contentId}&boardId=${boardId}&push=sceneEntrance&flag=${redirectType}`
                })
            }
        }
    }

    validGroupChat = ({ im_id }, pageObject, contentId) => {

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
                    url: `../../pages/${pageObject}/index?contentId=${contentId}&boardId=${board_id}&pageSource=sceneEntrance`
                })
            })
            .catch(e => Taro.showToast({ title: String(e), icon: 'none', duration: 2000 }));
    }

    render() {
        return (
            <CustomNavigation />
        )
    }
}

