import Taro from '@tarojs/taro'
import { getFilePage, getFileDetails, } from '../../services/file/index'
import { isApiResponseOk } from "../../utils/request";

export default {
    namespace: 'file',
    state: {
        file_list: [], //文件略缩图信息
    },
    effects: {
        //文件信息
        * getFilePage({ payload }, { select, call, put }) {
            const res = yield call(getFilePage, payload)
            console.log('全部文件:', res);

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
            console.log(res, '文件详情');

            if (isApiResponseOk(res)) {
                // yield put({
                //     type: 'updateDatas',
                //     payload: {
                //         file_list: res.data
                //     }
                // })
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
