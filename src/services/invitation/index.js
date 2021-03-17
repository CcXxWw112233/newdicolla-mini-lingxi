import { request } from "../../utils/request";
import { API_UPMS, API_BOARD } from "../../gloalSet/js/constant";

//用户扫码后检查二维码是否过期并且返回数据
export const qrCodeIsInvitation = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_UPMS}/mini/QRCode/check/${data['id']}`,
  }, notShowLoading)
}

//用户扫码加入 项目
export const userScanCodeJoinBoard = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_BOARD}/board/join/scan_code`,
  }, notShowLoading)
}

/*
* mark - parms 新的加入组织接口
*/
//用户扫码加入 组织/任务/项目/会议===1
export const userScanCodeJoinOrganization = (data, notShowLoading, isNewLogin) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_UPMS}/organization/invite/QRCode/join`,
  }, notShowLoading, true)
}

//用户扫码加入 组织/任务/项目/会议===2
export const commInviteQRCodejoin = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_BOARD}/comm/invite/QRCode/join`,
  }, notShowLoading)
}

/**
 * 关注扫描的二维码
 */
export const FollowQrcode = (data) => {
  return request({
    data,
    method: 'POST',
    url: `${API_BOARD}/report/follow?report_id=${data.id}`
  })
}

/**
 * 获取扫码详情
 */
export const getQrCodeInfo = (data) => {
  return request({
    url: `${API_BOARD}/report/follow/${data.id}`,
    method: 'GET',
  })
}

/**
 * 获取扫码列表
 */
export const getQrCodeHistory = (data) => {
  return request({
    url: `${API_BOARD}/report/follow/list`,
    data,
    method: 'GET'
  })
}

/**
 * 删除二维码列表
 */
export const removeQrcode = (data) => {
  return request({
    url: `${API_BOARD}/report/unfollow?report_id=${data.id}`,
    method: 'POST'
  })
}

/**
 * 修改二维码数据的名称
 */
export const EditHistoryTitle = (data) => {
  return request({
    url: `${API_BOARD}/report/qrcode/record/${data.id}?report_title=${data.report_title}`,
    data,
    method: 'PUT'
  })
}
