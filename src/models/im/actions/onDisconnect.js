import Taro from '@tarojs/taro';

function onDisconnect(error) {
  const {
    globalData: {
      store: { dispatch }
    }
  } = Taro.getApp();

  if (error) {
    switch (error.code) {
      // 账号或者密码错误, 请跳转到登录页面并提示错误
      case 302:
        console.log('onError: 账号或者密码错误');
        Taro.showToast({
          title: 'im 账号或密码错误',
          duration: 2000
        });
        dispatch({
          type: 'updateStateFieldByCover',
          payload: {
            isLogin: false
          }
        });
        break;
      // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
      case 417:
        console.log('onError: 重复登录');
        break;
      // 被踢, 请提示错误后跳转到登录页面
      case 'kicked':
        Taro.showModal({
          title: '用户下线',
          showCancel: false,
          content: '在其他客户端登录，导致被踢',
          confirmText: '重新登录',
          success: res => {
            if (res.confirm) {
              //点击确定
              // let pages = getCurrentPages();
              // let currentPage = pages[pages.length - 1];
              // if (currentPage.route.includes('videoCallMeeting')) {
              // 多人视频
              // try {
              // 兼容登录网关502错误离开房间
              // if (app.globalData.netcall) {
              //   app.globalData.netcall.leaveChannel().then(() => {
              //     app.globalData.netcall.destroy();
              //     app.globalData.nim.destroy({
              //       done: function() {
              //         console.log('destroy nim done !!!');
              //         wx.clearStorage();
              //         wx.hideLoading();
              //       }
              //     });
              //     wx.reLaunch({
              //       url: '/pages/login/login'
              //     });
              //   });
              // }
              // } catch (error) {}
              // } else if (currentPage.route.includes('videoCall')) {
              // p2p
              // try {
              // 兼容登录网关502错误离开房间
              // if (app.globalData.netcall) {
              //   app.globalData.netcall.hangup().then(() => {
              //     app.globalData.netcall.destroy();
              //     app.globalData.nim.destroy({
              //       done: function() {
              //         console.log('destroy nim done !!!');
              //         wx.clearStorage();
              //         wx.hideLoading();
              //       }
              //     });
              //     wx.reLaunch({
              //       url: '/pages/login/login'
              //     });
              //   });
              // }
              // } catch (error) {
              //   console.warn(error);
              // }
            } else {
              const {
                globalData: {
                  store: { getState }
                }
              } = Taro.getApp();
              const {
                im: { nim }
              } = getState();
              if (nim) {
                nim.destroy({
                  done: function () {
                    console.log('destroy nim done !!!');

                    //这里做一些清理工作
                    // wx.clearStorage();
                    // wx.hideLoading();
                  }
                });
              }
              // app.globalData.nim.destroy({
              //   done: function() {
              //     console.log('destroy nim done !!!');
              //     wx.clearStorage();
              //     wx.hideLoading();
              //   }
              // });
              // wx.reLaunch({
              //   url: '/pages/login/login'
              // });
              // }
            }
          }
        });
        break;
      case 'logout': {
        // console.log(error.code,"主动destroy");
      }
        break;
      default:
        // console.log(error.code,"im 异常错误");
        // console.log(error,"im 异常错误");
        // const {
        //   globalData: {
        //     store: { getState }
        //   }
        // } = Taro.getApp();
        // const {
        //   im: { nim }
        // } = getState();
        // try {
        //   nim.disconnect()
        //   console.log('liuyingjun',"im 异常错误");
        //   nim.connect()
        // } catch (error) {
        //   console.log('im disconnect:错误', error);
        //   nim.destroy();
        //   const {dispatch} = this.props;
        //   dispatch({
        //     type:'im/updateStateFieldByCover',
        //     payload:{
        //       nim:null
        //     }
        //   });
        //   // registerIM
        // }

        break;
    }
  }
}

export default onDisconnect;
