import { request, packagePromise,} from "../../utils/request";
import { API_BOARD } from "../../gloalSet/js/constant";

//获取项目列表
export const getBoardList = (data , notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_BOARD}/mini/board/page`,
  }, true)
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
