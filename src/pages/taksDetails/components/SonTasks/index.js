import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtActionSheet, AtActionSheetItem } from "taro-ui"
import { connect } from '@tarojs/redux'
import { getOrgIdByBoardId, setBoardIdStorage } from '../../../../utils/basicFunction'
import { AddSonTask } from '../../../../pages/addSonTask'

@connect(({ tasks: { tasksDetailDatas = {}, choice_image_temp_file_paths = '' }, }) => ({
    tasksDetailDatas, choice_image_temp_file_paths,
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
        cardId: '',
        fileId: '',
        isAddSonTaskShow: false
    }
    onClickAddSonTask() {
        this.setState({
            isAddSonTaskShow: false
        })
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }
    addSonTask = () => {

        const { boardId, tasksDetailDatas = {}, } = this.props
        const { list_id, card_id } = tasksDetailDatas

        // Taro.navigateTo({
        // // url: `../../pages/addSonTask/index?propertyId=${card_id}&boardId=${boardId}&listId=${card_id}&cardId=${card_id}`
        // })
        this.setState({
            isAddSonTaskShow: true
        })
    }

    tasksRealizeStatus = (cardId, isRealize) => {

        const cellInfo = {
            cardId: cardId,
            isRealize: isRealize,
        }
        typeof this.props.onTasksDetailsRealizeStatus == 'function' && this.props.onTasksDetailsRealizeStatus(cellInfo)
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

        const { dispatch } = this.props
        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                song_task_id: cardId,
                tasks_upload_file_type: 'sonTask'
            }
        })
    }

    uploadFile = () => {
        this.setSongTaskIsOpen()
        this.getAuthSetting()
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
                                                success: (resData) => {
                                                    // console.log('授权成功:', resData);
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

    deleteSongTasks = () => {

        const { dispatch, tasksDetailDatas = {} } = this.props
        const { card_id } = tasksDetailDatas
        const { song_task_id } = this.state

        dispatch({
            type: 'tasks/deleteCard',
            payload: {
                id: song_task_id,
                card_id: card_id,
                callBack: this.deleteCard(song_task_id),
            }
        })

        this.setSongTaskIsOpen()
    }


    deleteCard = (song_task_id) => {

        const { dispatch, tasksDetailDatas, child_data } = this.props
        const { properties = [] } = tasksDetailDatas


        child_data.forEach(obj => {

            if (obj.card_id === song_task_id) {

                this.removeObjWithArr(child_data, obj);
            }
        })

        properties.forEach(item => {
            if (item['code'] === 'SUBTASK') {
                item.data = child_data;
            }
        })

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...properties
                }
            }
        })
    }


    fileOption = (id, file_resource_id, board_id, fileName, card_id, file_id,) => {

        this.setState({
            file_option_isOpen: true,
            file_id: file_id,
            fileId: id,
            file_resource_id: file_resource_id,
            board_id: board_id,
            fileName: fileName,
            cardId: card_id,
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
        const { file_id, cardId, fileId, } = this.state
        dispatch({
            type: 'tasks/deleteCardAttachment',
            payload: {
                attachment_id: fileId,
                card_id: card_id,
                calback: this.deleteCardAttachment(cardId, file_id,),
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

    deleteCardAttachment = (cardId, file_id) => {

        const { dispatch, tasksDetailDatas, child_data } = this.props
        const { properties = [] } = tasksDetailDatas


        child_data.forEach(obj => {

            if (obj.card_id === cardId) {

                obj.deliverables.forEach(item => {

                    if (item.file_id === file_id) {

                        this.removeObjWithArr(obj.deliverables, item);
                    }
                })
            }
        })

        properties.forEach(item => {
            if (item['code'] === 'SUBTASK') {
                item.data = child_data;
            }
        })

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...properties
                }
            }
        })
    }

    //传入的数组arr和需删除的对象obj
    removeObjWithArr(_arr, _obj) {
        var length = _arr.length;
        for (var i = 0; i < length; i++) {
            if (this.isObjectValueEqual(_arr[i], _obj)) {
                if (i == 0) {
                    _arr.shift(); //删除并返回数组的第一个元素
                    return;
                }
                else if (i == length - 1) {
                    _arr.pop();  //删除并返回数组的最后一个元素
                    return;
                }
                else {
                    _arr.splice(i, 1); //删除下标为i的元素
                    return;
                }
            }
        }
    };

    isObjectValueEqual = (a, b) => {
        if (typeof (a) != "object" && typeof (b) != "object") {
            if (a == b) {
                return true;
            } else {
                return false;
            }
        }
        var aProps = Object.getOwnPropertyNames(a);
        var bProps = Object.getOwnPropertyNames(b);

        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            if (a[propName] !== b[propName]) {
                return false;
            }
        }

        return true;
    }


    deleteCardProperty = () => {

        const { dispatch, propertyId, cardId } = this.props

        dispatch({
            type: 'tasks/deleteCardProperty',
            payload: {
                property_id: propertyId,
                card_id: cardId,
                callBack: this.deleteTasksFieldRelation(propertyId),
            },
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

    updataInput = (cardId, value) => {

        var inputValue = value['detail']["value"]

        const { dispatch, } = this.props

        dispatch({
            type: 'tasks/putCardBaseInfo',
            payload: {
                card_id: cardId,
                name: inputValue,
                calback: this.putCardBaseInfo(value, cardId),
            }

        }).then(res => {
            // if () {
            // }
        })

    }

    putCardBaseInfo = (value, cardId) => {

        const { dispatch, tasksDetailDatas, child_data = [], } = this.props
        const { properties = [], } = tasksDetailDatas

        properties.forEach(element => {

            if (element.code === 'SUBTASK') {

                child_data && child_data.forEach(item => {

                    if (item.id === cardId) {

                        item.name = value
                    }
                })
            }

        });

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...properties,
                }
            }
        })

    }

    render() {
        const { child_data = [], boardId, tasksDetailDatas = {}, } = this.props
        const { list_id, card_id } = tasksDetailDatas

        const { isAddSonTaskShow } = this.state
        return (
            <View className={indexStyles.list_item}>

                <View className={indexStyles.title_row}>
                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7f4;</Text>
                    </View>
                    <View className={indexStyles.list_item_name}>子任务</View>
                    <View className={`${indexStyles.list_item_rigth_iconnext}`} onClick={this.deleteCardProperty}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7fc;</Text>
                    </View>
                </View>

                <View className={indexStyles.song_task_centent}>
                    {
                        child_data && child_data.map((value, key) => {
                            const { card_name, deliverables = [], card_id, is_realize } = value

                            return (
                                <View key={key} className={indexStyles.content}>
                                    <View className={indexStyles.song_row_instyle}>
                                        {
                                            is_realize == '0' ? (<View className={`${indexStyles.list_item_select_iconnext}`} onClick={() => this.tasksRealizeStatus(card_id, is_realize)}>
                                                <Text className={`${globalStyle.global_iconfont}`}>&#xe6df;</Text>
                                            </View>) : (<View className={`${indexStyles.list_item_select_iconnext}`} onClick={() => this.tasksRealizeStatus(card_id, is_realize)}>
                                                <Text className={`${globalStyle.global_iconfont}`}>&#xe844;</Text>
                                            </View>)
                                        }

                                        {/* <View className={indexStyles.song_task_name}>{card_name}</View> */}

                                        <Input
                                            className={indexStyles.song_task_name}
                                            value={card_name}
                                            confirmType='完成'
                                            onBlur={this.updataInput.bind(this, card_id)}
                                        >
                                        </Input>

                                        <View className={`${indexStyles.list_item_rigth_iconnext}`} onClick={() => this.tasksOption(card_id)}>
                                            <Text className={`${globalStyle.global_iconfont}`}>&#xe63f;</Text>
                                        </View>
                                    </View>

                                    {
                                        deliverables.map((item, key1) => {
                                            const { id, name, file_resource_id, board_id, file_id, } = item
                                            return (
                                                <View className={indexStyles.song_tasks_file}>
                                                    <View className={`${indexStyles.list_item_file_iconnext}`}>
                                                        <Text className={`${globalStyle.global_iconfont}`}>&#xe669;</Text>
                                                    </View>
                                                    <View className={indexStyles.song_tasks_file_name} onClick={() => this.fileOption(id, file_resource_id, board_id, name, item.card_id, file_id,)}>{name}</View>
                                                </View>
                                            )
                                        })
                                    }

                                </View>
                            )
                        })
                    }
                </View>

                <View className={indexStyles.add_task_row} onClick={this.addSonTask}>
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
                {
                    isAddSonTaskShow ? (<AddSonTask propertyId={card_id} boardId={boardId} listId={card_id} cardId={card_id} onClickAction={this.onClickAddSonTask}></AddSonTask>) : (null)
                }
            </View>
        )
    }
}
