import { request, packagePromise,} from "../../utils/request";
import {API_UPMS} from "../../gloalSet/js/constant";

//接口数据不需要处理
export const sendVerifyCode = (data , notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_UPMS}/sms/code/send`,
  }, notShowLoading)
}

//接口数据不需要处理
export const normalLogin = (data , notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_UPMS}/user/signin`,
  }, notShowLoading)
}


