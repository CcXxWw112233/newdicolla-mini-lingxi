import { connect } from '@tarojs/redux'
import Taro, { Component, hideToast, pageScrollTo, getExtConfig } from '@tarojs/taro'
import { View, Text, Image, RichText } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import SearchAndMenu from '../board/components/SearchAndMenu'
import { filterFileFormatType } from './../../utils/util';
import file_list_empty from '../../asset/file/file_list_empty.png'
import BoardFile from './components/boardFile/index.js'
import ChoiceFolder from './components/boardFile/ChoiceFolder.js'
import { getOrgIdByBoardId, setBoardIdStorage, setRequestHeaderBaseInfo } from '../../utils/basicFunction'
import { BASE_URL, API_BOARD } from "../../gloalSet/js/constant";

@connect(({
    file: {
        file_list = [],
        isShowBoardList,
        header_folder_name,
        isShowChoiceFolder,
        selected_board_folder_info,
        unread_file_list = [],
        unvisited_file_list_count,
        verify_authority_list
    },
    im: {
        allBoardList,
        currentBoard,
    } }) => ({
        file_list,
        isShowBoardList,
        header_folder_name,
        isShowChoiceFolder,
        allBoardList,
        selected_board_folder_info,
        currentBoard,
        unread_file_list,
        unvisited_file_list_count,
        verify_authority_list
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
export default class File extends Component {
    config = {
        navigationBarTitleText: '文件',
        "enablePullDownRefresh": true,
    }
    state = {
        is_tips_longpress_file: false,  //是否显示长按文件前往圈子的提示
        choice_image_temp_file_paths: [],  //从相册选中的图片api返回来的路径
        makePho: "", //是上传文件还是拍照
        officialAccountFileInfo: {}, //获取从公众号进入小程序预览文件
        file_list_state: [], //最终文件列表
        un_read_file_array: [], //文件未读数组
        uplaodAuto: false,
        upload_sheet_list: [{ icon: '&#xe846;', value: '从微信导入文件' }, { icon: '&#xe664;', value: '从相册导入文件' }, { icon: '&#xe86f;', value: '从相机导入文件' }],
        isFirstLoadData: true,
        isPullDown: false,
        routeIsRead: false
    }

    onShareAppMessage() {
        return {
            title: '文件',
            path: `/pages/file/index`,
        }
    }

    onPullDownRefresh(res) {
        const refreshStr = Taro.getStorageSync('file_pull_down_refresh')
        const refreshData = JSON.parse(refreshStr)
        const { org_id, board_id, folder_id } = refreshData
        const params = {
            org_id: org_id,
            board_id: board_id,
            folder_id: folder_id,
        }
        this.loadData(params)
        Taro.showNavigationBarLoading()
        setTimeout(function () {
            Taro.stopPullDownRefresh()
            Taro.hideNavigationBarLoading()
        }, 300)

        this.setState({
            isPullDown: true
        })
    }

    componentDidHide() {
        const { dispatch } = this.props
        const { un_read_file_array } = this.state

        ///清除全部未读
        this.readFile(dispatch, un_read_file_array);
    }

    componentDidShow() {
        const refreshStr = Taro.getStorageSync('file_pull_down_refresh')
        const refreshData = refreshStr ? JSON.parse(refreshStr) : {}
        const { org_id, board_id, folder_id } = refreshData
        const params = {
            org_id: org_id,
            board_id: board_id,
            folder_id: folder_id,
        }
        if (this.state.routeIsRead) {
            this.setState({
                routeIsRead: false
            })
        } else {
            this.loadData(params);
        }
        Taro.removeTabBarBadge({
            index: 2
        })
    }

    componentDidMount() {
        const params = {
            org_id: '0',
            board_id: '',
            folder_id: ''
        }
        //保存数据, 用作下拉刷新参数
        Taro.setStorageSync('file_pull_down_refresh', JSON.stringify(params))
        this.loadData(params, "true")

        const { dispatch } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                header_folder_name: '全部文件',
            },
        })

        /// 获取从公众号进入小程序预览文件
        this.setState({
            officialAccountFileInfo: Taro.getStorageSync('switchTabFileInfo'),
        })
        // 获取项目权限数据
        dispatch({
            type: 'file/verifyAuthority',
            payload: {
            },
        })
    }

    //加载数据
    loadData = (params, isAllRead) => {
        const { org_id, board_id, folder_id } = params
        this.getFilePage(org_id, board_id, folder_id, isAllRead)
    }

    // 获取文件列表
    getFilePage = (org_id, board_id, folder_id, isAllRead) => {

        //保存数据, 用作下拉刷新参数
        const params = {
            org_id: org_id,
            board_id: board_id,
            folder_id: folder_id == undefined ? '' : folder_id,
        }
        const { dispatch, header_folder_name } = this.props;
        var that = this;

        console.log("*****************" + header_folder_name)

        Taro.setStorageSync('file_pull_down_refresh', JSON.stringify(params))
        Promise.resolve(
            dispatch({
                type: 'file/getFilePage',
                payload: {
                    _organization_id: org_id == undefined ? '' : org_id,
                    board_id: board_id == undefined ? '' : board_id,
                    folder_id: folder_id == undefined ? '' : folder_id,
                    page_number: '',
                    page_size: '',
                },
            })
        ).then(() => {
            this.setState({
                uplaodAuto: false
            })


            // this.verifyAuthority(board_id)
            if (this.state.isFirstLoadData) {
                this.setState({
                    isFirstLoadData: false
                })
            } else if (this.state.isPullDown) {
                this.setState({
                    isPullDown: false,
                    isFirstLoadData: true
                })
            } else {
                dispatch({
                    type: 'file/filevisited',
                    payload: {
                    },
                })
            }


            ///从公众号消息推送过来查看文件详情
            const { officialAccountFileInfo = {} } = this.state
            if (officialAccountFileInfo && officialAccountFileInfo.push == 'officialAccount') {
                const { file_list = [] } = this.props

                //根据公众号消息的文件id在文件列表中查找出文件item
                var previewFileInfo = file_list.find(item => item.id == officialAccountFileInfo.contentId);
                const { file_name } = previewFileInfo

                console.log(previewFileInfo)
                ///进行预览
                that.goFileDetails(previewFileInfo, file_name);
                //同时清除缓存
                try {
                    Taro.removeStorageSync('switchTabFileInfo');
                    this.setState({
                        officialAccountFileInfo: null,
                    })
                } catch (e) {
                    // Do something when c      atch error
                    console.log(e);
                }
            }
            //获取未读文件list
            this.getUnreadFileList(dispatch);
        })
    }
    // 判断是否有上传权限
    verifyAuthority = (board_id) => {
        const { dispatch, header_folder_name, verify_authority_list } = this.props;
        var that = this;
        if (header_folder_name == '全部文件') {
            return false;
        } else {
            console.log(header_folder_name);
            console.log(board_id)
            for (var key in verify_authority_list) {//遍历json对象的每个key/value对,p为key
                if (board_id == key) {
                    verify_authority_list[key].map(item => {
                        if (item == 'project:files:file:upload') {
                            that.setState({
                                uplaodAuto: true
                            })
                        }
                    })
                }
            }
            console.log(this.state.uplaodAuto)

        }
    }
    //获取未读文件list
    getUnreadFileList = (dispatch) => {

        dispatch({
            type: 'file/getFileUnreadList',
            payload: {
                type: '3',  //文件
            },
        }).then(() => {
            //查找出未读的
            const { unread_file_list = [], file_list = [], un_read_file_array = [], } = this.props;

            //定义一个空的数组, 用来存储未读id, 后面一次性清除未读
            var cardNumArr = [];

            var arrayC = unread_file_list.map(item => {
                for (let _key in item) {
                    cardNumArr.push(_key);
                    return {
                        id: item[_key],
                        msg_ids: _key
                    }
                }
            })
            var d = file_list.map(item => {
                const _item = arrayC.find(el => el.id === item.id) || {};
                return {
                    ...item,
                    ..._item
                }
            })


            this.setState({
                // eslint-disable-next-line react/no-unused-state
                file_list_state: d,
                // eslint-disable-next-line react/no-unused-state
                un_read_file_array: cardNumArr,
            }, () => {
                // Taro.pageScrollTo({
                // scrollTop: 100000,
                // duration: 100,
                // })
            })
        })
    }

    updateHeaderFolderName = (current_folder_name) => {

        const { dispatch } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                header_folder_name: current_folder_name,
            },
        })
    }

    onSelectType = ({ show_type }) => {
        this.setState({
            show_card_type_select: show_type,
            search_mask_show: show_type
        })
    }

    //显示关闭项目列表
    choiceBoard = (e) => {

        const { dispatch } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                isShowBoardList: e,
            },
        })
    }

    //预览文件详情
    goFileDetails = (value, fileName) => {
        Taro.setStorageSync('isReloadFileList', 'is_reload_file_list')
        const { id, board_id, org_id } = value
        const { dispatch } = this.props
        setBoardIdStorage(board_id)
        const fileType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
        const parameter = {
            board_id,
            file_ids: id,
            _organization_id: getOrgIdByBoardId(board_id) ? getOrgIdByBoardId(board_id) : org_id,
        }

        // 清除缓存文件
        Taro.getSavedFileList({
            success(res) {
                if (res.fileList.length > 0) {
                    Taro.removeSavedFile({
                        filePath: res.fileList[0].filePath,
                        complete(res) {
                            //console.log('清除成功', res)
                        }
                    })
                }
            }
        })

        dispatch({
            type: 'file/getDownloadUrl',
            payload: {
                parameter,
                fileType: fileType,
            },
        })

        //是否显示长按文件前往圈子的提示
        const tips_longpress_file = Taro.getStorageSync('tips_longpress_file')
        if (!tips_longpress_file) {
            Taro.setStorageSync('tips_longpress_file', 'tips_longpress_file')
            this.setState({
                is_tips_longpress_file: true
            })
        }

        this.setState({
            routeIsRead: true
        })
        var arr = [];
        arr.push(value.msg_ids);
        //把文件改为已读
        this.readFile(dispatch, arr);
        // var { unvisited_file_list_count } = this.props;
        // if (unvisited_file_list_count > 0) {

        // unvisited_file_list_count = unvisited_file_list_count - 1;
        // if (unvisited_file_list_count == 0) {
        // Taro.removeTabBarBadge({
        // index: 2,
        // })
        // } else {
        // Taro.setTabBarBadge({
        // index: 2,
        // text: unvisited_file_list_count > 99
        // ? "99+"
        // : unvisited_file_list_count
        // ? unvisited_file_list_count + ""
        // : ""
        // });
        // dispatch({
        // type: 'file/updateDatas',
        // payload: {
        // unvisited_file_list_count: unvisited_file_list_count,
        // },
        // })
        // }
        // }
    }

    readFile = (dispatch, msg_ids) => {
        dispatch({
            type: 'im/setImHistoryRead',
            payload: {
                msgids: msg_ids,
            },
        })

        const refreshStr = Taro.getStorageSync('file_pull_down_refresh')
        const refreshData = JSON.parse(refreshStr)
        // const { org_id, board_id, folder_id } = refreshData
        // const params = {
        // org_id: org_id,
        // board_id: board_id,
        // folder_id: folder_id,
        // }

        // this.loadData(params);

        Taro.removeStorageSync('switchTabFileInfo');
        this.setState({
            officialAccountFileInfo: null,
        })
    }

    onSearch = (value, board_id, file_id) => {
        //去掉关键字字符串的首位空格
        const searchTerm = value.replace(/(^\s*)|(\s*$)/g, "");
        //判断搜索关键字是否为空或者空格
        // if (typeof searchTerm != "undefined" && searchTerm != null && searchTerm != "" && searchTerm.length > 0) {
        if (!searchTerm.match(/^[ ]*$/)) {
            const { dispatch } = this.props
            dispatch({
                type: 'global/globalQuery',
                payload: {
                    _organization_id: '0',
                    page_number: '1',
                    page_size: '5',
                    // query_conditions: queryConditions,
                    search_term: searchTerm, //关键字
                    search_type: '6',  //文件 type = 6
                },
            })

            dispatch({
                type: 'file/updateDatas',
                payload: {
                    header_folder_name: '全部文件',
                },
            })
        } else {
            this.getFilePage('0', '', '')
        }
    }

    //长按进入圈子
    longPress = (value) => {
        let { dispatch } = this.props;
        // Taro.setStorageSync('isRefreshFetchAllIMTeamList', 'true')
        // Taro.setStorageSync('isReloadFileList', 'is_reload_file_list')
        // console.log(value)

        let obj = {
            id: value.id,
            actionType: "file",
            board_id: value.board_id
        }

        dispatch({
            type: "file/updateDatas",
            payload: {
                current_custom_message: obj
            }
        })
        setTimeout(() => {
            Taro.navigateTo({
                url: "/pages/filesChat/index"
            })
        }, 50)

        // const { dispatch, setCurrentBoardId, setCurrentBoard, allBoardList, checkTeamStatus, } = this.props
        // const { board_id } = value
        // dispatch({
        //     type: 'file/updateDatas',
        //     payload: {
        //         isShowFileComment: true,
        //     },
        // })

        // const fileIsCurrentBoard = allBoardList.filter((item, index) => {
        //     if (item.board_id === board_id) {
        //         return item
        //     }
        // })

        // if (fileIsCurrentBoard.length === 0) return
        // const { im_id } = fileIsCurrentBoard && fileIsCurrentBoard[0]

        // const getCurrentBoard = (arr, id) => {
        //     const ret = arr.find(i => i.board_id === id);
        //     return ret ? ret : {};
        // };
        // Promise.resolve(setCurrentBoardId(board_id))
        //     .then(() => {
        //         setCurrentBoard(getCurrentBoard(allBoardList, board_id))
        //     }).then(() => {
        //         checkTeamStatus(board_id)
        //     }).then(() => {
        //         this.validGroupChat({ im_id }, { value })
        //     })
        //     .catch(e => console.log('error in boardDetail: ' + e));
    }

    validGroupChat = ({ im_id }, { value }) => {
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
                Taro.setStorageSync('isRefreshFetchAllIMTeamList', 'true')
                const { board_id } = currentBoard

                Taro.navigateTo({
                    url: `../../pages/chat/index?fileInfo=${JSON.stringify(value)}&pageSource=isFileComment&boardId=${board_id}`
                })
            })
            .catch(e => Taro.showToast({ title: String(e), icon: 'none', duration: 2000 }));
    }

    closeTips = () => {
        this.setState({
            is_tips_longpress_file: false
        })
    }

    // 获取定位权限
    getLocationAuth() {
        return new Promise((resolve, reject) => {
            Taro.getSetting({
                success(res) {
                    if (!res.authSetting['scope.userLocation']) {
                        Taro.authorize({
                            scope: 'scope.userLocation',
                            success(val) {
                                resolve(val)
                            }, fail(err) {
                                reject(err)
                            }
                        })
                    } else {
                        resolve(res)
                    }
                }, fail(err) {
                    // reject(err)
                }
            })
        })
    }

    // 判断是否选择项目
    judgeIsSelectProject() {
        let that = this;

        const { header_folder_name } = this.props;
        if (!this.state.uplaodAuto) {
            Taro.showToast({
                title: header_folder_name == '全部文件' ? '请选择相应的项目' : '您没有该项目的上传权限',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        Taro.showActionSheet({
            itemList: ['从微信导入文件', '从相册导入文件', '从相机导入文件'],
            success: function (res) {
                console.log(res.tapIndex)
                if (res.tapIndex == 0) {
                    that.getAuthSetting('file')
                } else if (res.tapIndex == 1) {
                    that.getAuthSetting('album')
                } else if (res.tapIndex == 2) {
                    that.getAuthSetting('camera')
                }
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })

    }

    // 获取授权
    getAuthSetting = (imageSourceType) => {
        let that = this;
        this.getLocationAuth().then(msg => {
            Taro.getSetting({
                success(res) {
                    if (imageSourceType === 'camera') {
                        if (!res.authSetting['scope.camera']) { //获取摄像头权限
                            Taro.authorize({
                                scope: 'scope.camera',
                                success() {
                                    // console.log('授权成功')
                                    that.fileUploadAlbumCamera(imageSourceType)
                                }, fail() {
                                    Taro.showModal({
                                        title: '提示',
                                        content: '尚未进行授权，部分功能将无法使用',
                                        showCancel: false,
                                        success(res) {
                                            if (res.confirm) {
                                                console.log('用户点击确定')
                                                Taro.openSetting({
                                                    success: (res) => {
                                                        if (!res.authSetting['scope.camera']) {
                                                            Taro.authorize({
                                                                scope: 'scope.camera',
                                                                success() {
                                                                    console.log('授权成功')
                                                                }, fail() {
                                                                    console.log('用户点击取消')
                                                                }
                                                            })
                                                        }
                                                    },
                                                    fail: function () {
                                                        console.log("授权设置拍照失败");
                                                    }
                                                })
                                            } else if (res.cancel) {
                                                console.log('用户点击取消')
                                            }
                                        }
                                    })
                                }
                            })
                        } else {
                            that.fileUploadAlbumCamera(imageSourceType)
                        }
                    } else if (imageSourceType === 'album') {
                        if (!res.authSetting['scope.writePhotosAlbum']) { //获取相册权限
                            Taro.authorize({
                                scope: 'scope.writePhotosAlbum',
                                success() {
                                    // console.log('授权成功')
                                    that.fileUploadAlbumCamera(imageSourceType)
                                }, fail() {
                                    Taro.showModal({
                                        title: '提示',
                                        content: '尚未进行授权，部分功能将无法使用',
                                        showCancel: false,
                                        success(res) {
                                            if (res.confirm) {
                                                Taro.openSetting({
                                                    success: (res) => {
                                                    },
                                                    fail: function () {
                                                        console.log("授权设置相册失败");
                                                    }
                                                })
                                            } else if (res.cancel) {
                                                console.log('用户点击取消')
                                            }
                                        }
                                    })
                                }
                            })
                        } else {
                            that.fileUploadAlbumCamera(imageSourceType)
                        }
                    } else if (imageSourceType === 'file') {
                        console.log('文件上传')
                        that.fileUploadMessageFile(imageSourceType)
                    }
                },
                fail(res) {

                }
            })
        }).catch(err => {
            Taro.showModal({
                title: '提示',
                content: '尚未进行授权，部分功能将无法使用',
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        Taro.openSetting({
                            success: (res) => {

                            },
                            fail: function () {
                                console.log("授权设置相册失败");
                            }
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        })

    }

    //拍照/选择图片上传
    fileUploadAlbumCamera = (imageSourceType) => {
        Taro.setStorageSync('isReloadFileList', 'is_reload_file_list')

        let that = this;
        Taro.chooseImage({
            count: 9,
            sizeType: ['original'],
            sourceType: [imageSourceType],
            success(res) {
                console.log(res)
                let tempFilePaths = res.tempFilePaths;
                that.uploadChoiceFolder();
                that.setState({
                    makePho: imageSourceType,
                    choice_image_temp_file_paths: tempFilePaths,
                })
            }
        })
    }

    // 上传微信聊天文件
    fileUploadMessageFile = (imageSourceType) => {
        var that = this;
        Taro.chooseMessageFile({
            count: 10,
            type: 'all',
            success: function (res) {
                // tempFilePath可以作为img标签的src属性显示图片
                // const tempFilePaths = res.tempFilePaths
                var tempFilePaths = res.tempFiles.map(function (item, index, input) {
                    return item.path;
                })
                that.uploadChoiceFolder();
                that.setState({
                    makePho: imageSourceType,
                    choice_image_temp_file_paths: tempFilePaths,
                })
            }
        })

    }



    uploadChoiceFolder = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                isShowChoiceFolder: true,
            },
        })
    }

    addSendPromise = (filePath, data, authorization, base_info) => {
        return new Promise((resolve, reject) => {
            Taro.uploadFile({
                url: BASE_URL + API_BOARD + '/file/batch/upload', //后端接口
                filePath: filePath,
                name: 'file',
                header: {
                    "Content-Type": "multipart/form-data; charset=utf-8",
                    "Accept-Language": "zh-CN,zh;q=0.9",
                    "Accept-Encoding": "gzip, deflate",
                    "Accept": "*/*",
                    Authorization: authorization,
                    ...base_info,
                },
                formData: data, //上传POST参数信息
                success(res) {
                    // console.log(res)
                    if (res.statusCode === 200) {
                        let d = JSON.parse(res.data);
                        if (d.code == 0)
                            resolve(res);
                        else {
                            reject(res)
                        }
                    } else {
                        // Taro.showModal({ title: '提示', content: `${'第' + i + '张' + '上传失败'}`, showCancel: false });
                        reject(res)
                    }
                },
                fail(error) {
                    reject(error)
                    // Taro.showModal({ title: '提示', content: `${'第' + i + '张' + '上传失败'}`, showCancel: false });
                },
                complete() {
                    // Taro.hideToast();
                }
            })
        })
    }

    //上传到后端
    fileUpload = ({ longitude, latitude }) => {
        const { choice_image_temp_file_paths } = this.state
        const { selected_board_folder_info } = this.props
        const { org_id, board_id, folder_id, current_folder_name, } = selected_board_folder_info

        //保存数据, 用作下拉刷新参数
        const params = {
            org_id: org_id,
            board_id: board_id,
            folder_id: folder_id == undefined ? '' : folder_id,
        }
        Taro.setStorageSync('file_pull_down_refresh', JSON.stringify(params))

        //上传
        let that = this;
        const authorization = Taro.getStorageSync('access_token')
        const data = {
            board_id: board_id,
            folder_id: folder_id == undefined ? '' : folder_id,
            type: 1,
            upload_type: 1,
            longitude, latitude
        }

        console.log(data)

        const base_info = setRequestHeaderBaseInfo({ data, headers: authorization })
        // let num = 1;
        Taro.showToast({ icon: "loading", title: `正在上传...` });
        // 统一上传
        let promise = [];
        console.log("===============================");



        //开发者服务器访问接口，微信服务器通过这个接口上传文件到开发者服务器
        for (var i = 0; i < choice_image_temp_file_paths.length; i++) {
            promise.push(this.addSendPromise(choice_image_temp_file_paths[i], data, authorization, base_info))
        }

        Promise.all(promise).then(res => {
            // const resData = res.data && JSON.parse(res.data)
            // num += 1;
            // if (resData.code === '0') {
            //更新头部显示文件夹名称
            that.updateHeaderFolderName(current_folder_name)
            //重新掉列表接口, 刷新列表
            that.getFilePage(org_id, board_id, '')
            Taro.showToast({
                icon: "success",
                title: "上传完成"
            })
            // } else {
            // Taro.showModal({ title: '提示', content: resData.message, showCancel: false });
            // }
        }).catch(err => {
            console.log(err)
            Taro.showModal({ title: '提示', content: "上传失败,请重试", showCancel: false });
        })
    }

    render() {

        const { isShowBoardList, header_folder_name, isShowChoiceFolder } = this.props
        const { is_tips_longpress_file, choice_image_temp_file_paths = [], makePho, file_list_state, upload_sheet_list, uplaodAuto } = this.state

        return (
            <View className={indexStyles.index} >
                {
                    isShowBoardList === true ?

                        <BoardFile closeBoardList={() => this.choiceBoard(false)} selectedBoardFile={(org_id, board_id, folder_id) => this.getFilePage(org_id, board_id, folder_id)} />
                        : ''
                }
                {
                    isShowChoiceFolder === true ? (<ChoiceFolder makePho={makePho} choiceImageThumbnail={choice_image_temp_file_paths} fileUpload={(val) => this.fileUpload(val)} />) : ''
                }
                {/* <View style={{ position: 'sticky', top: 0 + 'px', left: 0 }} className={indexStyles.SearchAndMenu}> */}
                {/* {/* <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={'0'} onSearch={(value) => this.onSearch(value)} isDisabled={false} /> */}
                {/* </View > */}

                <View className={indexStyles.head_background}>
                    <View className={indexStyles.hear_function}>

                        <View className={indexStyles.folderPath} onClick={() => this.choiceBoard(true)}>
                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.folder_Path_icon}`}>&#xe6c6;</Text>
                            <Text className={indexStyles.header_folder_name_style}>{header_folder_name}</Text>
                        </View>

                        <View className={indexStyles.files_album_camera_view_style}>
                            {/*  <View className={indexStyles.files_album_camera_button_style} onClick=
                                {this.getAuthSetting.bind(this, 'file')}><Text className={`${globalStyle.global_iconfont} ${indexStyles.
                                    files_album_camera_icon_style}`}>&#xe662;</Text></View>
                            <View className={indexStyles.files_album_camera_button_style} onClick={this.getAuthSetting.bind(this, 'album')}>
                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.files_album_camera_icon_style}`}>&#xe664;</Text>
                            </View>
                                */}

                            <View className={`${indexStyles.files_album_camera_button_style} ${uplaodAuto ? '' : indexStyles.files_unused_button_style}`} onClick={this.judgeIsSelectProject.bind(this, 'camera')}><Text className={`${globalStyle.global_iconfont} ${indexStyles.files_album_camera_icon_style}`}>&#xe7b7;</Text></View>
                            {/* &#xe86f; */}
                        </View>

                    </View>
                </View>
                {
                    file_list_state && file_list_state.length !== 0 ? (<View className={indexStyles.grid_style}>
                        {file_list_state.map((value, key) => {
                            const { thumbnail_url, msg_ids, visited } = value
                            const fileType = filterFileFormatType(value.file_name);
                            return (
                                <View className={indexStyles.lattice_style} onClick={this.goFileDetails.bind(this, value, value.file_name)} onLongPress={this.longPress.bind(this, value)} key={key}>
                                    {
                                        visited != '1' ? (<View className={indexStyles.redcircle}></View>) : (null)
                                    }
                                    {
                                        msg_ids != null ? <View className={indexStyles.unread_red}>
                                        </View> : (<View></View>)
                                    }
                                    {
                                        thumbnail_url ?
                                            (<Image mode='aspectFill' className={indexStyles.img_style} src={thumbnail_url}>
                                            </Image>)
                                            :
                                            (<View className={indexStyles.other_icon_style}>
                                                <RichText className={`${globalStyle.global_iconfont} ${indexStyles.folder_type_icon}`} nodes={fileType} />
                                                <View className={indexStyles.other_name_style}>{value.file_name}</View>
                                            </View>)
                                    }
                                </View>
                            )
                        })}
                    </View>
                    ) : (
                        <View className={indexStyles.contain1}>
                            <Image src={file_list_empty} className={indexStyles.file_list_empty} />
                        </View>
                    )
                }

                {
                    is_tips_longpress_file === true ? (<View className={indexStyles.tips_view_style}>
                        <View className={indexStyles.tips_style}>
                            <View className={indexStyles.tips_cell_style}>
                                <Text className={`${globalStyle.global_iconfont} ${indexStyles.tips_icon_style}`}>&#xe848;</Text>
                                <View className={indexStyles.tips_text_style}>长按文件可以进入圈子交流</View>
                                <View onClick={this.closeTips}>
                                    <Text className={`${globalStyle.global_iconfont} ${indexStyles.tips_close_style}`}>&#xe7fc;</Text>
                                </View>
                            </View>
                        </View>
                    </View>) : ''
                }

            </View >
        )
    }
}

