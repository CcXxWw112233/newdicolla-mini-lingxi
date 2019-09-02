import { request, packagePromise, } from "../../utils/request";
import { API_BOARD } from "../../gloalSet/js/constant";

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