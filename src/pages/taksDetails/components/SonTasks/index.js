import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import iconStyle from '../../../../gloalSet/styles/lxicon.scss'
import { AtActionSheet, AtActionSheetItem } from "taro-ui"
import { connect } from '@tarojs/redux'
import { getOrgIdByBoardId, setBoardIdStorage, judgeJurisdictionProject,timestampToDateTimeLine } from '../../../../utils/basicFunction'
import { AddSonTask } from '../../../../pages/addSonTask'
import { PROJECT_FILES_FILE_DOWNLOAD, PROJECT_FILES_FILE_DELETE } from "../../../../gloalSet/js/constant";
import {UploadWayView} from '../../../../components/tasksRelevant/uploadWayView'
import { filterFileFormatType } from './../../../../utils/util';
import { SonTaskExecutors } from '../../../../pages/sonTaskExecutors';

@connect(({ tasks: { tasksDetailDatas = {},executors_list=[],selectExecutorsList=[], choice_image_temp_file_paths = '' }, }) => ({
    tasksDetailDatas, choice_image_temp_file_paths,executors_list,selectExecutorsList
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
        isAddSonTaskShow: false,
        isUploadWayViewShow:false,
        isSonTaskExecutorsShow:false,
    }
    onClickAddSonTask = isUpdate => {
        this.setState({
            isAddSonTaskShow: false,
            subTaskData:{}
        })
        if(!isUpdate) {
            typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
        }
    }
    /**
     * 新增子任务弹窗
     */
    addSonTask = () => {

        const { boardId, tasksDetailDatas = {}, } = this.props
        const { list_id, card_id } = tasksDetailDatas
        // Taro.navigateTo({
        // // url: `../../pages/addSonTask/index?propertyId=${card_id}&boardId=${boardId}&listId=${card_id}&cardId=${card_id}`
        // })
        this.setState({
            isAddSonTaskShow: true,
            subTaskData:null
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

    /**
     * 展示上传选择方式
     */
    showUploadWayView = (cardId,cartName,key) => {
        this.setState({
            isUploadWayViewShow: true,
            cartName:cartName,
            song_task_id: cardId,
            key:key
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
    /**
     * 关闭上传选择方式
     */
    hideUploadWayView() {
        this.setState({
            isUploadWayViewShow: false,
        })
        // onLoadTasksDetail
    }
    /**
     * 上传文件
     */
    uploadFile = () => {
        const { uploadAuth } = this.props;
        if (uploadAuth) {
            this.setSongTaskIsOpen()
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

    /**
     * 删除子任务
     */
    deleteSongTasks = () => {

        const { dispatch, tasksDetailDatas = {}, deleteAuth } = this.props
        const { card_id } = tasksDetailDatas
        const { song_task_id } = this.state
        var that = this;
        this.setState({
            song_task_isOpen: false
        })
        if (deleteAuth) {
            Taro.showActionSheet({
                itemList: ['确定删除'],
                success: function (res) {
                    if (res.tapIndex == 0) {
                        dispatch({
                            type: 'tasks/deleteCard',
                            payload: {
                                id: song_task_id,
                                card_id: card_id,
                                callBack: that.deleteCard(song_task_id),
                            }
                        })
                        that.setSongTaskIsOpen()
                    }
                },
                fail: function (res) {
                }
            })

        } else {
            Taro.showToast({
                title: '您没有删除此项目的权限',
                icon: 'none',
                duration: 2000
            })
        }
    }

    // 删除本地的子任务数据
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


    fileOption = (id, file_resource_id, board_id, fileName, card_id, file_id, create_by, create_time) => {
        this.setState({
            file_option_isOpen: true,
            file_id: file_id,
            fileId: id,
            file_resource_id: file_resource_id,
            board_id: board_id,
            fileName: fileName,
            cardId: card_id,
            create_by: create_by,
            create_time: create_time
        })
    }

    /**
     * 预览文件
     * @param {*} e 
     */
    previewFile = (e) => {
        const { dispatch, tasksDetailDatas = {} ,child_data = [],fileInterViewAuth} = this.props
        const account_info = JSON.parse(Taro.getStorageSync('account_info'));
        const {board_id,card_id} = tasksDetailDatas //board_id,
        var arr = e.currentTarget.id.split("_");
        var item = child_data[arr[0]]["deliverables"][arr[1]]
        if (fileInterViewAuth) {
           var  fileName = item["name"];
            setBoardIdStorage(board_id)
            const fileType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
            const parameter = {
                board_id,
                ids:item['file_resource_id'],
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
     * @param {*} e 
     */
    deleteFile = (e) => {
        const { dispatch, tasksDetailDatas = {} ,child_data = []} = this.props
        const account_info = JSON.parse(Taro.getStorageSync('account_info'));
        const {board_id,card_id} = tasksDetailDatas
        var arr = e.currentTarget.id.split("_");
        // debugger
        if (account_info.id == arr[2] && (new Date().getTime() - parseInt(arr[3]) * 1000) < 2 * 60 * 1000) {
            dispatch({
                type: 'tasks/deleteCardAttachment',
                payload: {
                    attachment_id: child_data[arr[0]]["deliverables"][arr[1]]['id'],
                    card_id: card_id,
                    // calback: this.deleteCardAttachment(card_id, file_id,),
                }
            })
            typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
            this.setFileOptionIsOpen()
        } else if (judgeJurisdictionProject(board_id, PROJECT_FILES_FILE_DELETE)) {
            dispatch({
                type: 'tasks/deleteCardAttachment',
                payload: {
                    attachment_id: child_data[arr[0]]["deliverables"][arr[1]]['id'],
                    card_id: card_id,
                    // calback: this.deleteCardAttachment(card_id, file_id,),
                }
            })
            
            this.setFileOptionIsOpen()
            typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
        } else {
            Taro.showToast({
                title: '您没有删除附件的权限',
                icon: 'none',
                duration: 2000
            })

        }

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

    /**
     * 删除子任务
     */
    deleteCardProperty = () => {

        const { dispatch, propertyId, cardId, deleteAuth } = this.props
        if (deleteAuth) {
            dispatch({
                type: 'tasks/deleteCardProperty',
                payload: {
                    property_id: propertyId,
                    card_id: cardId,
                    callBack: this.deleteTasksFieldRelation(propertyId),
                },
            })
        } else {
            Taro.showToast({
                title: '您没有该项目的删除权限',
                icon: 'none',
                duration: 2000
            })
        }

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

        })

    }
    /**
     * 无权限提醒
     */
    reminderToast() {
        const { editAuth } = this.props;
        if (!editAuth) {
            Taro.showToast({
                title: '您没有该项目的编辑权限',
                icon: 'none',
                duration: 2000
            })

        }
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
    // 展示负责人弹窗
    showSonTaskExecutors () {
        this.setState({
            isSonTaskExecutorsShow:true
        })
    }
    /**
     * 子任务选择负责人
     */
    onClickSonTaskExecutors() {
        this.setState({
            isSonTaskExecutorsShow: false
        })
        var users = Taro.getStorageSync('son_tasks_executors')
        var userData = []
        if (users && users != '[]') {
            userData = JSON.parse(users)
        }
        let new_array = []
        const { executors_list = [], } = this.props
        new_array = executors_list.filter(item => {
            const gold_code = (userData.find(n => {
                if (item.id == n) {
                    return n
                }
            }) || {})
            if (item.id == gold_code) {
                return item
            }
        })
        this.setState({
            isSonTaskExecutorsShow: false
        })
        const { dispatch } = this.props
        const {subTaskData} = this.state
        if(subTaskData) {
            this.updateSubTask(new_array)
            
        }
        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                selectExecutorsList: new_array,
            }
        })

    }

    /**
     * 修改子任务负责人
     */

    updateSubTask(new_array) {
        const {subTaskData,song_task_id} = this.state;
        const {dispatch} = this.props
        var newCheckedList = new_array.map(item => {
            return item.id;
        })
        var checkedList = subTaskData.executors.map(item=>{
            return item.user_id;
        })
        const handelarr = newCheckedList.concat(checkedList).filter(function(v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v);     
        });
        handelarr.forEach(item => {
            if(checkedList.indexOf(item) != -1) {
                // 删除
                dispatch({
                    type: 'tasks/deleteCardExecutor',
                    payload: {
                        card_id: subTaskData.card_id,
                        executor: item,
                    },
                })
            } else {
                // 增加
                dispatch({
                    type: 'tasks/addCardExecutor',
                    payload: {
                        card_id: subTaskData.card_id,
                        executor: item,
                    },
                })
            }
        })
    }
    

    editSubTask = () => {
        const {key} = this.state;
        const {child_data = []} = this.props
        console.log(child_data[key])
        this.setState({
            isAddSonTaskShow:true,
            isUploadWayViewShow:false,
            subTaskData:child_data[key]
        })
    }
    render() {
        const { child_data = [],  tasksDetailDatas = {}, editAuth ,boardId,selectExecutorsList=[],currentSubTaskId} = this.props
        const { list_id, card_id } = tasksDetailDatas
        const { isAddSonTaskShow,isUploadWayViewShow,cartName,isSonTaskExecutorsShow,subTaskData } = this.state
        var now = Date.parse(new Date()) / 1000;

        return (
            <View className={indexStyles.list_item}>

                <View className={indexStyles.title_row}>
                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe867;</Text>
                    </View>
                    <View className={indexStyles.list_item_name}>子任务</View>
                    <View className={`${indexStyles.list_item_rigth_iconnext}`} onClick={this.deleteCardProperty}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe8b2;</Text>
                    </View>
                </View>

                <View className={indexStyles.song_task_centent}>
                    {
                        child_data && child_data.map((value, key) => {
                            const { card_name, deliverables = [], is_realize,card_id,due_time,start_time,time_warning } = value
                            var is_warning = time_warning && (now > (due_time - 86400000 * time_warning) || now == (due_time - 86400000 * time_warning)) ? true : false;
                            var is_overdue = due_time && now > due_time && is_realize == '0'
                            return (
                                <View key={key} className={`${indexStyles.content}`}>
                                    <View className={`${indexStyles.song_row_instyle} ${currentSubTaskId == card_id ? indexStyles.currentSubTask_content:''} `} >
                                        <View className={indexStyles.song_row_left_instyle}>
                                            {
                                                is_realize == '0' ? (<View className={`${indexStyles.list_item_select_iconnext}`} onClick={() => this.tasksRealizeStatus(card_id, is_realize)}>
                                                    <Text className={`${globalStyle.global_iconfont}`}>&#xe6df;</Text>
                                                </View>) : (<View className={`${indexStyles.list_item_select_iconnext}`} onClick={() => this.tasksRealizeStatus(card_id, is_realize)}>
                                                    <Text className={`${globalStyle.global_iconfont}`}>&#xe844;</Text>
                                                </View>)
                                            }

                                            {/* <View className={indexStyles.song_task_name}>{card_name}</View> */}
                                            <View onClick={this.reminderToast}>
                                                <Input
                                                    className={indexStyles.song_task_name}
                                                    value={card_name}
                                                    confirmType='完成'
                                                    onBlur={this.updataInput.bind(this, card_id)}
                                                    disabled={!editAuth}
                                                >
                                                </Input>
                                            </View>
                                        </View>
                                        {/* tasksOption */}
                                        <View className={`${indexStyles.list_item_rigth_iconnext}`} onClick={() => this.showUploadWayView(card_id,card_name,key)}>
                                         {
                                             is_overdue && <Text className={`${indexStyles.list_item_status} ${indexStyles.list_item_status_overdue}`}>逾期</Text>              
                                         }
                                         {
                                             is_warning &&  <Text className={`${indexStyles.list_item_status} ${indexStyles.list_item_status_warning}`}>预警</Text>          
                                         }
                                            <Text className={`${globalStyle.global_iconfont}`}>&#xe63f;</Text>
                                        </View>
                                    </View>

                                    {
                                        deliverables.map((item, key1) => {
                                            const { id, name, file_resource_id, board_id, file_id, create_by, create_time } = item
                                            var time = timestampToDateTimeLine(create_time,'YMDHM');
                                            const fileType = filterFileFormatType(name);

                                            return (
                                                <View className={indexStyles.song_tasks_file} key={key}>
                                                    {/* <View className={`${indexStyles.list_item_file_iconnext}`}>
                                                        <Text className={`${globalStyle.global_iconfont}`}>&#xe669;</Text>
                                                    </View>
                                                    <View className={indexStyles.song_tasks_file_name} onClick={() => this.fileOption(id, file_resource_id, board_id, name, item.card_id, file_id, create_by, create_time)}>{name}</View> */}
                                                     <View>
                                                     <View  className={indexStyles.song_tasks_file}>
                                                        <View className={`${indexStyles.list_item_file_iconnext} ${indexStyles.list_item_file_mold_iconnext}`}>
                                                            {/* <Text className={`${globalStyle.global_iconfont}`}>
                                                                &#xe669;
                                                            </Text> */}
                                                            <View className={`${iconStyle.lxTaskicon}`} style={{'background': fileType}}></View>

                                                            {/* <RichText className={`${globalStyle.global_iconfont}`} nodes={fileType} /> */}

                                                        </View>
                                                        <View className={indexStyles.list_item_file_center} id={key+'_'+key1+'_'+create_by+'_'+create_time} onClick={(e)=>this.previewFile(e,file_resource_id, board_id, name)}>
                                                            <Text className={indexStyles.list_item_file_name}>{name}</Text>
                                                            <View className={indexStyles.list_item_file_center_timeView}>
                                                                {/* <Image  className={indexStyles.list_item_file_center_photo}></Image> */}
                                                                <View className={indexStyles.list_item_file_center_time}>{time}</View>
                                                            </View>
                                                        </View>
                                                        <View className={indexStyles.list_item_file_iconnext}  id={key+'_'+key1+'_'+create_by+'_'+create_time} onClick={(e)=>this.deleteFile(e)}>
                                                            <Text className={`${globalStyle.global_iconfont}`}>
                                                                &#xe84a;
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View className={indexStyles.lineView}></View>
                                                    </View>
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
                    {/* <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7b7;</Text>
                    </View> */}
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
                    isAddSonTaskShow   ? (<AddSonTask subTaskData={subTaskData} propertyId={card_id}  showSonTaskExecutors={()=>this.showSonTaskExecutors()}   boardId={boardId} listId={card_id} cardId={card_id} onClickAction={(isUpdate)=>this.onClickAddSonTask(isUpdate)}></AddSonTask>) : (null)
                }
                {
                    isUploadWayViewShow ? (<UploadWayView title={cartName}  editSubTask={()=>this.editSubTask()} mold='subTask' uploadFile={()=>this.uploadFile()} deleteAction={()=>this.deleteSongTasks()} onClickAction={()=>this.hideUploadWayView()} uploadWXFile={()=>this.fileUploadMessageFile()}></UploadWayView>):('')
                }
                {isSonTaskExecutorsShow ? (<SonTaskExecutors  contentId={card_id} onClickAction={this.onClickSonTaskExecutors} executors={selectExecutorsList}></SonTaskExecutors>) : (null)}

            </View>
        )
    }
}
