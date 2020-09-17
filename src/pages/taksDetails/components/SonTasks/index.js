import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtActionSheet, AtActionSheetItem } from "taro-ui"
import { connect } from '@tarojs/redux'
import { getOrgIdByBoardId, setBoardIdStorage } from '../../../../utils/basicFunction'

@connect(({ tasks: { tasksDetailDatas = {}, }, }) => ({
    tasksDetailDatas,
}))
export default class index extends Component {

    state = {
        song_task_isOpen: false,
        song_task_id: '',
        file_option_isOpen: false,
        file_id: '',

        file_resource_id: '',
        board_id: '',
        fileName: '',
    }

    tasksRealizeStatus = (cardId, isRealize) => {

        const cellInfo = {
            cardId: cardId,
            isRealize: isRealize,
        }

        this.props.tasksDetailsRealizeStatus(cellInfo)
    }

    handleCancel = () => {
        this.setSongTaskIsOpen()
    }

    handleClose = () => {
        this.setSongTaskIsOpen()
    }

    setSongTaskIsOpen = () => {

        this.setState({
            song_task_isOpen: false,
        })
    }

    tasksOption = (cardId) => {
        this.setState({
            song_task_isOpen: true,
            song_task_id: cardId,
        })
    }

    uploadFile = () => {
        this.getAuthSetting()
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

    uploadChoiceFolder = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                isShowChoiceFolder: true,
            },
        })
    }

    deleteSongTasks = () => {
        const { dispatch, tasksDetailDatas = {} } = this.props
        const { card_id } = tasksDetailDatas
        const { song_task_id } = this.state
        dispatch({
            type: 'tasks/deleteCard',
            payload: {
                id: song_task_id,
                card_id: card_id,
            }
        })

        this.setSongTaskIsOpen()
    }

    fileOption = (id, file_resource_id, board_id, fileName) => {

        this.setState({
            file_option_isOpen: true,
            file_id: id,

            file_resource_id: file_resource_id,
            board_id: board_id,
            fileName: fileName,
        })
    }

    previewFile = () => {

        const { dispatch } = this.props

        const { file_resource_id, board_id, fileName, } = this.state

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


        this.setFileOptionIsOpen()
    }

    deleteFile = () => {

        const { dispatch, tasksDetailDatas = {} } = this.props
        const { card_id } = tasksDetailDatas
        const { file_id } = this.state
        dispatch({
            type: 'tasks/deleteCardAttachment',
            payload: {
                attachment_id: file_id,
                card_id: card_id,
            }
        })

        this.setFileOptionIsOpen()
    }

    fileHandleCancel = () => {

        this.setFileOptionIsOpen()
    }

    setFileOptionIsOpen = () => {
        this.setState({
            file_option_isOpen: false,
        })
    }
    fileHandleClose = () => {

        this.setFileOptionIsOpen()
    }

    render() {
        const { child_data } = this.props
        return (
            <View className={indexStyles.list_item}>
                <View className={indexStyles.title_row}>
                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7f4;</Text>
                    </View>
                    <View className={indexStyles.list_item_name}>子任务</View>
                    <View className={`${indexStyles.list_item_rigth_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7fc;</Text>
                    </View>
                </View>

                <View className={indexStyles.song_task_centent}>
                    {
                        child_data && child_data.map((value, key) => {
                            const { card_name, deliverables = [], card_id, is_realize } = value
                            return (
                                <View className={indexStyles.content}>
                                    <View className={indexStyles.song_row_instyle}>
                                        {
                                            is_realize == '0' ? (<View className={`${indexStyles.list_item_select_iconnext}`} onClick={() => this.tasksRealizeStatus(card_id, is_realize)}>
                                                <Text className={`${globalStyle.global_iconfont}`}>&#xe6df;</Text>
                                            </View>) : (<View className={`${indexStyles.list_item_select_iconnext}`} onClick={() => this.tasksRealizeStatus(card_id, is_realize)}>
                                                <Text className={`${globalStyle.global_iconfont}`}>&#xe844;</Text>
                                            </View>)
                                        }
                                        <View className={indexStyles.song_task_name}>{card_name}</View>
                                        <View className={`${indexStyles.list_item_rigth_iconnext}`} onClick={() => this.tasksOption(card_id)}>
                                            <Text className={`${globalStyle.global_iconfont}`}>&#xe63f;</Text>
                                        </View>
                                    </View>

                                    {
                                        deliverables.map((item, key1) => {
                                            const { id, name, file_resource_id, board_id } = item
                                            return (
                                                <View className={indexStyles.song_tasks_file}>
                                                    <View className={`${indexStyles.list_item_file_iconnext}`}>
                                                        <Text className={`${globalStyle.global_iconfont}`}>&#xe669;</Text>
                                                    </View>
                                                    <View className={indexStyles.song_tasks_file_name} onClick={() => this.fileOption(id, file_resource_id, board_id, name,)}>{name}</View>
                                                </View>
                                            )
                                        })
                                    }

                                </View>
                            )
                        })
                    }
                </View>

                <View className={indexStyles.add_task_row}>
                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7b7;</Text>
                    </View>
                    <View className={indexStyles.add_item_name}>添加子任务</View>
                </View>

                <AtActionSheet isOpened={this.state.song_task_isOpen} cancelText='取消' onCancel={this.handleCancel} onClose={this.handleClose}>
                    <AtActionSheetItem onClick={this.uploadFile}>
                        上传交付物
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={this.deleteSongTasks}>
                        删除子任务
                    </AtActionSheetItem>
                </AtActionSheet>

                <AtActionSheet isOpened={this.state.file_option_isOpen} cancelText='取消' onCancel={this.fileHandleCancel} onClose={this.fileHandleClose}>
                    <AtActionSheetItem onClick={this.previewFile}>
                        预览交付物
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={this.deleteFile}>
                        删除交付物
                    </AtActionSheetItem>
                </AtActionSheet>

            </View>
        )
    }
}
