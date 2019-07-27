import { getBar } from '../../services/testPage'
import {isApiResponseOk} from "../../utils/request";
import {getAccountInfo, changeOut} from "../../services/login";
import Taro from '@tarojs/taro'

export default {
  namespace: 'accountInfo',
  state: {
    account_info: {},
  },
  effects: {
    //获取用户信息
    * getAccountInfo({ payload }, { select, call, put }) {
      const res = yield call(getAccountInfo)
      if (isApiResponseOk(res)) {
        const { user_set = {} } = res.data
        const { current_org } = user_set
        yield put({
          type: 'updateDatas',
          payload: {
            account_info: res.data,
            current_org
          }
        })
        Taro.setStorageSync('account_info', JSON.stringify(res.data))
      } else {

      }
    },

  //退出用户登录
  * changeOut({ payload }, { select, call, put }) {
  
    const res = yield call(changeOut, payload)
    if(isApiResponseOk(res)) {
      Taro.clearStorageSync('access_token');
      Taro.clearStorageSync('refresh_token');
      Taro.reLaunch({
        url: '../../pages/login/index'
      })
    }else {
      
    }
  },
},


  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
