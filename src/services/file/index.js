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

