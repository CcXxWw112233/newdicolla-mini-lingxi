import Taro, { Component } from '@tarojs/taro'
import { View, Text, RichText, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtActionSheet, AtActionSheetItem } from "taro-ui"
import { connect } from '@tarojs/redux'
import { getOrgIdByBoardId, setBoardIdStorage, judgeJurisdictionProject } from '../../../../utils/basicFunction'
import { PROJECT_FILES_FILE_DOWNLOAD } from "../../../../gloalSet/js/constant";

@connect(({ tasks: { tasksDetailDatas = {}, }, }) => ({
    tasksDetailDatas,
}))
export default class index extends Component {

    state = {
        song_task_isOpen: false,
        song_task_id: '',
        file_option_isOpen: false,
        file_id: '',
        file_item_id: '',

        file_resource_id: '',
        board_id: '',
        fileName: '',
    }

    handleCancel = () => {
        this.setDescribeTasksIsOpen()
    }

    handleClose = () => {
        this.setDescribeTasksIsOpen()
    }

    setDescribeTasksIsOpen = () => {
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

    uploadDescribeTasksFile = () => {
        const { uploadAuth } = this.props;
        console.log(uploadAuth)
        if (uploadAuth) {
            this.setDescribeTasksIsOpen()
            this.getAuthSetting()
        } else {
            Taro.showToast({
                title: '您没有上传附件的权限',
                icon: 'none',
                duration: 2000
            })
        }
    }

    // 获取授权
    getAuthSetting = () => {
        let that = this;
        this.getLocationAuth().then(msg => {
            Taro.getSetting({
                success(res) {
                    if (!res.authSetting['scope.writePhotosAlbum']) { //获取相册权限
                        Taro.authorize({
                            scope: 'scope.writePhotosAlbum',
                            success() {
                                // console.log('授权成功')
                                that.fileUploadAlbumCamera()
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
                        that.fileUploadAlbumCamera()
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
    fileUploadAlbumCamera = () => {
        Taro.setStorageSync('isReloadFileList', 'is_reload_file_list')

        let that = this;
        Taro.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['album'],
            success(res) {
                console.log(res)
                let tempFilePaths = res.tempFilePaths;
                that.setFileOptionIsOpen()
                that.uploadChoiceFolder();
                that.saveChoiceImageTempFilePaths(tempFilePaths)
            }
        })
    }

    saveChoiceImageTempFilePaths = (tempFilePaths) => {
        const { dispatch } = this.props
        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                choice_image_temp_file_paths: tempFilePaths,
            },
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

    deleteDescribeTasks = () => {

        const { dispatch, propertyId, cardId } = this.props
        if (judgeJurisdictionProject(PROJECT_FILES_FILE_DOWNLOAD)) {
            dispatch({
                type: 'tasks/deleteCardProperty',
                payload: {
                    property_id: propertyId,
                    card_id: cardId,
                    callBack: this.deleteTasksFieldRelation(propertyId),
                },
            })

            this.setDescribeTasksIsOpen()
        } else {
            Taro.showToast({
                title: '您没有删除附件的权限',
                icon: 'none',
                duration: 2000
            })
        }

    }

    fileOption = (id, file_resource_id, board_id, fileName, file_id) => {

        this.setState({
            file_option_isOpen: true,
            file_id: id,

            file_resource_id: file_resource_id,
            board_id: board_id,
            fileName: fileName,
            file_item_id: file_id,
        })

        const { cardId, dispatch, } = this.props
        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                song_task_id: cardId,
                tasks_upload_file_type: 'describeTasks',
            }
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

        const { dispatch, cardId, fileInterViewAuth } = this.props
        const { file_id, file_item_id, } = this.state
        if (fileInterViewAuth) {
            dispatch({
                type: 'tasks/deleteCardAttachment',
                payload: {
                    attachment_id: file_id,
                    card_id: cardId,
                    code: "REMARK",
                    calback: this.deleteCardAttachment(cardId, file_item_id,),
                }
            })
            this.setFileOptionIsOpen()
        } else {
            Taro.showToast({
                title: '您没有预览该文件的权限',
                icon: 'none',
                duration: 2000
            })
        }

    }

    deleteCardAttachment = (cardId, file_item_id) => {

        const { dispatch, tasksDetailDatas, } = this.props
        const { dec_files = [] } = tasksDetailDatas
        let array = [];
        dec_files.forEach(item => {
            if (item['file_id'] !== file_item_id) {
                array.push(item)
            }
        })
        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...{ dec_files: array },
                }
            }
        })
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

    deleteCardProperty = () => {

        const { dispatch, cardId } = this.props
        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                song_task_id: cardId,
                tasks_upload_file_type: 'describeTasks',
            }
        })

        this.setState({
            song_task_isOpen: true,
        })
    }

    deleteTasksFieldRelation = (propertyId) => {

        const { dispatch, tasksDetailDatas, } = this.props
        const { properties = [], } = tasksDetailDatas

        let new_array = []
        properties.forEach(element => {

            if (element.id !== propertyId) {
                new_array.push(element)
            }
        });

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...{ properties: new_array },
                }
            }
        })
    }

    render() {
        const { tasksDetailDatas = {} } = this.props
        const { dec_files = [] } = tasksDetailDatas
        const name = this.props.name || ''

        return (

            <View className={indexStyles.wapper}>

                {/* <View className={indexStyles.list_item} onClick={this.gotoChangeChoiceInfoPage.bind(this,)}> */}
                <View className={indexStyles.list_item}>
                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7f5;</Text>
                    </View>
                    <View className={indexStyles.list_item_name}>描述</View>
                    <View className={indexStyles.right_style}>
                        <View className={indexStyles.right_centre_style}>
                            <View>
                                <View className={indexStyles.list_item_detail}>
                                    {
                                        <RichText className='text' nodes={name} />
                                    }
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className={`${indexStyles.list_item_iconnext}`} onClick={this.deleteCardProperty}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe63f;</Text>
                    </View>

                </View>

                {
                    dec_files && dec_files.map((item, key) => {
                        const { id, file_resource_id, board_id, file_id, } = item
                        return (
                            <View key={key} className={indexStyles.song_tasks_file}>
                                <View className={`${indexStyles.list_item_file_iconnext}`}>
                                    <Text className={`${globalStyle.global_iconfont}`}>&#xe669;</Text>
                                </View>
                                <View className={indexStyles.song_tasks_file_name} onClick={() => this.fileOption(id, file_resource_id, board_id, name, file_id)}>{item.name}</View>
                            </View>
                        )
                    })
                }


                <AtActionSheet isOpened={this.state.song_task_isOpen} cancelText='取消' onCancel={this.handleCancel} onClose={this.handleClose}>
                    <AtActionSheetItem onClick={this.uploadDescribeTasksFile}>
                        上传说明文件
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={this.deleteDescribeTasks}>
                        删除描述
                    </AtActionSheetItem>
                </AtActionSheet>

                <AtActionSheet isOpened={this.state.file_option_isOpen} cancelText='取消' onCancel={this.fileHandleCancel} onClose={this.fileHandleClose}>
                    <AtActionSheetItem onClick={this.previewFile}>
                        预览说明文件
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={this.deleteFile}>
                        删除说明文件
                    </AtActionSheetItem>
                </AtActionSheet>

            </View>
        )
    }
}


