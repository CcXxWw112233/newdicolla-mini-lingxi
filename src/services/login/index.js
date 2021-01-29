import { request, packagePromise, } from "../../utils/request";
import { API_AUTH, API_UPMS } from "../../gloalSet/js/constant";

export const getVerifycodeImg = (notShowLoading) => {
  return request({
    method: 'GET',
    url: `${API_AUTH}/public/oauth/token/getLoginImageCaptcha`,
  }, notShowLoading);
}

//手机验证码
export const sendVerifyCode = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_AUTH}/public/sms/code/send`,
  }, notShowLoading)
}

//普通登录
export const normalLogin = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `/dian_lingxi_auth/signin`,
  }, notShowLoading, false, false)
}


//微信未绑定auth登录
export const weChatAuthLogin = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `/dian_lingxi_auth/signin`,
  }, notShowLoading)
}

//微信暂未绑定，需要手机号绑定登录
export const weChatPhoneLogin = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_UPMS}/user/oauth/token/wechat_applet_account_bind`,
  }, notShowLoading)
}

//微信暂未绑定，需要手机号绑定登录
//获取当前用户信息
export const getAccountInfo = (data, notShowLoading, redirectPage) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_UPMS}/v2/user`,
  }, notShowLoading, false, redirectPage)
}

//新用户如果没有组织 => 默认初始化一个组织
export const initializeOrganization = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_UPMS}/organization/default`,
  }, notShowLoading)
}

//查询当前用户所拥有的组织
export const getOrgList = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_UPMS}/organization`,
  }, notShowLoading)
}

//切换组织
export const changeOrg = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'PUT',
    url: `${API_UPMS}/v2/user/changecurrentorg/${data['_organization_id']}`,
  }, notShowLoading)
}

//组织内全部成员
export const getMemberAllList = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_UPMS}/member/all/list`,
  }, notShowLoading)
}


//用户切换账号->退出登录
export const changeOut = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_UPMS}/user/logout`
  }, notShowLoading)
}
