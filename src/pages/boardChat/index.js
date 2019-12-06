import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import GroupItem from './components/GroupItem';
import { connect } from '@tarojs/redux'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import SearchAndMenu from '../board/components/SearchAndMenu'
import { isPlainObject } from './../../utils/util';

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
        search_mask_show: '0', // 0默认 1 淡入 2淡出
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
                const { board_id } = currentBoard
                Taro.navigateTo({
                    url: `../../pages/chat/index?boardId=${board_id}&pageSource=boardChat`
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

    genAvatarList = (users = []) => {
        const userToAvatar = i => (i && i.avatar ? i.avatar : 'unknown');
        if (users.length <= 5) {
            return users.map(userToAvatar);
        }
        //获取最多5个头像
        return users.slice(0, 5).map(userToAvatar);
    };

    genLastMsg = (lastMsg = {}) => {
        const { fromNick, type, text } = lastMsg;
        if (!fromNick) return '';
        const typeCond = {
            text,
            audio: '[语音]',
            image: '[图片]',
            video: '[视频]',
            custom: '[动态消息]',
            notification: '[系统通知]',
        };
        if (type === 'text') {
            return `${fromNick}: ${text}`;
        }
        return typeCond[type] ? typeCond[type] : '[未知类型消息]';
    };

    isShouldShowNewDot = (unRead = 0, childsUnReadArr) => {
        //如果主群的未读数量不是0， 那么就不会显示消息点提醒
        if (unRead) return false;
        //如果子群中有任意的消息，那么就展开子群列表
        if (childsUnReadArr.some(Boolean)) {
            return true;
        }
        return false;
    };

    getGroupLastMsgFromRawMessageList = (im_id, rawMessageList) => {
        const currentImGroup = rawMessageList[im_id];
        const filterMsgType = i => i.scene && i.scene === 'team';
        if (isPlainObject(currentImGroup)) {
            //过滤出属于群聊的用户消息
            //这里会出现一个bug, 会丢掉currentImGroup对象的最后一个属性？？？？
            //Object.entries, for...in, 都会丢失。。。
            return Object.values(currentImGroup)
                .filter(filterMsgType)
                .sort((a, b) => a.time - b.time)
                .slice(-1)[0];
        }
        return {};
    };

    integrateCurrentBoardWithSessions = (
        currentBoardInfo,
        sessionlist = [],
        rawMessageList = {}
    ) => {

        //这里需要整合每个群组的未读消息数量
        const allGroupIMId = [currentBoardInfo.im_id].concat(
            currentBoardInfo.childs && currentBoardInfo.childs.length
                ? currentBoardInfo.childs.map(i => i.im_id)
                : []
        );
        const { im_id } = currentBoardInfo;

        //为 currentBoardInfo 及它下面的子群 添加 unRead(未阅读消息数量)
        //和 lastMsg(最后一条消息， 用于展示)
        const currentBoardIdWithDefaultUnReadAndLastMsg = Object.assign(
            {},
            currentBoardInfo,
            {
                unRead: 0,
                lastMsg: this.getGroupLastMsgFromRawMessageList(
                    `team-${im_id}`,
                    rawMessageList
                )
            }
        );
        currentBoardIdWithDefaultUnReadAndLastMsg.childs =
            currentBoardIdWithDefaultUnReadAndLastMsg.childs &&
                currentBoardIdWithDefaultUnReadAndLastMsg.childs.length
                ? currentBoardIdWithDefaultUnReadAndLastMsg.childs.map(i => {
                    return {
                        ...i,
                        unRead: 0,
                        lastMsg: this.getGroupLastMsgFromRawMessageList(
                            `team-${i.im_id}`,
                            rawMessageList
                        )
                    };
                })
                : [];

        const currentBoardSessionList = i =>
            i && i.scene && i.scene === 'team' && allGroupIMId.find(e => e === i.to);
        const sortByTime = (a, b) => a.lastMsg.time - b.lastMsg.time;

        return sessionlist
            .filter(currentBoardSessionList)
            .sort(sortByTime)
            .reduce((acc, curr) => {
                //统计每个群组的未读数。

                if (curr.to === acc.im_id) {
                    //这里不是累加, 而是直接替换
                    acc.unRead = curr.unread;
                    return acc;
                }
                let findedIndex = acc.childs.findIndex(i => i.im_id === curr.to);
                const notFound = index => index === -1;
                if (notFound(findedIndex)) {
                    return acc;
                }
                acc.childs[findedIndex].unRead = curr.unread;
                return acc;
            }, currentBoardIdWithDefaultUnReadAndLastMsg);
    };

    countSumUnRead = (sumArray, unRead) => {
        //1.1将没像个项目圈的unRead全部添加到一个数组
        sumArray.push(unRead)
        //1.2把数组里面元素(unRead)全部相加等于总未读数
        var sumUnRead = sumArray.reduce(function (a, b) {
            return a + parseInt(b);
        }, 0);

        //消息未读数
        if (sumUnRead != 0) {
            /**
             * 这里只能用wx.setTabBarBadge, 使用Taro.setTabBarBadge会报错
             */
            wx.setTabBarBadge({
                index: 1,
                text: JSON.stringify(sumUnRead),
            })
        }
    }

    render() {
        const { search_mask_show } = this.state
        const { allBoardList, sessionlist, rawMessageList } = this.props

        // 过滤掉只有一个人的群组
        const chatBoardList = allBoardList.filter((item, index) => {
            if (item.users && item.users.length != 1) {
                return item
            }
        })

        const sumArray = new Array(0)

        return (
            <View className={indexStyles.index}>

                <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={search_mask_show} prohibitStyle='prohibitStyle' />

                {chatBoardList.map((value, key) => {
                    const {
                        board_id,
                        board_name,
                        im_id,
                        org_name,
                        users,

                        lastMsg,
                        unRead,
                        childs = [],
                    } = this.integrateCurrentBoardWithSessions(  //把 Value 和 sessionlist, rawMessageList 一起传出去整合成一条消息
                        value,
                        sessionlist,
                        rawMessageList
                    );
                    this.countSumUnRead(sumArray, unRead)

                    return (
                        <GroupItem
                            key={board_id}
                            board_id={board_id}
                            org_name={org_name}
                            im_id={im_id}
                            name={board_name}
                            avatarList={this.genAvatarList(users)}
                            lastMsg={this.genLastMsg(lastMsg)}
                            newsNum={unRead}
                            showNewsDot={this.isShouldShowNewDot(unRead, childs.map(i => i.unRead))}
                            onClickedGroupItem={this.hanldClickedGroupItem}

                        // isExpand={isShouldExpandSubGroup}
                        // onExpandChange={this.handleExpandSubGroupChange}
                        // isSubGroup={false}
                        // isShouldShowExpandOpertor={childs.length}
                        />
                    );
                })}
            </View>
        )
    }
}

