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
        navigationBarTitleText: '项目圈',
        "enablePullDownRefresh": true,
    }

    state = {
        show_board_select_type: '0', //出现项目选择
        search_mask_show: '0', // 0默认 1 淡入 2淡出
        chatBoardList: [], //显示在列表中的项目圈列表
        isProhibitRepeatClick: true, //禁止重复点击进入圈子
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

        // 需要请求历史数据的项目列表
        let promiseList = new Array()

        //获取每个有效项目圈的历史记录
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
                                // 检查是否有艾特我的聊天记录并且是未读的消息
                                if (recor.apns && recor.isRead === 'false') {
                                    let apns = typeof recor.apns === 'string' ? JSON.parse(recor.apns) : recor.apns;
                                    let { accounts } = apns;
                                    if (accounts.indexOf(userUID) != -1) {
                                        chat.apns = apns;
                                        break;
                                    }
                                }
                            }
                            // 未读数
                            chat.unread = unread;
                            // 最后一条消息
                            chat.lastMsg = arr && arr[0];
                            // 根据最后一条消息更新最后的时间,排序
                            chat.updateTime = chat.lastMsg && chat.lastMsg.time
                            chat.scene = 'team'
                        }
                        return chat;
                    })
                } else {

                }
            })
            dispatch({
                type: "im/updateStateFieldByCover",
                payload: {
                    allBoardList: chatList
                }
            })
        })
        // 过滤掉只有一个人的群组 和  im_id为空的群组
        // const boardChatList = allBoardList.filter((item, index) => {
        //     if ((item.users && item.users.length != 1) && (item.im_id && !(item.im_id.match(/^[ ]*$/)))) {
        //         return item
        //     }
        // })

        // this.setState({
        //     chatBoardList: boardChatList
        // })
    }

    componentDidMount() {
        this.getChatBoardList();
    }

    componentWillMount() { }

    componentWillUnmount() { }

    componentDidShow() {
        //解决, 当在chat页面的时候, 来了新未读消息TabBarBadge不能及时更新, 从chat页面pop回来强制刷新数据
        const isRefreshNews = Taro.getStorageSync('isRefreshFetchAllIMTeamList')
        if (isRefreshNews === 'true') {
            this.getChatBoardList()
            Taro.removeStorageSync('isRefreshFetchAllIMTeamList')
        }
    }

    componentDidHide() { }

    // 获取组织列表
    getOrgList = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'my/getOrgList',
            payload: {}
        })
    }
    // 更新列表的未读数
    setBoardUnread = (im_id, board_id) => {
        let { allBoardList } = this.props;
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
                    unread: 0
                }
            })
            let boardList = [...allBoardList];
            // 去除艾特我的数据
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
        //禁止快速重复点击
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
        // 更新聊天列表的未读消息
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
                title: '当前群未注册',
                icon: 'none'
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
                .catch(e => Taro.showToast({ title: String(e), icon: 'none' }));
        });
    }

    onSelectType = ({ show_type }) => {
        this.setState({
            show_card_type_select: show_type,
            search_mask_show: show_type
        })
    }

    genAvatarList = (users = []) => {
        //如果没有头像就获取name的第一个字符生成头像
        const userToAvatar = i => (i && i.avatar ? i.avatar : ((i.name).substr(0, 1)));
        if (users.length <= 4) {
            return users.map(userToAvatar);
        }
        //获取最多4个头像
        return users.slice(0, 4).map(userToAvatar);
    };

    genLastMsg = (lastMsg = {}) => {
        if (JSON.stringify(lastMsg) != "{}" && lastMsg.status === "success") {  //lastMsg不为空并且成功才执行
            const { fromNick, type, text, file, custom, } = lastMsg;
            const typeCond = {
                text,
                audio: '[语音]',
                image: '[图片]',
                video: '[视频]',
                notification: '[系统通知]',
                file: '[文件]',
                custom,
            };
            if (type === 'text') {
                return `${fromNick}: ${text}`;
            }
            // if (type === 'file') {
            //     return `${'[文件]'} ${file.name}`;
            // }
            if (type === 'custom') {
                const contentJSON = JSON.parse(lastMsg.content)
                return contentJSON.type === 3 ? '[动态贴图]' : '[动态消息]'
            }
            return typeCond[type] ? typeCond[type] : '[未知类型消息]';
        } else {
            return '';
        }
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

    countSumUnRead = (list) => {

        // 过滤 scene === "team"
        const filter_list = list.filter((item, index) => {
            if (item.scene && item.scene === "team") {
                return item
            }
        })

        return new Promise((resolve) => {
            //1.1将没像个项目圈的unRead全部添加到一个数组
            //1.2把数组里面元素(unRead)全部相加等于总未读数
            var sumUnRead = filter_list.reduce(function (a, b) {
                return a + parseInt(b.unread);
            }, 0)
            //消息未读数
            if (sumUnRead) {
                /**
                 * 这里只能用wx.setTabBarBadge, 使用Taro.setTabBarBadge会报错
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
        // 列表去重
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

    render() {
        const { search_mask_show, chatBoardList } = this.state
        let { userUID } = this.props;
        // 对消息进行排序, 根据lastMsg里面的time最新的排在最上面
        let listArray = chatBoardList.filter(item => { return item.scene == 'team' }).sort((a, b) => ((b.updateTime)) - ((a.updateTime)))  //(b-a)时间正序
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
                        apns
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
                            name={board_name}
                            avatarList={this.genAvatarList(users)}
                            lastMsg={this.genLastMsg(lastMsg)}
                            newsNum={unread}
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

