import { request, packagePromise } from "../../utils/request";
import {
  API_BOARD,
  API_WORKBENCHS,
  API_UPMS,
  API_MORE,
  REQUEST_INTERGFACE_VERSIONN
} from "../../gloalSet/js/constant";

//某个组织或全组织下我参与的所有项目列表
export const getOrgBoardList = (data, notShowLoading) => {
  return request(
    {
      data: {
        ...data
      },
      method: "GET",
      url: `${API_BOARD}/mini/board/participation/list/${data["_organization_id"]}`
    },
    notShowLoading
  );
};

//获取项目列表（搜索）
export const getBoardListSearch = (data, notShowLoading) => {
  return request(
    {
      data: {
        ...data
      },
      method: "GET",
      url: `${API_BOARD}/mini/board/list/search`
    },
    notShowLoading
  );
};

//获取排期日历卡片列表
export const getScheCardList = (data, notShowLoading) => {
  return request(
    {
      data: {
        ...data
      },
      method: "GET",
      url: `${API_WORKBENCHS}/mini/calendar`
    },
    notShowLoading
  );
};

//获取未排期卡片列表
export const getNoScheCardList = (data, notShowLoading) => {
  return request(
    {
      data: {
        ...data
      },
      method: "GET",
      url: `${API_WORKBENCHS}/mini/calendar/un_period`
    },
    notShowLoading
  );
};

//获取打点列表
export const getSignList = (data, notShowLoading) => {
  return request(
    {
      data: {
        ...data
      },
      method: "GET",
      url: `${API_WORKBENCHS}/mini/calendar/sign`
    },
    notShowLoading
  );
};

//获取用户下所有组织Id及项目Id
export const getUserAllOrgsAllBoards = (data, notShowLoading) => {
  return request(
    {
      data: {
        ...data
      },
      method: "GET",
      url: `${API_UPMS}/organization/list/id`
    },
    notShowLoading
  );
};

// 获取代办会议列表
export async function getMeetingTodoList(params) {
  return request({
    url: `${API_MORE}${REQUEST_INTERGFACE_VERSIONN}/meeting/list/by_self`,
    method: "GET",
    params
  });
}
