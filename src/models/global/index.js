import Taro from '@tarojs/taro'
import { globalQuery, } from '../../services/globalQuery/index'
import { isApiResponseOk } from "../../utils/request";

export default {
    namespace: 'global',
    state: {

    },
    effects: {
        //搜索
        * globalQuery({ payload }, { select, call, put }) {
            const res = yield call(globalQuery, payload)
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'file/updateDatas',
                    payload: {
                        file_list: res.data.results.files.records
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
