import { request, packagePromise,} from "../../utils/request";
import { API_BOARD, API_WORKBENCHS } from "../../gloalSet/js/constant";

//某个组织或全组织下我参与的所有项目列表
export const getOrgBoardList = (data , notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/mini/board/participation/list/${data['_organization_id']}`,
  }, notShowLoading)
}

//获取项目列表（搜索）
export const getBoardListSearch = (data , notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/mini/board/list/search`,
  }, notShowLoading)
}

//获取排期日历卡片列表
export const getScheCardList = (data , notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/mini/board/participation/list/`,
  }, notShowLoading)
}

//获取未排期卡片列表
export const getNoScheCardList = (data , notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_WORKBENCHS}/mini/calendar/un_period`,
  }, notShowLoading)
}
