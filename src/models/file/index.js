import Taro from '@tarojs/taro'
import { getFilePage, getFileDetails, getFolder } from '../../services/file/index'
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
        //文件详情
        * getFileDetails({ payload }, { select, call, put }) {
            const res = yield call(getFileDetails, payload)
            if (isApiResponseOk(res)) {
                if (res.data.is_real_image === true) {  //打开图片
                    Taro.previewImage({
                        current: '',
                        urls: [res.data.url,]
                    })
                } else { //通过web-view 中打开 url查看文档类文件详情
                    Taro.setStorageSync('file_url_address', res.data.url)
                    Taro.navigateTo({
                        url: `../../pages/webView/index`
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
