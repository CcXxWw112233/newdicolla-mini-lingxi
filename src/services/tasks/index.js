import { request, packagePromise, } from "../../utils/request";
import { API_BOARD } from "../../gloalSet/js/constant";
import { createHeaderContentDataByCardId } from '../constant'
 

// 任务列表
export const getTaskGroupList = (data , notShowLoading) => {
    return request({
      data: {
        ...data
      },
      method: 'GET',
      url: `${API_BOARD}/card`,
    }, notShowLoading)
  }
  
  //任务详情
  export const getTasksDetail = (data , notShowLoading) => {
    return request({
      data: {
        ...data
      },
      headers: createHeaderContentDataByCardId(data.card_id),
      method: 'GET',
      url: `${API_BOARD}/card/detail/${data['id']}`,
    }, notShowLoading)
  }

  //创建任务
  export const addTask = (data , notShowLoading) => {
    return request({
      data: {
        ...data
      },
      method: 'POST',
      url: `${API_BOARD}/card`,
    }, notShowLoading)
  }

  //获取任务评论列表
  export const getCardCommentListAll = (data , notShowLoading) => {
    return request({
      data: {
        ...data
      },
      method: 'GET',
      url: `${API_BOARD}/card/comment`,
    }, notShowLoading)
  }

//新增评论
export const addComment = (data , notShowLoading) => {  
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_BOARD}/card/comment`,
  }, notShowLoading)
}

 