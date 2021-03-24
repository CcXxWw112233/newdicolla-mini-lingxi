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

// 流程中止  id
export const flowAbort = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'GET',
        url: `${API_BOARD}/v2/workflow/end`,
    }, notShowLoading, true)
}

// 流程删除  id
export const flowDelete = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'DELETE',
        url: `${API_BOARD}/v2/workflow?id=${data.id}`,
    }, notShowLoading, true)
}

// 流程继续执行
//  id
export const flowContinue = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'GET',
        url: `${API_BOARD}/v2/workflow/restart`,
    }, notShowLoading, true)
}

// 重新发起 id
export const flowRenew = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'GET',
        url: `${API_BOARD}/v2/template`,
    }, notShowLoading, true)
}