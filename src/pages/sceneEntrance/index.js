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
        params_options: {}, //????????????????????????
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
         * redirectType ???????????? ????????????=0 ??????=1 ??????=2 ??????=3 ??????=4 ??????=5 ????????????=6
         * contentId ??????id
         * boardId ??????id
         * currentDate ???????????????????????????
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
                    Taro.switchTab({ url: `../../pages/calendar/index` })
                }
            })
        } else {
            if (redirectType === '0') {  //????????????
                Taro.setStorageSync('sceneEntrance_Goto_Other', 'errorPage')
                pageObject = 'errorPage'
            } else if (redirectType === '1' || redirectType === '7') {  //1 ????????????  7 ?????????????????????(????????????/??????????????????)
                // @???????????? ??? pages/sceneEntrance/index?redirectType=7&boardId=1111111
                // ?????????????????? ??? pages/sceneEntrance/index?redirectType=7&boardId=
                // ????????????????????? ??? boardId ????????????
                if (boardId.match(/^[ ]*$/)) {
                    Taro.switchTab({ url: `../../pages/boardChat/index` })
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

            } else if (redirectType === '2' || redirectType === '8') {  //2 ???????????? 8 ????????????
                pageObject = 'taksDetails'
            } else if (redirectType === '3') { //??????

            } else if (redirectType === '4') { //??????
                pageObject = 'templateDetails'
            } else if (redirectType === '5') {  //????????????
                Promise.resolve(
                    //??????wx.switchTab????????????
                    Taro.setStorageSync('switchTabFileInfo', {
                        contentId: contentId,
                        boardId: boardId,
                        push: 'officialAccount',
                    })
                ).then(() => {
                    Taro.switchTab({ url: `../../pages/file/index` })
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
                title: '??????????????????',
                icon: 'none',
                duration: 2000
            });
            return;
        }

        //????????? ??????????????????????????????????????? id
        const id = `team-${im_id}`;
        //??????currentChatTo??????????????????????????????????????????????????????????????????
        //?????????????????????????????????????????????????????????????????????????????????????????????
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

