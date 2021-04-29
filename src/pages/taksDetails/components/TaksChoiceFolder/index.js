
import Taro, { Component, getApp } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import TreeFile from './../../../file/components/boardFile/TreeFile'
import { setRequestHeaderBaseInfo, } from '../../../../utils/basicFunction'
import { BASE_URL, API_BOARD } from "../../../../gloalSet/js/constant";

@connect(({
    file: {
        isShowChoiceFolder,
        upload_folder_name,
        choice_board_folder_id,
        choice_board_id,
        current_selection_board_id,
    },
    board: { v2_board_list, },
    tasks: {
        choice_image_temp_file_paths,
        song_task_id,
        tasks_upload_file_type,
    }
}) => ({
    isShowChoiceFolder,
    v2_board_list,
    upload_folder_name,
    choice_board_folder_id,
    choice_board_id,
    current_selection_board_id,
    choice_image_temp_file_paths,
    song_task_id,
    tasks_upload_file_type,
}))
export default class index extends Component {

    //选择当前项目的根目录
    selectionBoardRootDirectory = (value, org_id) => {
        const { board_id, board_name } = value
        const { dispatch, choice_board_id } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                choice_board_folder_id: '',
            },
        })
        if (board_id && choice_board_id === board_id) {
            dispatch({
                type: 'file/updateDatas',
                payload: {
                    choice_board_id: '',
                    current_selection_board_id: ''
                },
            })
        } else {
            //记录选中的那一行的board_id
            dispatch({
                type: 'file/updateDatas',
                payload: {
                    choice_board_id: board_id,
                    upload_folder_name: board_name,
                    current_selection_board_id: board_id,
                },
            })
        }
    }


    handleCancel = () => {
        this.hideChoiceFolder()
        this.resetCurrentSelection()
    }

    handleConfirm = () => {

        const { tasks_upload_file_type, } = this.props

        if (tasks_upload_file_type === 'describeTasks') {
            this.describeTasksUploadFile()
        } else if (tasks_upload_file_type === 'sonTask') {
            this.fileUpload()
        }


        this.hideChoiceFolder()
        this.resetCurrentSelection()
    }

    //上传子任务文件
    fileUpload = () => {

        const { choice_image_temp_file_paths, board_id, choice_board_folder_id, song_task_id, } = this.props
        //上传
        let that = this;
        const authorization = Taro.getStorageSync('access_token')
        const data = {
            board_id: board_id,
            folder_id: choice_board_folder_id,
            type: 1,
            upload_type: 1,
        }
        const base_info = setRequestHeaderBaseInfo({ data, headers: authorization })
        // let num = 1;
        Taro.showToast({ icon: "loading", title: `正在上传...` });
        // 统一上传
        let promise = [];
        //开发者服务器访问接口，微信服务器通过这个接口上传文件到开发者服务器
        for (var i = 0; i < choice_image_temp_file_paths.length; i++) {
            this.addSendPromise(choice_image_temp_file_paths[i], data, authorization, base_info, board_id, choice_board_folder_id, song_task_id,)
            // )
        }

        Promise.all(promise).then(res => {
            // 重新掉列表接口, 刷新列表
            Taro.showToast({
                icon: "success",
                title: "上传完成"
            })
            debugger
            typeof this.props.onClickAction == 'function' && this.props.onClickAction();

        }).catch(err => {
            console.log(err)
            Taro.showModal({ title: '提示', content: "上传失败,请重试", showCancel: false });
        })

    }

    addSendPromise = (filePath, data, authorization, base_info, board_id, choice_board_folder_id, song_task_id,) => {
        return new Promise((resolve, reject) => {
            Taro.uploadFile({
                url: BASE_URL + API_BOARD + '/v2/card/attachment/upload?'
                    + 'board_id=' + `${board_id}`
                    + '&card_id=' + `${song_task_id}`
                    + '&folder_id=' + `${choice_board_folder_id}`
                    + '&is_limit_access=0', //后端接口
                board_id: board_id,
                card_id: song_task_id,
                folder_id: choice_board_folder_id,
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

    //上传描述任务附件
    describeTasksUploadFile = () => {
        const { choice_image_temp_file_paths, board_id, choice_board_folder_id, song_task_id, } = this.props
        //上传
        let that = this;
        const authorization = Taro.getStorageSync('access_token')
        const data = {
            board_id: board_id,
            folder_id: choice_board_folder_id,
            type: 1,
            upload_type: 1,
        }
        const base_info = setRequestHeaderBaseInfo({ data, headers: authorization })
        // let num = 1;
        Taro.showToast({ icon: "loading", title: `正在上传...` });
        // 统一上传
        let promise = [];
        //开发者服务器访问接口，微信服务器通过这个接口上传文件到开发者服务器
        for (var i = 0; i < choice_image_temp_file_paths.length; i++) {
            promise.push(this.describeTasksAddSendPromise(choice_image_temp_file_paths[i], data, authorization, base_info, board_id, choice_board_folder_id, song_task_id,))
        }

        Promise.all(promise).then(res => {
            //重新掉列表接口, 刷新列表
            Taro.showToast({
                icon: "success",
                title: "上传完成"
            })

            typeof this.props.onClickAction == 'function' && this.props.onClickAction();

        }).catch(err => {
            console.log(err)
            Taro.showModal({ title: '提示', content: "上传失败,请重试", showCancel: false });
        })
    }

    describeTasksAddSendPromise = (filePath, data, authorization, base_info, board_id, choice_board_folder_id, song_task_id,) => {
        return new Promise((resolve, reject) => {
            //Request URL: http://test.lingxi.new-di.com/api/projects/card/desc/attachment/upload?board_id=1248250769312976896&card_id=1305760586717597696&folder_id=1248250769321365508

            Taro.uploadFile({
                url: BASE_URL + API_BOARD + '/card/desc/attachment/upload?'
                    + 'board_id=' + `${board_id}`
                    + '&card_id=' + `${song_task_id}`
                    + '&folder_id=' + `${choice_board_folder_id}`, //后端接口
                board_id: board_id,
                card_id: song_task_id,
                folder_id: choice_board_folder_id,
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


    hideChoiceFolder = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                isShowChoiceFolder: false,
            },
        })

        // 清除缓存文件
        Taro.getSavedFileList({
            success(res) {
                for (let i = 0; i < res.fileList.length; i++) {
                    Taro.removeSavedFile({
                        filePath: res.fileList[i].filePath,
                        complete(res) {
                            // console.log('清除成功', res)
                        }
                    })
                }
            }
        })
    }

    //下次进入选中状态重置
    resetCurrentSelection = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'file/updateDatas',
            payload: {
                choice_board_folder_id: '',
                choice_board_id: '',
                selected_board_folder_info: {},
                upload_folder_name: '选择文件夹',
                current_board_open: false,
            },
        })
    }

    choiceFolder = () => {

        this.loadBoardList()
    }

    render() {

        const { folder_tree = {}, upload_folder_name, choice_board_folder_id, choice_board_id, board_id, org_id, } = this.props
        const { child_data = [], } = folder_tree

        const SystemInfo = Taro.getSystemInfoSync()
        const { windowHeight } = SystemInfo
        const scrollHeight = (windowHeight - (80 * 2) - 47 - 18 - 56 - 10) + 'px'

        return (

            <View className={indexStyles.choice_folder_modal_mask} >
                <View className={indexStyles.choice_folder_modal_view_style} style={{
                    position: 'absolute',
                    top: 80 + 'px',
                    right: 32 + 'px',
                    left: 32 + 'px',
                    bottom: 80 + 'px',
                }}>
                    <View className={indexStyles.choice_board_view_style}>
                        <View className={indexStyles.modal_content_top_style} style={{ height: 56 + 'px' }}>
                            <View className={indexStyles.folder_name_style}>{upload_folder_name}</View>
                        </View>
                        <ScrollView
                            scrollY
                            scrollWithAnimation
                            className={indexStyles.board_list_view_style} style={{ height: scrollHeight }}>

                            {child_data && child_data.length > 0 ?
                                <View className={indexStyles.folder_tree_view}>
                                    <TreeFile folderTree={child_data}
                                        boardId={board_id} orgId={org_id}
                                    // boardName={item.board_name} 
                                    />
                                </View> : ''
                            }

                        </ScrollView>
                    </View>


                    <View className={indexStyles.modal_botton_style} style={{ height: 47 + 'px', lineHeight: 47 + 'px' }}>
                        <View className={indexStyles.cancel_button_style} onClick={this.handleCancel}>取消</View>
                        {
                            choice_board_id != '' || choice_board_folder_id != '' ? (
                                <View className={indexStyles.confirm_button_style} onClick={this.handleConfirm}>上传</View>
                            ) : (
                                <View className={indexStyles.un_confirm_button_style}>上传</View>
                            )
                        }
                    </View>
                </View>
            </View>
        )
    }
}

index.defaultProps = {

}
