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
        navigationBarTitleText: '??????',
        "enablePullDownRefresh": true,
    }
    state = {
        is_tips_longpress_file: false,  //?????????????????????????????????????????????
        choice_image_temp_file_paths: [],  //????????????????????????api??????????????????
        makePho: "", //???????????????????????????
        officialAccountFileInfo: {}, //?????????????????????????????????????????????
        file_list_state: [], //??????????????????
        un_read_file_array: [], //??????????????????
    }

    onShareAppMessage() {
        return {
            title: '??????',
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
    }

    componentDidHide() {
        const { dispatch } = this.props
        const { un_read_file_array } = this.state

        ///??????????????????
        this.readFile(dispatch, un_read_file_array);
    }

    componentDidShow() {
        const refreshStr = Taro.getStorageSync('file_pull_down_refresh')
        const refreshData = JSON.parse(refreshStr)
        const { org_id, board_id, folder_id } = refreshData
        const params = {
            org_id: org_id,
            board_id: board_id,
            folder_id: folder_id,
        }

        this.loadData(params);
    }

    componentDidMount() {
        const params = {
            org_id: '0',
            board_id: '',
            folder_id: ''
        }
        //????????????, ????????????????????????
        Taro.setStorageSync('file_pull_down_refresh', JSON.stringify(params))
        this.loadData(params)

        const { dispatch } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                header_folder_name: '????????????',
            },
        })

        /// ?????????????????????????????????????????????
        this.setState({
            officialAccountFileInfo: Taro.getStorageSync('switchTabFileInfo'),
        })
    }

    //????????????
    loadData = (params) => {
        const { org_id, board_id, folder_id } = params
        this.getFilePage(org_id, board_id, folder_id)
    }

    getFilePage = (org_id, board_id, folder_id) => {

        //????????????, ????????????????????????
        const params = {
            org_id: org_id,
            board_id: board_id,
            folder_id: folder_id,
        }
        Taro.setStorageSync('file_pull_down_refresh', JSON.stringify(params))

        let that = this;
        //????????????
        const { dispatch } = this.props

        Promise.resolve(
            dispatch({
                type: 'file/getFilePage',
                payload: {
                    _organization_id: org_id,
                    board_id: board_id,
                    folder_id: folder_id,
                    page_number: '',
                    page_size: '',
                },
            })
        ).then(() => {

            ///????????????????????????????????????????????????
            const { officialAccountFileInfo = {} } = this.state
            if (officialAccountFileInfo && officialAccountFileInfo.push == 'officialAccount') {
                const { file_list = [] } = this.props

                //??????????????????????????????id?????????????????????????????????item
                var previewFileInfo = file_list.find(item => item.id == officialAccountFileInfo.contentId);
                const { file_name } = previewFileInfo
                ///????????????
                that.goFileDetails(previewFileInfo, file_name);
                //??????????????????
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

            //??????????????????list
            this.getUnreadFileList(dispatch);

        })
    }

    //??????????????????list
    getUnreadFileList = (dispatch) => {

        dispatch({
            type: 'file/getFileUnreadList',
            payload: {
                type: '3',  //??????
            },
        }).then(() => {
            //??????????????????
            const { unread_file_list = [], file_list = [], un_read_file_array = [], } = this.props;

            //????????????????????????, ??????????????????id, ???????????????????????????
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
                Taro.pageScrollTo({
                    scrollTop: 100000,
                    duration: 100,
                })
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

    //????????????????????????
    choiceBoard = (e) => {

        const { dispatch } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                isShowBoardList: e,
            },
        })
    }

    //??????????????????
    goFileDetails = (value, fileName) => {
        Taro.setStorageSync('isReloadFileList', 'is_reload_file_list')
        const { file_resource_id, board_id, } = value
        const { dispatch } = this.props
        setBoardIdStorage(board_id)
        const fileType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
        const parameter = {
            board_id,
            ids: file_resource_id,
            _organization_id: getOrgIdByBoardId(board_id),
        }

        // ??????????????????
        Taro.getSavedFileList({
            success(res) {
                if (res.fileList.length > 0) {
                    Taro.removeSavedFile({
                        filePath: res.fileList[0].filePath,
                        complete(res) {
                            //console.log('????????????', res)
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

        //?????????????????????????????????????????????
        const tips_longpress_file = Taro.getStorageSync('tips_longpress_file')
        if (!tips_longpress_file) {
            Taro.setStorageSync('tips_longpress_file', 'tips_longpress_file')
            this.setState({
                is_tips_longpress_file: true
            })
        }


        var arr = [];
        arr.push(value.msg_ids);
        //?????????????????????
        this.readFile(dispatch, arr);
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
        const { org_id, board_id, folder_id } = refreshData
        const params = {
            org_id: org_id,
            board_id: board_id,
            folder_id: folder_id,
        }

        this.loadData(params);

        Taro.removeStorageSync('switchTabFileInfo');
        this.setState({
            officialAccountFileInfo: null,
        })
    }

    onSearch = (value, board_id, file_id) => {
        //???????????????????????????????????????
        const searchTerm = value.replace(/(^\s*)|(\s*$)/g, "");
        //?????????????????????????????????????????????
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
                    search_term: searchTerm, //?????????
                    search_type: '6',  //?????? type = 6
                },
            })

            dispatch({
                type: 'file/updateDatas',
                payload: {
                    header_folder_name: '????????????',
                },
            })
        } else {
            this.getFilePage('0', '', '')
        }
    }

    //??????????????????
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

    // ????????????
    getAuthSetting = (imageSourceType) => {
        let that = this;
        this.getLocationAuth().then(msg => {
            Taro.getSetting({
                success(res) {
                    if (imageSourceType === 'camera') {
                        if (!res.authSetting['scope.camera']) { //?????????????????????
                            Taro.authorize({
                                scope: 'scope.camera',
                                success() {
                                    // console.log('????????????')
                                    that.fileUploadAlbumCamera(imageSourceType)
                                }, fail() {
                                    Taro.showModal({
                                        title: '??????',
                                        content: '????????????????????????????????????????????????',
                                        showCancel: false,
                                        success(res) {
                                            if (res.confirm) {
                                                console.log('??????????????????')
                                                Taro.openSetting({
                                                    success: (res) => {
                                                        if (!res.authSetting['scope.camera']) {
                                                            Taro.authorize({
                                                                scope: 'scope.camera',
                                                                success() {
                                                                    console.log('????????????')
                                                                }, fail() {
                                                                    console.log('??????????????????')
                                                                }
                                                            })
                                                        }
                                                    },
                                                    fail: function () {
                                                        console.log("????????????????????????");
                                                    }
                                                })
                                            } else if (res.cancel) {
                                                console.log('??????????????????')
                                            }
                                        }
                                    })
                                }
                            })
                        } else {
                            that.fileUploadAlbumCamera(imageSourceType)
                        }
                    } else if (imageSourceType === 'album') {
                        if (!res.authSetting['scope.writePhotosAlbum']) { //??????????????????
                            Taro.authorize({
                                scope: 'scope.writePhotosAlbum',
                                success() {
                                    // console.log('????????????')
                                    that.fileUploadAlbumCamera(imageSourceType)
                                }, fail() {
                                    Taro.showModal({
                                        title: '??????',
                                        content: '????????????????????????????????????????????????',
                                        showCancel: false,
                                        success(res) {
                                            if (res.confirm) {
                                                Taro.openSetting({
                                                    success: (res) => {
                                                    },
                                                    fail: function () {
                                                        console.log("????????????????????????");
                                                    }
                                                })
                                            } else if (res.cancel) {
                                                console.log('??????????????????')
                                            }
                                        }
                                    })
                                }
                            })
                        } else {
                            that.fileUploadAlbumCamera(imageSourceType)
                        }
                    }
                },
                fail(res) {

                }
            })
        }).catch(err => {
            Taro.showModal({
                title: '??????',
                content: '????????????????????????????????????????????????',
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        Taro.openSetting({
                            success: (res) => {

                            },
                            fail: function () {
                                console.log("????????????????????????");
                            }
                        })
                    } else if (res.cancel) {
                        console.log('??????????????????')
                    }
                }
            })
        })

    }

    //??????/??????????????????
    fileUploadAlbumCamera = (imageSourceType) => {
        Taro.setStorageSync('isReloadFileList', 'is_reload_file_list')

        let that = this;
        Taro.chooseImage({
            // count: 9 - that.state.choice_image_temp_file_paths.length,
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
        // console.log(data)
        return new Promise((resolve, reject) => {
            Taro.uploadFile({
                url: BASE_URL + API_BOARD + '/file/batch/upload', //????????????
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
                formData: data, //??????POST????????????
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
                        // Taro.showModal({ title: '??????', content: `${'???' + i + '???' + '????????????'}`, showCancel: false });
                        reject(res)
                    }
                },
                fail(error) {
                    reject(error)
                    // Taro.showModal({ title: '??????', content: `${'???' + i + '???' + '????????????'}`, showCancel: false });
                },
                complete() {
                    // Taro.hideToast();
                }
            })
        })
    }

    //???????????????
    fileUpload = ({ longitude, latitude }) => {

        const { choice_image_temp_file_paths } = this.state
        const { selected_board_folder_info } = this.props
        const { org_id, board_id, folder_id, current_folder_name, } = selected_board_folder_info

        //????????????, ????????????????????????
        const params = {
            org_id: org_id,
            board_id: board_id,
            folder_id: folder_id,
        }
        Taro.setStorageSync('file_pull_down_refresh', JSON.stringify(params))

        //??????
        let that = this;
        const authorization = Taro.getStorageSync('access_token')
        const data = {
            board_id: board_id,
            folder_id: folder_id,
            type: 1,
            upload_type: 1,
            longitude, latitude
        }
        const base_info = setRequestHeaderBaseInfo({ data, headers: authorization })
        // let num = 1;
        Taro.showToast({ icon: "loading", title: `????????????...` });
        // ????????????
        let promise = [];
        //???????????????????????????????????????????????????????????????????????????????????????????????????
        for (var i = 0; i < choice_image_temp_file_paths.length; i++) {
            promise.push(this.addSendPromise(choice_image_temp_file_paths[i], data, authorization, base_info))
        }

        Promise.all(promise).then(res => {
            // const resData = res.data && JSON.parse(res.data)
            // num += 1;
            // if (resData.code === '0') {
            //?????????????????????????????????
            that.updateHeaderFolderName(current_folder_name)
            //?????????????????????, ????????????
            that.getFilePage(org_id, board_id, '')
            Taro.showToast({
                icon: "success",
                title: "????????????"
            })
            // } else {
            // Taro.showModal({ title: '??????', content: resData.message, showCancel: false });
            // }
        }).catch(err => {
            console.log(err)
            Taro.showModal({ title: '??????', content: "????????????,?????????", showCancel: false });
        })
    }

    render() {

        const { isShowBoardList, header_folder_name, isShowChoiceFolder } = this.props
        const { is_tips_longpress_file, choice_image_temp_file_paths = [], makePho, file_list_state } = this.state

        return (
            <View className={indexStyles.index}>
                {
                    isShowBoardList === true ?
                        <BoardFile closeBoardList={() => this.choiceBoard(false)} selectedBoardFile={(org_id, board_id, folder_id) => this.getFilePage(org_id, board_id, folder_id)} />
                        : ''
                }
                {
                    isShowChoiceFolder === true ? (<ChoiceFolder makePho={makePho} choiceImageThumbnail={choice_image_temp_file_paths} fileUpload={(val) => this.fileUpload(val)} />) : ''
                }
                <View style={{ position: 'sticky', top: 0 + 'px', left: 0 }}>
                    <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={'0'} onSearch={(value) => this.onSearch(value)} isDisabled={false} />
                </View>

                <View className={indexStyles.head_background}>
                    <View className={indexStyles.hear_function}>

                        <View className={indexStyles.folderPath} onClick={() => this.choiceBoard(true)}>
                            <Text className={`${globalStyle.global_iconfont} ${indexStyles.folder_Path_icon}`}>&#xe6c6;</Text>
                            <Text className={indexStyles.header_folder_name_style}>{header_folder_name}</Text>
                        </View>

                        <View className={indexStyles.files_album_camera_view_style}>
                            <View className={indexStyles.files_album_camera_button_style} onClick={this.getAuthSetting.bind(this, 'album')}><Text className={`${globalStyle.global_iconfont} ${indexStyles.files_album_camera_icon_style}`}>&#xe664;</Text></View>
                            <View className={indexStyles.files_album_camera_button_style} onClick={this.getAuthSetting.bind(this, 'camera')}><Text className={`${globalStyle.global_iconfont} ${indexStyles.files_album_camera_icon_style}`}>&#xe86f;</Text></View>
                        </View>

                    </View>
                </View>
                {
                    file_list_state && file_list_state.length !== 0 ? (<View className={indexStyles.grid_style}>
                        {file_list_state.map((value, key) => {
                            const { thumbnail_url, msg_ids } = value
                            const fileType = filterFileFormatType(value.file_name)
                            return (
                                <View className={indexStyles.lattice_style} onClick={this.goFileDetails.bind(this, value, value.file_name)} onLongPress={this.longPress.bind(this, value)} key={key}>
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
                                <View className={indexStyles.tips_text_style}>????????????????????????????????????</View>
                                <View onClick={this.closeTips}>
                                    <Text className={`${globalStyle.global_iconfont} ${indexStyles.tips_close_style}`}>&#xe7fc;</Text>
                                </View>
                            </View>
                        </View>
                    </View>) : ''
                }
            </View>
        )
    }
}

