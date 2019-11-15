import Taro from '@tarojs/taro'
import { getFilePage, getFileDetails, getFolder, getDownloadUrl } from '../../services/file/index'
import { isApiResponseOk } from "../../utils/request";

export default {
    namespace: 'file',
    state: {
        file_list: [], //文件略缩图信息
        isShowBoardList: false,  //是否显示项目列表
        folder_tree: [],  //文件数据列表
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
            Taro.showLoading()
            const res = yield call(getDownloadUrl, parameter)
            var index = fileType.lastIndexOf(".");
            const file_type = fileType.substring(index + 1, fileType.length)
            const img_type_arr = ['bmp', 'jpg', 'jpeg', 'png', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp']
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
                            console.log('filePath', filePath)
                            Taro.saveFile({
                                tempFilePath: filePath,
                                success: function (res) {
                                    console.log("saveFile=====ssss", res.savedFilePath, file_type)
                                    Taro.openDocument({
                                        filePath: res.savedFilePath,
                                        fileType: file_type,  //指定文件类型 file_type
                                        success: function (res) {
                                            console.log("打开文档成功", res)
                                        },
                                        fail: function (res) {
                                            Taro.showToast({
                                                title: res.errMsg
                                            })
                                            console.log("fail", res);
                                        },
                                        complete: function (res) {
                                            Taro.hideLoading()
                                            console.log("complete", res);
                                        }
                                    })
                                },
                                fail: function (res) {
                                    Taro.hideLoading()
                                    console.log("saveFile", res);
                                },
                                complete: function (res) {
                                    console.log("saveFile", res);
                                }
                            })

                        },
                        fail: function (res) {
                            Taro.hideLoading()
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
                        folder_tree: res.data.child_data
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

    },

    reducers: {
        updateDatas(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};
