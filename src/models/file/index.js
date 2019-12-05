import Taro from '@tarojs/taro'
import { getFilePage, getFileDetails, getFolder, getDownloadUrl, uploadFile, sendFileComment } from '../../services/file/index'
import { isApiResponseOk } from "../../utils/request";

export default {
    namespace: 'file',
    state: {
        file_list: [], //文件略缩图信息
        isShowBoardList: false,  //是否显示项目列表
        folder_tree: [],  //文件数据列表
        header_folder_name: '全部文件',  //当前选中的文件夹名称
        isShowFileComment: false,  //chat页面是否显示文件评论
        isShowChoiceFolder: false, //是否显示上传文件选择文件夹modal

        selected_board_folder_info: {}, //选择的哪一个文件夹的信息(包含org_id, board_id, folder_id), 使用model跨多个组件传值
        upload_folder_name: '选择文件夹', //要上传的文件夹的名称
        selected_board_folder_id: '',  //选中的那一个的文件夹id
        choice_board_id: '', //当前被选中项目根目录的项目id
    },
    effects: {
        //全部文件信息
        * getFilePage({ payload }, { select, call, put }) {
            const res = yield call(getFilePage, payload)
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'updateDatas',
                    payload: {
                        file_list: res.data
                    }
                })
            } else {
                Taro.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        },

        //下载文件
        * getDownloadUrl({ payload }, { select, call, put }) {
            const { parameter, fileType } = payload
            Taro.showLoading({
                title: '加载中...',
            })
            const res = yield call(getDownloadUrl, parameter)
            var index = fileType.lastIndexOf(".");
            const file_type = fileType.substring(index + 1, fileType.length)
            const img_type_arr = ['bmp', 'jpg', 'jpeg', 'png', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp']  //文件格式
            if (isApiResponseOk(res)) {
                if (img_type_arr.indexOf(file_type) != -1) {  //打开图片
                    Taro.previewImage({
                        current: res.data[0],
                        urls: res.data
                    })
                    Taro.hideLoading()
                } else {
                    //通过web-view 中打开 url查看文档类文件详情
                    // Taro.setStorageSync('file_url_address', res.data.url)
                    // Taro.navigateTo({
                    //     url: `../../pages/webView/index`
                    // })
                    Taro.downloadFile({
                        url: res.data[0],
                        success: function (res) {
                            var filePath = res.tempFilePath
                            //console.log('filePath', filePath)
                            Taro.saveFile({
                                tempFilePath: filePath,
                                success: function (res) {
                                    //console.log("saveFile=====ssss", res.savedFilePath, file_type)
                                    Taro.openDocument({
                                        filePath: res.savedFilePath,
                                        fileType: file_type,  //指定文件类型 file_type
                                        success: function (res) {
                                            //console.log("打开文档成功", res)
                                        },
                                        fail: function (res) {
                                            Taro.showToast({
                                                title: '文件过大或不支持该格式',
                                                icon: 'none',
                                                duration: 2000
                                            })
                                            // console.log("fail", res);
                                        },
                                        complete: function (res) {
                                            Taro.hideLoading()
                                            //console.log("complete", res);
                                        }
                                    })
                                },
                                fail: function (res) {
                                    Taro.hideLoading()
                                    Taro.showToast({
                                        title: '文件过大或不支持该格式',
                                        icon: 'none',
                                        duration: 2000
                                    })
                                    //console.log("saveFile", res);
                                },
                                complete: function (res) {
                                    // console.log("saveFile", res);
                                }
                            })

                        },
                        fail: function (res) {
                            Taro.hideLoading()
                            Taro.showToast({
                                title: '文件过大或不支持该格式',
                                icon: 'none',
                                duration: 2000
                            })
                            console.log('fail', res)
                        },
                        complete: function (res) {
                            console.log('complete', res)
                        }
                    })
                }
            } else {
                Taro.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        },
        //文件详情
        * getFileDetails({ payload }, { select, call, put }) {
            const { parameter, fileType } = payload
            const res = yield call(getFileDetails, parameter)

            var index = fileType.lastIndexOf(".");
            const file_type = fileType.substring(index + 1, fileType.length);

        },

        //文件夹树形列表
        * getFolder({ payload }, { select, call, put }) {
            const res = yield call(getFolder, payload)

            if (isApiResponseOk(res)) {
                yield put({
                    type: 'updateDatas',
                    payload: {
                        folder_tree: res.data
                    }
                })
            } else {
                Taro.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        },

        //上传文件
        * uploadFile({ payload }, { select, call, put }) {
            Taro.showLoading({
                title: '上传中...',
            })
            const res = yield call(uploadFile, payload)
            if (isApiResponseOk(res)) {
                //  yield put({
                //     type: 'getFilePage',
                //     payload: {


                //     }
                //   })
            } else {
                Taro.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
            Taro.hideLoading()
        },

        //发送(新增)文件评论
        * sendFileComment({ payload }, { select, call, put }) {
            const res = yield call(sendFileComment, payload)
            if (isApiResponseOk(res)) {

            } else {
                Taro.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        }

    },

    reducers: {
        updateDatas(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};
