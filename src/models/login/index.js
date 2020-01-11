import Taro from '@tarojs/taro'
import { isApiResponseOk } from "../../utils/request";
import { weChatAuthLogin, weChatPhoneLogin, getAccountInfo, initializeOrganization } from "../../services/login/index";

let dispatches
export default {
  namespace: 'login',
  state: {},
  subscriptions: {
    setup({ dispatch }) {
      dispatches = dispatch
    },
  },
  effects: {
    //微信授权登录）
    * weChatAuthLogin({ payload }, { select, call, put }) {
      const parmas = payload.parmas
      const res = yield call(weChatAuthLogin, { ...parmas })
      if (isApiResponseOk(res)) {
        yield put({
          type: 'handleToken',
          payload: {
            token_string: res.data,
            sourcePage: payload.sourcePage,
          }
        })

      } else {
        const res_code = res.code
        if ('4013' == res_code) {
          Taro.navigateTo({ url: `../../pages/phoneNumberLogin/index?user_key=${res.data}&sourcePage=${payload.sourcePage}` })
        } else {

        }
      }
    },
    // 微信未绑定系统，通过手机号绑定
    * weChatPhoneLogin({ payload }, { select, call, put }) {
      const { parmas, sourcePage, phoneNumberBind, } = payload
      const res = yield call(weChatPhoneLogin, parmas)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'handleToken',
          payload: {
            token_string: res.data,
            phoneNumberBind,
          }
        })

        if (sourcePage === 'Invitation') {
          const query_Id = Taro.getStorageSync('id')
          const boardId = Taro.getStorageSync('board_Id')
          yield put({
            type: 'invitation/userScanCodeJoinOrganization',
            payload: {
              id: query_Id,
              board_Id: boardId,
            }
          })
        }
      } else {
        // 微信已绑定系统，给出提示
        Taro.showToast({
          icon: 'none',
          title: res.message
        })
      }
    },
    //处理token，做相应的页面跳转
    * handleToken({ payload }, { select, call, put }) {

      const { token_string, phoneNumberBind } = payload;
      const tokenArr = token_string.split('__');
      Taro.setStorageSync('access_token', tokenArr[0]);        //设置token
      Taro.setStorageSync('refresh_token', tokenArr[1]);       //设置refreshToken

      yield put({
        type: 'registerIm'
      })

      yield put({
        type: 'getAccountInfo',
        payload: {}
      })
      const boardId = Taro.getStorageSync('board_Id')
      //日历页面是否需要注入im方法的标识
      const switchTabCurrentPage = 'currentPage_BoardDetail_or_Login'
      Taro.setStorageSync('switchTabCurrentPage', switchTabCurrentPage);

      const pages = getCurrentPages()
      if (pages.length === 1) {
        Taro.switchTab({
          url: `../../pages/calendar/index`
        })
      } else {
        if (phoneNumberBind) {
          Taro.navigateBack({
            delta: 2,
          })
        } else {
          Taro.navigateBack({
            delta: 1,
          })
        }
      }
    },

    //获取用户信息
    * getAccountInfo({ payload }, { select, call, put }) {
      const res = yield call(getAccountInfo)

      if (isApiResponseOk(res)) {
        yield put({
          type: 'accountInfo/updateDatas',
          payload: {
            account_info: res.data
          }
        })
        Taro.setStorageSync('account_info', JSON.stringify(res.data))
        //如果没有组织 => 默认初始化一个组织 
        //has_org = 1 已有组织, 0 没有组织则初始化一个默认组织
        if (res.data.has_org === '0') {
          const result = yield call(initializeOrganization)
          if (isApiResponseOk(result)) {

          } else {
            Taro.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000
            })
          }
        }
      } else {

      }
    },
    //注入im
    * registerIm({ payload }, { select, call, put }) {
      const initImData = async () => {
        const { account, token } = await dispatches({
          type: 'im/fetchIMAccount'
        });
        await dispatches({
          type: 'im/initNimSDK',
          payload: {
            account,
            token
          }
        });
        return await dispatches({
          type: 'im/fetchAllIMTeamList'
        });
      };
      initImData().catch(e => Taro.showToast({ title: String(e), icon: 'none' }));
    }
  },

  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
