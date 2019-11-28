import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import GroupItem from './components/GroupItem';
import { connect } from '@tarojs/redux'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import SearchAndMenu from '../board/components/SearchAndMenu'

@connect(({
    im: {
        allBoardList,

        sessionlist,
        currentBoardId,
        currentBoard,
        currentBoardImValid,
        rawMessageList
    }
}) => {
    return {
        allBoardList,

        sessionlist,
        currentBoardId,
        currentBoard,
        rawMessageList,
        currentBoardImValid,
    };
},
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
        };
    }
)
export default class BoardChat extends Component {
    config = {
        navigationBarTitleText: '项目圈'
    }

    state = {
        show_board_select_type: '0', //出现项目选择
        search_mask_show: '0', /// 0默认 1 淡入 2淡出
    }

    componentDidMount() {
        this.getOrgList()
        this.fetchAllIMTeamList()
    }

    componentWillMount() { }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    //获取全部组织和全部项目
    fetchAllIMTeamList = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'im/fetchAllIMTeamList',
            payload: {}
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

    hanldClickedGroupItem = ({ board_id, im_id }) => {
        const {
            allBoardList,
            setCurrentBoardId,
            setCurrentBoard,
            checkTeamStatus,
        } = this.props;

        const getCurrentBoard = (arr, id) => {
            const ret = arr.find(i => i.board_id === id);
            return ret ? ret : {};
        };

        Promise.resolve(setCurrentBoardId(board_id))
            .then(() => {
                setCurrentBoard(getCurrentBoard(allBoardList, board_id));
            })
            .then(() => {
                checkTeamStatus(board_id)
            }).then(() => {
                this.validGroupChat({ im_id })
            })
            .catch(e => console.log('error in boardDetail: ' + e));
    };

    registerIm = () => {
        // console.log('群聊异常执行重新注入Im');
        const initImData = async () => {
            const { dispatch } = this.props;
            const { account, token } = await dispatch({
                type: 'im/fetchIMAccount'
            });
            await dispatch({
                type: 'im/initNimSDK',
                payload: {
                    account,
                    token
                }
            });
            return await dispatch({
                type: 'im/fetchAllIMTeamList'
            });
        };
        initImData().catch(e => Taro.showToast({ title: String(e), icon: 'none' }));
    }

    validGroupChat = ({ im_id }) => {
        const {
            setCurrentChatTo,
            setCurrentGroup,
            updateCurrentChatUnreadNewsState,
            currentBoard,
            currentBoardImValid
        } = this.props

        if (!im_id) {
            Taro.showToast({
                title: '当前群未注册',
                icon: 'none'
            });
            return;
        }

        const isValid =
            currentBoardImValid[im_id] && currentBoardImValid[im_id]['isValid'];

        if (!isValid) {
            // Taro.showToast({
            //   title: '当前群数据异常',
            //   icon: 'none'
            // });
            // return;

            // console.log('当前群数据异常...')
            /**
             * 遇到群聊数据异常的情况, 重新注入registerIm连接
             */
            this.registerIm()

            const { globalData: { store: { getState } } } = Taro.getApp()
            const { im: { nim } } = getState()
            if (nim) {
                nim.disconnect({
                    done: () => {
                        console.log('断开连接成功');
                        setTimeout(() => {
                            nim.connect({})
                        }, 50)
                    }
                })
            }
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
                Taro.navigateTo({
                    url: `/pages/chat/index`
                });
            })
            .catch(e => Taro.showToast({ title: String(e), icon: 'none' }));
    }

    onSelectType = ({ show_type }) => {
        this.setState({
            show_card_type_select: show_type,
            search_mask_show: show_type
        })
    }

    render() {
        const { search_mask_show } = this.state
        const { allBoardList } = this.props
        return (
            <View className={indexStyles.index}>

                <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={search_mask_show} />

                {allBoardList.map((value, key) => {
                    const {
                        board_id,
                        board_name,
                        im_id,
                        name,
                        org_id,
                        org_name,
                        type,
                        type_name,
                        users,
                    } = value;
                    return (
                        <GroupItem
                            key={board_id}
                            board_id={board_id}
                            org_name={org_name}
                            im_id={im_id}
                            // lastMsg={lastMsg}
                            label={type_name}
                            name={board_name}
                            // newsNum={newsNum}
                            // showNewsDot={showNewsDot}
                            avatarList={users}
                            // isExpand={isShouldExpandSubGroup}
                            // onExpandChange={this.handleExpandSubGroupChange}
                            onClickedGroupItem={this.hanldClickedGroupItem}
                        // isSubGroup={false}
                        // isShouldShowExpandOpertor={childs.length}
                        />
                    );
                })}
            </View>
        )
    }
}

