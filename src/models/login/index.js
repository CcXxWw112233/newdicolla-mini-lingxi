import Taro from '@tarojs/taro'
import { getBar } from '../../services/testPage'
import {isApiResponseOk} from "../../utils/request";
import {weChatAuthLogin, weChatPhoneLogin, getAccountInfo} from "../../services/login/index";

let dispatches
export default {
  namespace: 'login',
  state: {
  },
  subscriptions: {
    setup({dispatch}) {
      dispatches = dispatch
    },
  },
  effects: {
    //微信授权登录）
    * weChatAuthLogin({ payload }, { select, call, put }) {
      const { parmas } = payload
      const res = yield call(weChatAuthLogin, {...parmas})
      if(isApiResponseOk(res)) {
        yield put({
          type: 'handleToken',
          payload: {
            token_string: res.data
          }
        })
      }else {
        const res_code = res.code
        if('4013' == res_code) {
          Taro.navigateTo({url: `../../pages/phoneNumberLogin/index?user_key=${res.data}`})
        } else {

        }
      }
    },
    // 微信未绑定系统，通过手机号绑定
    * weChatPhoneLogin({ payload }, { select, call, put }) {
      const { parmas } = payload
      const res = yield call(weChatPhoneLogin, parmas)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'handleToken',
          payload: {
            token_string: res.data
          }
        })
      }else {

      }
    },
    //处理token，做相应的页面跳转
    * handleToken({ payload }, { select, call, put }) {
      const { token_string } = payload
      const tokenArr = token_string.split('__');
      Taro.setStorageSync('access_token',tokenArr[0]);        //设置token
      Taro.setStorageSync('refresh_token',tokenArr[1]); //设置refreshToken

      yield put({
        type: 'registerIm'
      })

      yield put({
        type: 'getAccountInfo',
        payload: {}
      })
      Taro.switchTab({url: `../../pages/calendar/index`})

    },
    //获取用户信息
    * getAccountInfo({ payload }, { select, call, put }) {
      const res = yield call(getAccountInfo)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'accountInfo/updateDatas',
          payload: {
            account_info: res.data
          }
        })
        Taro.setStorageSync('account_info', JSON.stringify(res.data))
      }else {

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
