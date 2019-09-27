import Taro from "@tarojs/taro";
import { BASE_URL, INT_REQUEST_OK, REQUEST_RES_CODE_TOKEN_INVALID } from "../gloalSet/js/constant";
import { setRequestHeaderBaseInfo } from "./basicFunction";

export const request = (options, notShowLoading, isNewLogin) => {
  const { url = "", data = {}, method = "GET", header = {} } = options;
  let Headers = { ...header };
  Headers['Authorization'] = Taro.getStorageSync('access_token')

  return new Promise((resolve, reject) => {

    /***
     * windows刷新菊花隐藏掉
     */
    // if (!notShowLoading) {
    //   Taro.showLoading({
    //     title: "加载中...",
    //     mask: "true"
    //   });
    // }

    // Headers['content-type'] = 'application/x-www-form-urlencoded'
    Taro.request({
      url: BASE_URL + url,
      data: {
        ...data
      },
      method,
      header: { ...Headers, ...setRequestHeaderBaseInfo({ data, headers: Headers }) },
      success: function (res) {
        // if (!notShowLoading) {
        //   Taro.hideLoading();
        // }

        //获取是哪个页面未登录=>跳转到登录
        let pages = Taro.getCurrentPages();
        let currPage = null;
        if (pages.length) {
          currPage = pages[pages.length - 1];
        }
        let route = currPage.route
        let routePageName = route.slice(6, -6)

        if (REQUEST_RES_CODE_TOKEN_INVALID == res.data.code) {
          if (!isNewLogin) {//正常的登录页面
            Taro.reLaunch({
              url: `../../pages/login/index?redirect=${routePageName}`
              // url: `../../pages/login/index`
            })
          }
          else {  //扫码登录的新的登录页面
            Taro.navigateTo({
              url: '../../pages/nowOpen/index'
            })
          }
        }

        resolve(res.data);
      },
      fail: function (error) {
        if (!notShowLoading) {
          Taro.hideLoading();
        }
        Taro.showToast({
          title: "系统繁忙，请稍后重试",
          icon: "none"
        });
        reject({ error: "系统繁忙，请稍后重试" });
      },
      comcomplete: function (res) {

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
