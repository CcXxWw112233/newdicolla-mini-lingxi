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

//用户扫码加入 组织
export const userScanCodeJoinOrganization = (data, notShowLoading, isNewLogin) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_UPMS}/organization/invite/QRCode/join`,
  }, notShowLoading, true)
}

//
export const commInviteQRCodejoin = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_BOARD}/comm/invite/QRCode/join`,
  }, notShowLoading)
}