import Taro from '@tarojs/taro'
import { getBar } from '../../services/testPage'
import {isApiResponseOk} from "../../utils/request";
import {weChatAuthLogin, weChatPhoneLogin} from "../../services/login/index";

export default {
  namespace: 'login',
  state: {
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
      Taro.switchTab({url: `../../pages/calendar/index`})
    },

  },

  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
