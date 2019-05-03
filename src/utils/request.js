import Taro from "@tarojs/taro";
import { BASE_URL, APP_ID, INT_REQUEST_OK } from "../gloalSet/js/constant";

export const request = (options, notShowLoading) => {
  const { url = "", data = {}, method = "GET", header = {} } = options;
  let Headers = { ...header, appid: APP_ID };
  return new Promise((resolve, reject) => {
    if (!notShowLoading) {
      Taro.showLoading({
        title: "加载中...",
        mask: "true"
      });
    }

    Taro.request({
      url: BASE_URL + url,
      data: {
        ...data
      },
      method,
      header: Headers,
      success: function(res) {
        // success网络请求成功
        if (!notShowLoading) {
          Taro.hideLoading();
        }
        if (isApiResponseOk(res.data)) {
          resolve(res.data);
        } else {
          Taro.showToast({
            title: res.data.data && res.data.data.message,
            icon: "none"
          });
          reject({error: res.data});
        }
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
