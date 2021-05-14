import Taro, { Component } from '@tarojs/taro'
import { View, Text, RichText, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtActionSheet, AtActionSheetItem } from "taro-ui"
import { connect } from '@tarojs/redux'
import { getOrgIdByBoardId, setBoardIdStorage, judgeJurisdictionProject,timestampToDateTimeLine } from '../../../../utils/basicFunction'
import { PROJECT_FILES_FILE_DOWNLOAD, PROJECT_FILES_FILE_DELETE } from "../../../../gloalSet/js/constant";
import {UploadWayView} from '../../../../components/tasksRelevant/uploadWayView'
import { filterFileFormatType } from './../../../../utils/util';
import iconStyle from '../../../../gloalSet/styles/lxicon.scss'

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
        isUploadWayViewShow:false
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
    /**
     * 展示上传选择方式
     */
     showUploadWayView = () => {
         const {uploadAuth} = this.props
        if (!uploadAuth) {
            Taro.showToast({
                title: '您没有上传附件的权限',
                icon: 'none',
                duration: 2000
            })
            return;
        } 
        this.setState({
            isUploadWayViewShow: true,
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
    /**
     * 关闭上传选择方式
     */
    hideUploadWayView() {
        this.setState({
            isUploadWayViewShow: false,
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
// 上传微信聊天文件
fileUploadMessageFile = () => {
    var that = this;
    const { uploadAuth } = this.props;
    if (!uploadAuth) {
        Taro.showToast({
            title: '您没有上传附件的权限',
            icon: 'none',
            duration: 2000
        })
        return;
    } 
    Taro.chooseMessageFile({
        count: 10,
        type: 'all',
        success: function (res) {
            // tempFilePath可以作为img标签的src属性显示图片
            // const tempFilePaths = res.tempFilePaths
            var tempFilePaths = res.tempFiles.map(function (item, index, input) {
                return item.path;
            })
            that.setFileOptionIsOpen()
            that.uploadChoiceFolder();
            that.saveChoiceImageTempFilePaths(tempFilePaths)
        }
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
        dispatch({
            type: 'tasks/deleteCardProperty',
            payload: {
                property_id: propertyId,
                card_id: cardId,
                callBack: this.deleteTasksFieldRelation(propertyId),
            },
        })

        this.setDescribeTasksIsOpen()

    }

    fileOption = (id, file_resource_id, board_id, fileName, file_id, create_by, create_time) => {

        this.setState({
            file_option_isOpen: true,
            file_id: id,

            file_resource_id: file_resource_id,
            board_id: board_id,
            fileName: fileName,
            file_item_id: file_id,
            create_by: create_by,
            create_time: create_time
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
    /**
     * 预览文件
     */
    previewFile = (file_resource_id, board_id, fileName) => {
        const { dispatch ,fileInterViewAuth} = this.props
        if (fileInterViewAuth) {

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
    } else {
        Taro.showToast({
            title: '您没有预览此文件的权限',
            icon: 'none',
            duration: 2000
        })
    }
    }

    /**
     * 删除文件
     */
    deleteFile = (id,file_id,create_by,create_time) => {
        const { dispatch, cardId,tasksDetailDatas={} } = this.props
        const {board_id} = tasksDetailDatas
        const account_info = JSON.parse(Taro.getStorageSync('account_info'));
        // if (account_info.id == create_by && (new Date().getTime() - parseInt(create_time) *
        //     1000) < 2 * 60 * 1000) {
        //     dispatch({
        //         type: 'tasks/deleteCardAttachment',
        //         payload: {
        //             attachment_id: file_id,
        //             card_id: cardId,
        //             code: "REMARK",
        //             calback: this.deleteCardAttachment(cardId, file_id),
        //         }
        //     })
        //     typeof this.props.onClickAction == "function" &&
        //     this.props.onClickAction();
        //     // this.setFileOptionIsOpen()
        // } else if (!judgeJurisdictionProject(board_id, PROJECT_FILES_FILE_DELETE)) {
            dispatch({
                type: 'tasks/deleteCardAttachment',
                payload: {
                    attachment_id: id,
                    card_id: cardId,
                    code: "REMARK",
                    calback: this.deleteCardAttachment(cardId, file_id),
                }
            })
            typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
            // this.setFileOptionIsOpen()
        // } else {
        //     Taro.showToast({
        //         title: '您没有删除该文件的权限',
        //         icon: 'none',
        //         duration: 2000
        //     })
        // }

    }

    /**
     * 删除文件的回调
     * @param {} cardId 
     * @param {*} file_item_id 
     */
    deleteCardAttachment = (cardId, file_item_id) => {
        typeof this.props.onClickAction == "function" &&
        this.props.onClickAction();
        // const { dispatch, tasksDetailDatas, } = this.props
        // const { dec_files = [] } = tasksDetailDatas
        // let array = [];
        // dec_files.forEach(item => {
        //     if (item['file_id'] !== file_item_id) {
        //         array.push(item)
        //     }
        // })
        // dispatch({
        //     type: 'tasks/updateDatas',
        //     payload: {
        //         tasksDetailDatas: {
        //             ...tasksDetailDatas,
        //             ...{ dec_files: array },
        //         }
        //     }
        // })
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
    /**
     * 添加任务说明备注
     */
    addDesribeTaskText () {
        Taro.navigateTo({
            url:'/pages/taksDetails/components/AddDesribeTaskText/index?markText=' + this.props.name
        })
    }
    render() {
        const { tasksDetailDatas = {}, } = this.props
        const { dec_files = [] } = tasksDetailDatas
        var name = this.props.name || ''
        if(name.length > 0) {
            name=name.replace("</p>","");
            name=name.replace("<p>","");
        }
        const {isUploadWayViewShow} = this.state;
        const cartName = '任务说明'
        return (

            <View className={indexStyles.wapper}>

                {/* <View className={indexStyles.list_item} onClick={this.gotoChangeChoiceInfoPage.bind(this,)}> */}
                <View className={indexStyles.list_item}>
                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe86c;</Text>
                    </View>
                    <View className={indexStyles.list_item_name}>任务说明</View>
                    <View className={indexStyles.right_style}>
                    </View>

                    <View className={`${indexStyles.list_item_iconnext} ${indexStyles.addDesribeTaskText}`} onClick={this.addDesribeTaskText}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe8b6;</Text>
                    </View>
                    <View className={`${indexStyles.list_item_iconnext}`} onClick={this.deleteDescribeTasks}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe8b2;</Text>
                    </View>

                </View>
            
                {
                    dec_files && dec_files.map((item, key) => {
                        const { id, file_resource_id, board_id, file_id, create_by, create_time,name } = item
                        var time = timestampToDateTimeLine(create_time,'YMDHM');
                        const fileType = filterFileFormatType(name);

                        return (
                            <View>
                                <View key={key} className={indexStyles.song_tasks_file}>
                                    <View className={`${indexStyles.list_item_file_iconnext} ${indexStyles.list_item_file_mold_iconnext}`}>
                                        <View className={`${iconStyle.lxTaskicon}`} style={{'background': fileType}}></View>

                                    </View>
                                    <View className={indexStyles.list_item_file_center} onClick={()=>this.previewFile(file_resource_id, board_id, name)}>
                                        <Text className={indexStyles.list_item_file_name}>{item.name}</Text>
                                        <View className={indexStyles.list_item_file_center_timeView}>
                                            {/* <Image  className={indexStyles.list_item_file_center_photo}></Image> */}
                                            <View className={indexStyles.list_item_file_center_time}>{time}</View>
                                        </View>
                                    </View>
                                    <View className={indexStyles.list_item_file_iconnext} onClick={()=>this.deleteFile(id,file_id,create_by,create_time)}>
                                        <Text className={`${globalStyle.global_iconfont}`}>
                                        &#xe84a;
                                        </Text>
                                    </View>
                                    {/* <View className={indexStyles.song_tasks_file_name} onClick={() => this.fileOption(id, file_resource_id, board_id, name, file_id, create_by, create_time)}>{item.name}</View> */}
                                </View>
                                <View className={indexStyles.lineView}></View>
                            </View>
                        )
                    })
                }
                {
                    name && name.length > 0 &&  
                        <View className={indexStyles.desText_View}>
                            <View className={indexStyles.desText_View_subTitle}>备注:</View>    
                            <View className={indexStyles.right_centre_style} onClick={this.addDesribeTaskText}>
                                <View>
                                    <View className={indexStyles.desText_View_detail}>
                                        {
                                            // <Text  className='text' nodes={name} />
                                            <Text>{name}</Text>
                                        }
                                        
                                    </View>
                                </View>
                            </View>
                        </View>
                }
               
                <View className={indexStyles.add_task_row} onClick={()=>this.showUploadWayView()}>
                    <View className={indexStyles.add_item_name}>{dec_files && dec_files.length > 0 ? '继续上传':'上传文件'}</View>
                </View>
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
                {
                    isUploadWayViewShow ? (<UploadWayView title={cartName}  mold='describeTasks' uploadFile={()=>this.uploadDescribeTasksFile()} deleteAction={()=>this.deleteDescribeTasks()} onClickAction={()=>this.hideUploadWayView()} uploadWXFile={()=>this.fileUploadMessageFile()}></UploadWayView>):('')
                }
            </View>
        )
    }
}


