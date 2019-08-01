import Taro from "@tarojs/taro";
import { BASE_URL, INT_REQUEST_OK, REQUEST_RES_CODE_TOKEN_INVALID } from "../gloalSet/js/constant";

export const request = (options, notShowLoading, isNewLogin) => {
  const { url = "", data = {}, method = "GET", header = {} } = options;
  let Headers = { ...header};
  Headers['Authorization'] = Taro.getStorageSync('access_token')

  return new Promise((resolve, reject) => {
    if (!notShowLoading) {
      Taro.showLoading({
        title: "加载中...",
        mask: "true"
      });
    }
    // Headers['content-type'] = 'application/x-www-form-urlencoded'
    Taro.request({
      url: BASE_URL + url,
      data: {
        ...data
      },
      method,
      header: Headers,
      success: function(res) {
        if (!notShowLoading) {
          Taro.hideLoading();
        }
        if(REQUEST_RES_CODE_TOKEN_INVALID == res.data.code) {
          // Taro.navigateTo({url: '../../pages/login/index'})
          if (!isNewLogin) {
            Taro.reLaunch({
              url: '../../pages/login/index'
            })
          }
          else {
            Taro.reLaunch({
              url: '../../pages/nowOpen/index'
            })
          }

        }

        resolve(res.data);
      },
      fail: function(error) {
        if (!notShowLoading) {
          Taro.hideLoading();
        }
        Taro.showToast({
          title: "系统繁忙，请稍后重试",
          icon: "none"
        });
        reject({ error: "系统繁忙，请稍后重试" });
      },
      comcomplete: function(res) {
        console.log(res);
      }
    });
  });
};

//在接口调用包裹一层，用于做接口数据处理（接口数据处理不在页面执行）
export const packagePromise = fn => {
  return new Promise(fn);
};

//判断是否返回正常
export const isApiResponseOk = (response) => {
  return response && Number(response.code) === INT_REQUEST_OK
}
