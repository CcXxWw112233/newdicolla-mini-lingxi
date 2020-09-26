import { request, packagePromise, } from "../../utils/request";

//接口数据不需要处理
export const getBar = (data, notShowLoading) => {
  return request({
    data: {
      ...data
    },
    method: 'GET',
    url: `/category`,
  }, notShowLoading)
}

//接口数据需要转化处理
//data接口参数，notShowLoading是否需要显示loding默认显示，传true不显示.
export const getToo = (data = {}, notShowLoading,) => packagePromise((resolve, reject) => {
  request({
    data: {
      ...data
    },
    method: 'GET',
    url: `/category`,
  }, notShowLoading).then(res => {
    resolve(res)
  }).catch(res => {
    reject(res)
  })
})


