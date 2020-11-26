import { request, } from "../../utils/request";
import { API_BOARD } from "../../gloalSet/js/constant";
import { createHeaderContentDataByCardId } from '../constant'

//流程详情
export const getTemplateDetails = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        headers: createHeaderContentDataByCardId(data.card_id),
        method: 'GET',
        url: `${API_BOARD}/v2/workflow`,
    }, notShowLoading)
}

//流程-审批,通过
export const putApprovalComplete = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'PUT',
        url: `${API_BOARD}/v2/flow/task/complete`,
    }, notShowLoading, true)
}

//流程-审批/评分,驳回
export const putApprovalReject = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'PUT',
        url: `${API_BOARD}/v2/flow/task/reject`,
    }, notShowLoading, true)
}
