import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import GroupItem from './components/GroupItem';
import { connect } from '@tarojs/redux'
import indexStyles from './index.scss'
import SearchAndMenu from '../board/components/SearchAndMenu'
import { isPlainObject, filterListAuth } from './../../utils/util';
import { isApiResponseOk } from '../../utils/request';
import { getImHistory, getAllIMTeamList } from '../../services/im'

@connect(({
    im: {
        allBoardList,
        sessionlist,
        currentBoardId,
        currentBoard,
        currentBoardImValid,
        rawMessageList,
        userUID
    }
}) => {
    return {
        allBoardList,
        sessionlist,
        currentBoardId,
        currentBoard,
        rawMessageList,
        currentBoardImValid,
        userUID
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
        navigationBarTitleText: '?????????',
        "enablePullDownRefresh": true,
    }

    state = {
        show_board_select_type: '0', //??????????????????
        search_mask_show: '0', // 0?????? 1 ?????? 2??????
        chatBoardList: [], //????????????????????????????????????
        isProhibitRepeatClick: true, //??????????????????????????????
    }

    onShareAppMessage() {
        return {
            title: '?????????',
            path: `/pages/boardChat/index`,
        }
    }

    onPullDownRefresh(res) {

        this.getChatBoardList();

        Taro.showNavigationBarLoading()
        setTimeout(function () {
            Taro.stopPullDownRefresh()
            Taro.hideNavigationBarLoading()
        }, 300)
    }

    getAllTeam = () => {
        return new Promise((resolve, reject) => {
            getAllIMTeamList().then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err);
            })
        })
    }
    getChatBoardList = async () => {
        let { userUID } = this.props;
        this.getOrgList();
        let list = await this.getAllTeam();
        // let list = await this.getAllTeam();
        const { dispatch } = this.props;

        // ???????????????????????????????????????
        let promiseList = new Array()

        //??????????????????????????????????????????
        list.forEach((value, key) => {
            const { im_id } = value;
            const param = {
                id: im_id,
                page_size: '10',
                page_number: '1',
            }
            promiseList.push(getImHistory(param));
        })
        let resList = [];
        Promise.all(promiseList).then(response => {
            let chatList = [...list];
            response.forEach(item => {
                let msg = item.data;
                let { tid, unread, records } = msg || {};
                let arr = filterListAuth(records, userUID);
                if (isApiResponseOk(item)) {
                    resList.push(item.data)
                    chatList.map(chat => {
                        if (tid == chat.im_id) {
                            for (let i = 0; i < arr.length; i++) {
                                let recor = arr[i];
                                // ???????????????????????????????????????????????????????????????
                                if (recor.apns && recor.isRead === 'false') {
                                    let apns = typeof recor.apns === 'string' ? JSON.parse(recor.apns) : recor.apns;
                                    let { accounts } = apns;
                                    if (accounts.indexOf(userUID) != -1) {
                                        chat.apns = apns;
                                        break;
                                    }
                                }
                            }
                            // ?????????
                            chat.unread = unread;
                            // ??????????????????
                            chat.lastMsg = arr && arr[0];
                            // ?????????????????????????????????????????????,??????
                            chat.updateTime = chat.lastMsg && chat.lastMsg.time
                            chat.scene = 'team'
                        }
                        return chat;
                    })
                } else {

                }
            })

            // ????????????????????????
            // ?????????
            let subList = chatList.filter(item => item.type == 3);
            chatList.map(item => {
                // ???????????????????????????
                if (item.type == 2) {
                    let subs = subList.filter(sub => sub.board_id == item.board_id);
                    item.children = subs;
                    let number = subs.reduce((total, sub) => {
                        return total += +(sub.unread || 0)
                    }, 0)
                    item.subUnread = number;
                }
                return item;
            })

            dispatch({
                type: "im/updateStateFieldByCover",
                payload: {
                    allBoardList: chatList
                }
            })
        })
    }

    componentDidMount() {
        this.getChatBoardList();
    }

    componentDidShow() {
        //??????, ??????chat???????????????, ?????????????????????TabBarBadge??????????????????, ???chat??????pop????????????????????????
        const isRefreshNews = Taro.getStorageSync('isRefreshFetchAllIMTeamList')
        if (isRefreshNews === 'true') {
            this.getChatBoardList()
            Taro.removeStorageSync('isRefreshFetchAllIMTeamList')
        }
    }

    // ??????????????????
    getOrgList = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'my/getOrgList',
            payload: {}
        })
    }
    // ????????????????????????
    setBoardUnread = (im_id, board_id) => {
        return new Promise(async (resolve) => {
            let { dispatch, allBoardList } = this.props;
            await dispatch({
                type: "im/updateBoardUnread",
                payload: {
                    param: {
                        im_id,
                        msgids: []
                    },
                    im_id,
                    board_id,
                    unread: 0
                }
            })
            let boardList = [...allBoardList];
            // ????????????????????????
            boardList.map(item => {
                if (item.im_id === im_id) {
                    item.apns = undefined;
                }
                return item;
            })
            await dispatch({
                type: "im/updateStateFieldByCover",
                payload: {
                    allBoardList: boardList
                }
            })

            resolve();
        })
    }

    hanldClickedGroupItem = ({ board_id, im_id }) => {
        //????????????????????????
        const { isProhibitRepeatClick } = this.state
        if (isProhibitRepeatClick) {
            this.setState({ isProhibitRepeatClick: false })
            this.isClickedGroupItem({ board_id, im_id })
            const that = this
            setTimeout(function () {
                that.setState({ isProhibitRepeatClick: true })
            }, 2000);
        }
    };

    isClickedGroupItem = ({ board_id, im_id }) => {
        const {
            allBoardList,
            setCurrentBoardId,
            setCurrentBoard,
            checkTeamStatus,
        } = this.props;
        // ?????????????????????????????????
        this.setBoardUnread(im_id, board_id).then(_ => {
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
        });
    }

    validGroupChat = ({ im_id }) => {
        const {
            setCurrentChatTo,
            setCurrentGroup,
            updateCurrentChatUnreadNewsState,
            currentBoard,
            allBoardList
        } = this.props

        if (!im_id) {
            Taro.showToast({
                title: '??????????????????',
                icon: 'none'
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

        this.countSumUnRead(allBoardList).then(_ => {
            Promise.resolve(setCurrentChatTo(id))
                .then(() => setCurrentGroup(getCurrentGroup(currentBoard, im_id)))
                .then(() => updateCurrentChatUnreadNewsState(id))
                .then(() => {
                    Taro.setStorageSync('isRefreshFetchAllIMTeamList', 'true')
                    const { board_id } = currentBoard
                    Taro.navigateTo({
                        url: `../../pages/chat/index?boardId=${board_id}&pageSource=boardChat`
                    });
                })
                .catch(e => Taro.showToast({ title: String(e), icon: 'none', duration: 2000 }));
        });
    }

    onSelectType = ({ show_type }) => {
        this.setState({
            show_card_type_select: show_type,
            search_mask_show: show_type
        })
    }

    genAvatarList = (users = []) => {
        //???????????????????????????name??????????????????????????????
        const userToAvatar = i => (i && i.avatar ? i.avatar : ((i.name).substr(0, 1)));
        if (users.length <= 4) {
            return users.map(userToAvatar);
        }
        //????????????4?????????
        return users.slice(0, 4).map(userToAvatar);
    };

    genLastMsg = (lastMsg = {}) => {
        if (JSON.stringify(lastMsg) != "{}" && lastMsg.status === "success") {  //lastMsg??????????????????????????????
            const { fromNick, type, text, file, custom, tip, } = lastMsg;
            const typeCond = {
                text,
                audio: '[??????]',
                image: '[??????]',
                video: '[??????]',
                notification: '[????????????]',
                file: '[??????]',
                custom,
                tip,
            };
            if (type === 'text') {
                return `${fromNick}: ${text}`;
            }
            // if (type === 'file') {
            //     return `${'[??????]'} ${file.name}`;
            // }
            if (type === 'custom') {
                const contentJSON = JSON.parse(lastMsg.content)
                return contentJSON.type === 3 ? '[????????????]' : '[????????????]'
            }
            if (type === 'tip') {
                return `${text}`
            }
            return typeCond[type] ? typeCond[type] : '[??????????????????]';
        } else {
            return '';
        }
    };

    isShouldShowNewDot = (unRead = 0, childsUnReadArr) => {
        //?????????????????????????????????0??? ????????????????????????????????????
        if (unRead) return false;
        //???????????????????????????????????????????????????????????????
        if (childsUnReadArr.some(Boolean)) {
            return true;
        }
        return false;
    };

    getGroupLastMsgFromRawMessageList = (im_id, rawMessageList) => {
        const currentImGroup = rawMessageList[im_id];
        const filterMsgType = i => i.scene && i.scene === 'team';
        if (isPlainObject(currentImGroup)) {
            //????????????????????????????????????
            //?????????????????????bug, ?????????currentImGroup???????????????????????????????????????
            //Object.entries, for...in, ?????????????????????
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

        //???????????????????????????????????????????????????
        const allGroupIMId = [currentBoardInfo.im_id].concat(
            currentBoardInfo.childs && currentBoardInfo.childs.length
                ? currentBoardInfo.childs.map(i => i.im_id)
                : []
        );
        const { im_id } = currentBoardInfo;

        //??? currentBoardInfo ????????????????????? ?????? unRead(?????????????????????)
        //??? lastMsg(????????????????????? ????????????)
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
                //?????????????????????????????????
                if (curr.to === acc.im_id) {
                    //??????????????????, ??????????????????
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

    countSumUnRead = (list) => {

        // ?????? scene === "team"
        const filter_list = list.filter((item, index) => {
            if (item.scene && item.scene === "team") {
                return item
            }
        })

        return new Promise((resolve) => {
            //1.1????????????????????????unRead???????????????????????????
            //1.2?????????????????????(unRead)??????????????????????????????
            var sumUnRead = filter_list.reduce(function (a, b) {
                return a + parseInt(b.unread);
            }, 0)
            //???????????????
            if (sumUnRead) {
                /**
                 * ???????????????wx.setTabBarBadge, ??????Taro.setTabBarBadge?????????
                 */
                wx.setTabBarBadge({
                    index: 1,
                    text: sumUnRead > 99 ? '99+' : sumUnRead ? sumUnRead + "" : "0",
                })
                resolve()
            } else if (!sumUnRead) {
                wx.removeTabBarBadge({
                    index: 1,
                    success: (e) => {
                        resolve(e)
                    },
                    complete: (e) => {
                    }
                })
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        // ????????????
        let list = [...nextProps.allBoardList];
        let obj = {};
        let arr = [];
        list.forEach(item => {
            let key = item.im_id
            if (!obj[key]) {
                arr.push(item);
                obj[key] = true;
            }
        })
        this.setState({
            chatBoardList: arr
        })
        this.countSumUnRead(arr)
    }
    getSubUnread = (val) => {
        let { chatBoardList } = this.state;
        let sub = chatBoardList.filter(item => item.type == 3 && item.board_id == val.board_id);

        let number = sub.reduce((total, item) => {
            return total += Number(item.unread);
        }, 0)
        return number;
    }

    boardListForView = () => {
        let { chatBoardList } = this.state;
        let listArray = chatBoardList.filter(item => item.scene == 'team' && item.type == 2).sort((a, b) => (+(b.updateTime || 0)) - (+(a.updateTime || 0)))  //(b-a)????????????
        return listArray;
    }

    render() {
        const { search_mask_show } = this.state
        let { userUID } = this.props;
        // ?????????????????????, ??????lastMsg?????????time????????????????????????
        let listArray = this.boardListForView();
        return (
            <View className={indexStyles.index}>

                <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={search_mask_show} />

                {listArray.map((value, key) => {
                    const {
                        board_id,
                        board_name,
                        im_id,
                        org_name,
                        users,
                        lastMsg,
                        unread,
                        childs = [],
                        apns,
                        name,
                        subUnread
                    } = value;
                    let _math = Math.random() * 100000 + 1;
                    return (
                        <GroupItem
                            key={_math}
                            taroKey={_math}
                            data={value}
                            board_id={board_id}
                            org_name={org_name}
                            im_id={im_id}
                            name={board_name || name}
                            avatarList={this.genAvatarList(users)}
                            lastMsg={this.genLastMsg(lastMsg)}
                            newsNum={(+unread + this.getSubUnread(value))}
                            apns={apns}
                            userid={userUID}
                            showNewsDot={this.isShouldShowNewDot(unread, childs.map(i => i.unread))}
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

