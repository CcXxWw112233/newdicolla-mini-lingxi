import Taro from '@tarojs/taro'
import { getTemplateDetails, putApprovalComplete, putApprovalReject, } from '../../services/workflow/index'
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

        //流程-审批,通过
        * putApprovalComplete({ payload }, { select, call, put }) {
            const { flow_instance_id, flow_node_instance_id, message, content_values, } = payload
            const res = yield call(putApprovalComplete, {
                flow_instance_id: flow_instance_id,
                flow_node_instance_id: flow_node_instance_id,
                message: message,
                content_values: content_values,
            })
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'getTemplateDetails',
                    payload: {
                        id: flow_instance_id,
                    }
                })
                Taro.showToast({
                    title: '已通过!',
                    icon: 'none',
                    duration: 2000,
                })
            } else {
                Taro.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000,
                })
            }
        },

        //流程-审批,驳回
        * putApprovalReject({ payload }, { select, call, put }) {
            const { flow_instance_id, flow_node_instance_id, message } = payload
            const res = yield call(putApprovalReject, {
                flow_instance_id: flow_instance_id,
                flow_node_instance_id: flow_node_instance_id,
                message: message,
            })
            if (isApiResponseOk(res)) {
                yield put({
                    type: 'getTemplateDetails',
                    payload: {
                        id: flow_instance_id,
                    }
                })
                Taro.showToast({
                    title: '已经驳回!',
                    icon: 'none',
                    duration: 2000,
                })
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
