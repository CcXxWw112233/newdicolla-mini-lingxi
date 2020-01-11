import Taro, { Component, hideToast, pageScrollTo, getExtConfig } from '@tarojs/taro'
import { View, Text, Image, RichText } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
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

    componentDidMount() {
        const params = {
            org_id: '0',
            board_id: '',
            folder_id: ''
        }
        //保存数据, 用作下拉刷新参数
        Taro.setStorageSync('file_pull_down_refresh', JSON.stringify(params))
        this.loadData(params)
    }

    loadData = (params) => {
        const { org_id, board_id, folder_id } = params
        this.getFilePage(org_id, board_id, folder_id)
    }


    componentDidHide() { }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    getFilePage = (org_id, board_id, folder_id) => {

        //保存数据, 用作下拉刷新参数
        const params = {
            org_id: org_id,
            board_id: board_id,
            folder_id: folder_id,
        }
        Taro.setStorageSync('file_pull_down_refresh', JSON.stringify(params))

        //加载数据
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
        ).then(res => {
            Taro.pageScrollTo({
                scrollTop: 100000,
                duration: 100,
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
        Taro.setStorageSync('isRefreshFetchAllIMTeamList', 'true')
        Taro.setStorageSync('isReloadFileList', 'is_reload_file_list')

        const { dispatch, setCurrentBoardId, setCurrentBoard, allBoardList, checkTeamStatus, } = this.props
        const { board_id } = value
        dispatch({
            type: 'file/updateDatas',
            payload: {
                isShowFileComment: true,
            },
        })

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
                this.validGroupChat({ im_id }, { value })
            })
            .catch(e => console.log('error in boardDetail: ' + e));
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
            .catch(e => Taro.showToast({ title: String(e), icon: 'none' }));
    }

    closeTips = () => {
        this.setState({
            is_tips_longpress_file: false
        })
    }

    // 获取授权
    getAuthSetting = (imageSourceType) => {
        let that = this;
        Taro.getSetting({
            success(res) {
                if (imageSourceType === 'camera') {
                    if (!res.authSetting['scope.camera']) { //获取摄像头权限
                        Taro.authorize({
                            scope: 'scope.camera',
                            success() {
                                console.log('授权成功')
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
                                console.log('授权成功')
                            }, fail() {
                                Taro.showModal({
                                    title: '提示',
                                    content: '尚未进行授权，部分功能将无法使用',
                                    showCancel: false,
                                    success(res) {
                                        if (res.confirm) {
                                            Taro.openSetting({
                                                success: (res) => {
                                                    if (!res.authSetting['scope.record']) {
                                                        Taro.authorize({
                                                            scope: 'scope.record',
                                                            success() {
                                                                console.log('授权成功')
                                                            }, fail() {
                                                                console.log('用户点击取消')
                                                            }
                                                        })
                                                    }
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
                }
            },
            fail(res) {

            }
        })
    }

    //拍照/选择图片上传
    fileUploadAlbumCamera = (imageSourceType) => {
        Taro.setStorageSync('isReloadFileList', 'is_reload_file_list')

        let that = this;
        Taro.chooseImage({
            count: 9 - that.state.choice_image_temp_file_paths.length,
            sizeType: ['original'],
            sourceType: [imageSourceType],
            success(res) {
                let tempFilePaths = res.tempFilePaths;
                that.uploadChoiceFolder();
                that.setState({
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

    //上传到后端
    fileUpload = () => {

        const { choice_image_temp_file_paths } = this.state
        const { selected_board_folder_info } = this.props
        const { org_id, board_id, folder_id, current_folder_name, } = selected_board_folder_info

        //保存数据, 用作下拉刷新参数
        const params = {
            org_id: org_id,
            board_id: board_id,
            folder_id: folder_id,
        }
        Taro.setStorageSync('file_pull_down_refresh', JSON.stringify(params))

        //上传
        let that = this;
        const authorization = Taro.getStorageSync('access_token')
        const data = {
            board_id: board_id,
            folder_id: folder_id,
            type: 1,
            upload_type: 1,
        }
        const base_info = setRequestHeaderBaseInfo({ data, headers: authorization })

        Taro.showToast({ icon: "loading", title: "正在上传..." });
        //开发者服务器访问接口，微信服务器通过这个接口上传文件到开发者服务器
        for (var i = 0; i < choice_image_temp_file_paths.length; i++) {
            Taro.uploadFile({
                url: BASE_URL + API_BOARD + '/file/batch/upload', //后端接口
                filePath: choice_image_temp_file_paths[i],
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
                    if (res.statusCode === 200) {
                        const resData = res.data && JSON.parse(res.data)
                        if (resData.code === '0') {
                            //更新头部显示文件夹名称
                            that.updateHeaderFolderName(current_folder_name)
                            //重新掉列表接口, 刷新列表
                            that.getFilePage(org_id, board_id, '')
                        } else {
                            Taro.showModal({ title: '提示', content: resData.message, showCancel: false });
                        }
                    } else {
                        Taro.showModal({ title: '提示', content: `${'第' + i + '张' + '上传失败'}`, showCancel: false });
                    }
                },
                fail(error) {
                    Taro.showModal({ title: '提示', content: `${'第' + i + '张' + '上传失败'}`, showCancel: false });
                },
                complete() {
                    Taro.hideToast();
                }
            })
        }
    }

    render() {

        const { file_list = [], isShowBoardList, header_folder_name, isShowChoiceFolder } = this.props
        const { is_tips_longpress_file, choice_image_temp_file_paths = [], } = this.state

        return (
            <View className={indexStyles.index}>
                {
                    isShowBoardList === true ?
                        <BoardFile closeBoardList={() => this.choiceBoard(false)} selectedBoardFile={(org_id, board_id, folder_id) => this.getFilePage(org_id, board_id, folder_id)} />
                        : ''
                }
                {
                    isShowChoiceFolder === true ? (<ChoiceFolder choiceImageThumbnail={choice_image_temp_file_paths} fileUpload={() => this.fileUpload()} />) : ''
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
                    file_list && file_list.length !== 0 ? (<View className={indexStyles.grid_style}>
                        {file_list.map((value, key) => {
                            const { thumbnail_url, } = value

                            const fileType = filterFileFormatType(value.file_name)
                            return (
                                <View className={indexStyles.lattice_style} onClick={this.goFileDetails.bind(this, value, value.file_name)} onLongPress={this.longPress.bind(this, value)}>
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
            </View>
        )
    }
}

