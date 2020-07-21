import Taro from '@tarojs/taro'
import { getTemplateDetails, } from '../../services/workflow/index'
import { isApiResponseOk } from "../../utils/request";
import { setBoardIdStorage } from '../../utils/basicFunction'

export default {
    namespace: 'workflow',
    state: {
        workflowDatas: {}, //流程详情
    },
    effects: {

        //流程详情
        * getTemplateDetails({ payload }, { select, call, put }) {
            const { id, boardId } = payload;
            const res = yield call(getTemplateDetails, { id: id })

            if (isApiResponseOk(res)) {
                yield put({
                    type: 'updateDatas',
                    payload: {
                        workflowDatas: res.data,
                    }
                })

                setBoardIdStorage(boardId)

                // yield put({
                //     type: 'checkContentLink',
                //     payload: {
                //         board_id: boardId,
                //         link_id: id,
                //         link_local: '3',
                //     }
                // })

            } else {
                if (res.code === 401) { //未登录, 没有权限查看

                } else {
                    Taro.showToast({
                        title: res.message + '正在为你进行跳转...',
                        icon: 'none',
                        duration: 2000,
                    })
                    setTimeout(function () {
                        if (res.code === '4041') { //如果任务已删除/归档 就去任务列表(首页)

                        } else {  //其他异常
                            Taro.switchTab({
                                url: '../../pages/calendar/index',
                            })
                        }
                    }, 2000)
                }
            }
        },
    },

    reducers: {
        updateDatas(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};
