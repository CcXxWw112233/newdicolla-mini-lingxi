import Taro from "@tarojs/taro";
import { BASE_URL, INT_REQUEST_OK, REQUEST_RES_CODE_TOKEN_INVALID } from "../gloalSet/js/constant";
import { setRequestHeaderBaseInfo } from "./basicFunction";

var isNavigatePushLogin = true;
export const request = (options, notShowLoading, isNewLogin, redirectPage = true) => {
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
        let route = currPage && currPage.route
        let routePageName = route && route.slice(6, -6)

        //防止执行两遍
        if (isNavigatePushLogin) {
          isNavigatePushLogin = false
          if (REQUEST_RES_CODE_TOKEN_INVALID == res.data.code) {
            if (!isNewLogin && redirectPage) {//正常的登录页面
              if (route.indexOf('pages/index/index') == -1) {
                Taro.navigateTo({
                  url: `../../pages/index/index?redirect=${routePageName}`
                })
              }
            }
            else if (redirectPage) {  //扫码登录的新的登录页面
              Taro.navigateTo({
                url: '../../pages/nowOpen/index'
              })
            }
          }
          setTimeout(() => {
            isNavigatePushLogin = true
          }, 1000)
        }

        resolve(res.data);
      },
      fail: function (error) {
        if (!notShowLoading) {
          Taro.hideLoading();
        }
        Taro.showToast({
          title: "系统繁忙，请稍后重试",
          icon: "none",
          duration: 2000
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
