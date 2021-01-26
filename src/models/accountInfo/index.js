import { isApiResponseOk } from "../../utils/request";
import { getAccountInfo, changeOut, updateNickName } from "../../services/login";
import Taro from '@tarojs/taro'

export default {
  namespace: 'accountInfo',
  state: {
    account_info: {},
    is_mask_show_personalCenter: false, //是否打开个人中心
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
      if (isApiResponseOk(res)) {
        Taro.clearStorageSync();  //清除所有的Storage
        Taro.reLaunch({
          url: '../../pages/index/index'
        })
      } else {

      }
    },
    //更新用户名
    * updateNickName({ payload }, { select, call, put }) {
      const res = yield call(updateNickName, payload)
      if (isApiResponseOk(res)) {
        var account_info = {};
        account_info = JSON.parse(Taro.getStorageSync('account_info'));
        account_info.name = payload.name;
        yield put({
          type: 'updateDatas',
          payload: {
            account_info: account_info,
            current_org: account_info.user_set
          }
        })
        Taro.setStorageSync('account_info', JSON.stringify(account_info))
      } else {
      }
    },
  },


  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
