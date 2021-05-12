import { request, packagePromise, } from "../../utils/request";
import { API_BOARD,API_UPMS, REQUEST_INTERGFACE_VERSIONN } from "../../gloalSet/js/constant";


// 获取项目详情
export const getMilestoneDetail = (data, notShowLoading) => {
  return request({
    data: {
      // ...data
    },
    method: 'GET',
    url: `${API_BOARD}/milestone/detail/${data.id}`,
  }, notShowLoading)
}

// 获取项目详情
export const updateMilestone = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'PUT',
    url: `${API_BOARD}/milestone`,
  }, notShowLoading)
}
