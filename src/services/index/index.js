import { request, packagePromise} from "../../utils/request";
import {API_UPMS} from "../../gloalSet/js/constant";

export const getBar = (data , notShowLoading) => packagePromise((resolve, reject) => {
  request({
    data: {
      ...data
    },
    method: 'POST',
    url: `${API_UPMS}/mini/auth/login`,
  }, notShowLoading).then(res => {
    resolve(res)
  }).catch(res => {
    reject(res)
  })
})
