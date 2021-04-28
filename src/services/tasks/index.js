import { request, packagePromise, } from "../../utils/request";
import { API_BOARD, } from "../../gloalSet/js/constant";
import { createHeaderContentDataByCardId } from '../constant'


// 任务列表
export const getTaskGroupList = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/card`,
  }, notShowLoading)
}

//任务详情
// export const getTasksDetail = (data, notShowLoading) => {
//   return request({
//     data: {
//       ...data
//     },
//     headers: createHeaderContentDataByCardId(data.card_id),
//     method: 'GET',
//     url: `${API_BOARD}/card/detail/${data['id']}`,
//   }, notShowLoading)
// }

export const getTasksDetail = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    headers: createHeaderContentDataByCardId(data.card_id),
    method: 'GET',
    url: `${API_BOARD}/v2/card/detail/`,
  }, notShowLoading)
}

//新增任务(工作台中)
export const addTask = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_BOARD}/card/add`,
  }, notShowLoading)
}

//新增子任务
export const postV2Card = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_BOARD}/v2/card`,
  }, notShowLoading)
}

//获取任务评论列表
export const getCardCommentListAll = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/card/comment`,
  }, notShowLoading)
}

//新增评论
export const addComment = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_BOARD}/card/comment`,
  }, notShowLoading)
}


//查看内容关联
export const checkContentLink = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/content_link`,
  }, notShowLoading)
}

//执行人列表
export const getTaskExecutorsList = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/board/user/${data.board_id}`,
  }, notShowLoading)
}

//新增执行人
export const addCardExecutor = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_BOARD}/card/executor`,
  }, notShowLoading)
}

//删除执行人
export const deleteCardExecutor = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'DELETE',
    url: `${API_BOARD}/card/executor`,
  }, notShowLoading)
}

//里程碑列表
export const getTaskMilestoneList = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/milestone/${data.id}`,
  }, notShowLoading)
}


//完成/未任务
export const setTasksRealize = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'PUT',
    url: `${API_BOARD}/card/realize`,
  }, notShowLoading, true)
}

//更新任务
export const updataTasks = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'PUT',
    url: `${API_BOARD}/card`,
  }, notShowLoading, true)
}

//修改任务
export const putCardBaseInfo = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    header: createHeaderContentDataByCardId(data.id),
    method: 'PUT',
    url: `${API_BOARD}/v2/card/${data.id}`,
  }, notShowLoading, true)
}

//删除任务
export const deleteCard = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    header: createHeaderContentDataByCardId(data.id),
    method: 'DELETE',
    url: `${API_BOARD}/v2/card/${data.id}`,
  }, notShowLoading, true)
}


//标签列表
export const getLabelList = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/label`,
  }, notShowLoading)
}

//新增标签
export const postCardLabel = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_BOARD}/card/label`,
  }, notShowLoading)
}

//删除标签
export const deleteCardLabel = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'DELETE',
    url: `${API_BOARD}/card/label`,
  }, notShowLoading)
}

//任务分组列表
export const getCardList = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/card/lists`,
  }, notShowLoading)
}

//任务, 日程， 节点数据关联里程碑 origin_type: 0=任务 1=日程 2=节点
export const boardAppRelaMiletones = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_BOARD}/milestone/rela`,
  }, notShowLoading)
}

//删除关联里程碑
export const deleteAppRelaMiletones = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'DELETE',
    url: `${API_BOARD}/milestone/rela`,
  }, notShowLoading)
}

//删除子任务交付物
export const deleteCardAttachment = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'DELETE',
    url: `${API_BOARD}/card/attachment/${data.attachment_id}`,
  }, notShowLoading)
}

//删除自定义字段
export const deleteCardProperty = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'DELETE',
    url: `${API_BOARD}/card/property?card_id=${data.card_id}&property_id=${data.property_id}`,
  }, notShowLoading)
}


//删除自定义字段
export const postCardProperty = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_BOARD}/card/property`,
  }, notShowLoading)
}

//获取自定义字段列表
export const getBoardFieldGroupList = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/board/field/group/list?_organization_id=${data.org_id}&field_status=0`,
  }, notShowLoading)
}


//自定义字段单选
export const putBoardFieldRelation = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'PUT',
    url: `${API_BOARD}/board/field/relation`,
  }, notShowLoading, true)
}

//自定义字段删除
export const deleteBoardFieldRelation = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    
    method: 'DELETE',
    url: `${API_BOARD}/board/field/relation?id=${data.id}`,
  }, notShowLoading, true)
}

//自定义字段增加
export const postBoardFieldRelation = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_BOARD}/board/field/relation`,
  }, notShowLoading, true)
}

//任务属性
export const getCardProperties = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/card/properties`,
  }, notShowLoading)
}

//自定义字段删除文件字段的文件
export const deleteFileFieldsFileRemove = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'DELETE',
    url: `${API_BOARD}/file/remove`,
  }, notShowLoading, true)
}

// 删除任务
export const deleteTask = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'DELETE',
    url: `${API_BOARD}/v2/card/${data.card_id}`,
  }, notShowLoading, true)
}

// 角色
export const getRoleList = (data, notShowLoading) => {
  return request({
    data: {
    },
    method: 'GET',
    url: `${API_BOARD}/board/detail/${data.board_id}`,
  }, notShowLoading)
}

/**
 * 添加任务分组
 */
export const putBoardtaskGroup = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_BOARD}/card/lists/rela`,
  }, notShowLoading, true)
}
// 删除任务分组
export const deleteTaskGroup = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'DELETE',
    url: `${API_BOARD}/card/lists/rela`,
  }, notShowLoading, true)
}