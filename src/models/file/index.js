import Taro from '@tarojs/taro'
import { getFilePage, getFileDetails, getFolder, getDownloadUrl, uploadFile, sendFileComment, getFileUnreadList, verifyAuthority, filevisited, deleteFiles, } from '../../services/file/index'
import { isApiResponseOk, } from "../../utils/request";
import { filterFileFormatType } from '../../utils/util';

export default {
    namespace: 'file',
    state: {
        file_list: [], //文件略缩图信息
        search_file_list:[],
        isShowBoardList: false,  //是否显示项目列表
        folder_tree: [],  //文件数据列表
        header_folder_name: '全部文件',  //当前选中的文件夹名称
        isShowFileComment: false,  //chat页面是否显示文件评论
        isShowChoiceFolder: false, //是否显示上传文件选择文件夹modal
        unread_file_list: [],   //未读文件列表
        selected_board_folder_info: {}, //选择的哪一个文件夹的信息(包含org_id, board_id, folder_id), 使用model跨多个组件传值
        upload_folder_name: '选择文件夹', //要上传的文件夹的名称
        choice_board_folder_id: '',  //选中的那一个的文件夹id
        choice_board_id: '', //当前被选中项目根目录的项目id
        back_click_name: true, //右上角显示'返回'还是'取消'
        current_selection_board_id: '', //当前选择的board_id
        current_board_open: false, //项目文件夹列表展开状态
        current_custom_message: {},// 点击的动态通知数据
        current_custom_comment: [],// 加载的comment数据
        load_custom_file_msg: {},// 通过接口加载的文件数据
        unvisited_file_list_count: 0,//权限数据 //未读文件的数量
        verify_authority_list: {},
        current_previewImage: '',//当前预览的图片
        uploadNowList: [],//两分钟内上传的图片
        fileListTotleString:'', //图片的个数 以及 文件的个数
    },
    effects: {
        //全部文件信息
        * getFilePage({ payload }, { select, call, put }) {
            Taro.showLoading({
                title: '加载中...',
            })
            const { board_id, _organization_id } = payload;
            const res = yield call(getFilePage, payload)
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'updateDatas',
                    payload: {
                        file_list: res.data,
                        search_file_list:res.data
                    }
                })
                // var index = fileType.lastIndexOf(".");
                // const file_type = fileType.substring(index + 1, fileType.length)
                // const img_type_arr = ['bmp', 'jpg', 'jpeg', 'png', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp']  //文件格式
                const img_type_arr = ['bmp', 'jpg', 'jpeg', 'png', 'gif',]  //文件格式
                // if (img_type_arr.indexOf(file_type) != -1) {  //打开图片
                var image_file_list = res.data.filter(function (value) {
                    return img_type_arr.indexOf(value.file_name.substr(value.file_name.lastIndexOf(".") + 1).toLowerCase()) != -1;
                })

                var unvisited_file_list = res.data.filter(function (value) {
                    return value.visited != '1';
                })

                yield put({
                    type: 'updateDatas',
                    payload: {
                        unvisited_file_list_count: unvisited_file_list.length,
                        fileListTotleString:image_file_list.length + '张图片, ' + (res.data.length - image_file_list.length) + '个文件'
                    }
                })
                if (unvisited_file_list.length > 0) {
                    if (unvisited_file_list.length == 0) {
                        Taro.removeTabBarBadge({
                            index: 2
                        })
                    } else {
                        Taro.setTabBarBadge({
                            index: 2,
                            text: unvisited_file_list.length > 99
                                ? "99+"
                                : unvisited_file_list.length
                                    ? unvisited_file_list.length + ""
                                    : ""
                        });
                    }
                }
                if (board_id.length > 0) {
                    console.log("jklsdljsklfjsklj;")
                    const account_info = JSON.parse(Taro.getStorageSync('account_info'));
                    var uploadNowList = res.data.filter(function (value) {
                        return value.create_by.id == account_info.id && new Date().getTime() -
                            parseInt(value.create_time) < 2 * 60 * 1000;
                    })
                    yield put({
                        type: 'updateDatas',
                        payload: {
                            uploadNowList: uploadNowList
                        }
                    })
                } else {
                    yield put({
                        type: 'updateDatas',
                        payload: {
                            uploadNowList: []
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
            Taro.hideLoading()
        },

        //下载文件
        * getDownloadUrl({ payload }, { select, call, put }) {
            const { parameter, fileType, downLoadAuto, fileName } = payload
            Taro.showLoading({
                title: '加载中...',
            })
            const res = yield call(getDownloadUrl, parameter)
            var index = fileType.lastIndexOf(".");
            const file_type = fileType.substring(index + 1, fileType.length)
            // const img_type_arr = ['bmp', 'jpg', 'jpeg', 'png', 'tif', 'gif', 'pcx', 'tga', 'exif', 'fpx', 'svg', 'psd', 'cdr', 'pcd', 'dxf', 'ufo', 'eps', 'ai', 'raw', 'WMF', 'webp']  //文件格式
            const img_type_arr = ['bmp', 'jpg', 'jpeg', 'png', 'gif',]  //文件格式
            if (isApiResponseOk(res)) {
                if (img_type_arr.indexOf(file_type) != -1) {  //打开图片
                    Taro.previewImage({
                        current: res.data[0],
                        urls: res.data
                    })
                    // var filePath = '';
                    // Taro.downloadFile({
                    // url: res.data[0],
                    // success: function (res) {
                    // filePath = res.tempFilePath
                    // console.log("------------" + filePath)
                    // }
                    // })
                    // yield put({
                    // type: 'updateDatas',
                    // payload: {
                    // current_previewImage: filePath
                    // }
                    // })
                    Taro.hideLoading()
                } else {
                    //通过web-view 中打开 url查看文档类文件详情
                    // Taro.setStorageSync('file_url_address', res.data.url)
                    // Taro.navigateTo({
                    //     url: `../../pages/webView/index`
                    // })


                    Taro.downloadFile({
                        url: res.data[0],
                        filePath: `${wx.env.USER_DATA_PATH}/${fileName}`,
                        success: function (res) {

                            var filePath = res.filePath
                            // Taro.saveFile({
                            // tempFilePath: filePath,
                            // success: function (res) {
                            // console.log("saveFile=====ssss", res.savedFilePath, file_type)
                            // console.log("~~~~~~~~~")
                            // console.log(res)

                            Taro.openDocument({
                                filePath: filePath,
                                fileType: file_type,  //指定文件类型 file_type
                                showMenu: downLoadAuto,
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
                        // fail: function (res) {
                        // Taro.hideLoading()
                        // Taro.showToast({
                        // title: '文件过大或不支持该格式',
                        // icon: 'none',
                        // duration: 2000
                        // })
                        // console.log("saveFile", res);
                        // },
                        // complete: function (res) {
                        // console.log("saveFile", res);
                        // }
                        // })

                        // },
                        fail: function (res) {
                            Taro.hideLoading()
                            Taro.showToast({
                                title: '文件过大或不支持该格式',
                                icon: 'none',
                                duration: 2000
                            })
                            // console.log('fail', res)
                        },
                        complete: function (res) {
                            // console.log('complete', res)
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

        // 读文件
        *filevisited({ payload }, { select, call, put }) {
            const res = yield call(filevisited)
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'updateDatas',
                    payload: {
                        unvisited_file_list_count: 0
                    }
                })

                Taro.removeTabBarBadge({
                    index: 2
                })
            } else {
                Taro.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
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
                Taro.showToast({
                    title: '评论发送成功',
                    icon: 'none',
                    duration: 2000
                })
            } else {
                Taro.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                })
            }
        },

        //全部未读文件list
        * getFileUnreadList({ payload }, { select, call, put }) {
            const res = yield call(getFileUnreadList, payload)
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'updateDatas',
                    payload: {
                        unread_file_list: res.data
                    }
                })
            } else {
                console.log('res:', res);
            }
        },

        // 
        * verifyAuthority({ payload }, { select, call, put }) {
            const res = yield call(verifyAuthority, payload)
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'updateDatas',
                    payload: {
                        verify_authority_list: res.data
                    }
                })
                Taro.setStorageSync('verify_project_authority_list', res.data)

                return res;
            } else {
                console.log('res:', res);
            }
        },
        // 批量删除文件
        *deleteFiles({ payload }, { select, call, put }) {
            const res = yield call(deleteFiles, payload)
            if (isApiResponseOk(res)) {
                console.log(res)
                return res.data;
            } else {
                Taro.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000,
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
