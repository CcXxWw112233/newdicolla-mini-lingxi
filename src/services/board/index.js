import { request, packagePromise, } from "../../utils/request";
import { API_BOARD, REQUEST_INTERGFACE_VERSIONN } from "../../gloalSet/js/constant";

//获取项目列表
export const getBoardList = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/mini/board/page`,
  }, notShowLoading)
}

//获取项目列表（搜索）
export const getBoardListSearch = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/mini/board/list/search`,
  }, notShowLoading)
}

//项目列表
export async function getProjectList(params) {
  return request({
    url: `${API_BOARD}${REQUEST_INTERGFACE_VERSIONN}/board/list`,
    method: 'GET',
    params: {
      contain_type: '3',
      _organization_id: params._organization_id || localStorage.getItem('OrganizationId')
    }
  });
}

// 获取项目详情
export const getBoardDetail = (data, notShowLoading) => {
  return request({
    data: {
      // ...data
    },
    method: 'GET',
    url: `${API_BOARD}/board/detail/${data.id}`,
  }, notShowLoading)
}

//通用项目列表
export const v2BoardList = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/board/list/filter/app`,
  }, notShowLoading)
}