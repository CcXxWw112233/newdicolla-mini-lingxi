import { request, } from "../../utils/request";
import { API_BOARD, API_MORE } from "../../gloalSet/js/constant";

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

// 读文件
export const filevisited = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_BOARD}/file/visited`
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
    url: `${API_BOARD}/v2/file/download`
  }, notShowLoading)
}

//获取文件夹列表
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
        contentDataType: "file",
        contentDataId: data.file_id,
      }
    },
    url: `${API_BOARD}/file/comment`,
  }, notShowLoading)
}

// 获取文件信息
export const getFileInfo = (data, header, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    header: {
      ...header
    },
    method: "GET",
    url: `${API_BOARD}/file/info/${data['id']}`
  }, notShowLoading)
}

// 获取文件评论列表
export const getFileComment = (data, header, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    header: {
      ...header
    },
    method: "GET",
    url: `${API_BOARD}/file/comment`
  }, notShowLoading)
}

// 发送文件评论消息
export const setFileComment = (data, header, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    header: {
      ...header
    },
    method: "POST",
    url: `${API_BOARD}/file/comment`
  }, notShowLoading)
}


// 获取文件列表未读文件id 、 type=3代表文件 返回文件id数组
export const getFileUnreadList = (data, header, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    header: {
      ...header
    },
    method: "GET",
    url: `${API_MORE}/im/history/point`
  }, notShowLoading)
}

// 校验权限
export const verifyAuthority = (data, header,
  notShowLoading) => {
  return request({
    data: {
      ...data
    },
    header: {
      ...header
    },
    method: "GET",
    url: `${API_BOARD}/permissions/board`
  }, notShowLoading)
}
