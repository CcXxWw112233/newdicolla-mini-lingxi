import { request, } from "../../utils/request";
import { API_BOARD, } from "../../gloalSet/js/constant";

//获取项目列表
export const getFilePage = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'GET',
        url: `${API_BOARD}/file/page`,
    }, notShowLoading)
}

//获取文件列表
export const getFileDetails = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'GET',
        url: `${API_BOARD}/file/preview/${data['id']}`
    }, notShowLoading)
}

//下载文件
export const getDownloadUrl = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'GET',
        header: {
            BaseInfo: {
                contentDataType: 'file',
                contentDataId: data.ids,
                requestClientType: "wxapp",
            }
        },
        url: `${API_BOARD}/file/download`
    }, notShowLoading)
}

//获取文件列表
export const getFolder = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'GET',
        url: `${API_BOARD}/folder`,
    }, notShowLoading)
}


//上传文件
export const uploadFile = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'POST',
        url: `${API_BOARD}/file/upload`,
    }, notShowLoading)
}

//发送(新增)文件评论
export const sendFileComment = (data, notShowLoading) => {
    return request({
        data: {
            ...data
        },
        method: 'POST',
        header: {
            BaseInfo: {
                requestClientType: "wxapp",
            }
        },
        url: `${API_BOARD}/file/comment`,
    }, notShowLoading)
}

