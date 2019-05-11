import { request, packagePromise,} from "../../utils/request";
import {API_UPMS} from "../../gloalSet/js/constant";

//手机验证码
export const sendVerifyCode = (data , notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_UPMS}/sms/code/send`,
  }, notShowLoading)
}

//普通登录
export const normalLogin = (data , notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_UPMS}/user/signin`,
  }, notShowLoading)
}


//微信未绑定auth登录
export const weChatAuthLogin = (data , notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_UPMS}/mini/auth/login`,
  }, notShowLoading)
}

//微信暂未绑定，需要手机号绑定登录
export const weChatPhoneLogin = (data , notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_UPMS}/mini/user/auth/bind/login`,
  }, notShowLoading)
}

//微信暂未绑定，需要手机号绑定登录
export const getAccountInfo = (data , notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_UPMS}/v2/user`,
  }, notShowLoading)
}

//查询当前用户所拥有的组织
export const getOrgList = (data , notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `${API_UPMS}/organization`,
  }, notShowLoading)
}
//切换组织
export const changeOrg = (data , notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'PUT',
    url: `${API_UPMS}/v2/user/changecurrentorg/${data['_organization_id']}`,
  }, notShowLoading)
}
