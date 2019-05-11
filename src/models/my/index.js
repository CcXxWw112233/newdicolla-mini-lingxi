import { getBar } from '../../services/testPage'
import {isApiResponseOk} from "../../utils/request";
import {changeOrg, getOrgList} from "../../services/login";
import Taro from '@tarojs/taro'

export default {
  namespace: 'my',
  state: {
    org_list: [],
  },
  effects: {
    //获取组织列表
    * getOrgList({ payload }, { select, call, put }) {
      const res = yield call(getOrgList)
      if (isApiResponseOk(res)) {
         yield put({
           type: 'updateDatas',
           payload: {
             org_list: res.data
           }
         })
      } else {

      }
    },

    //切换组织
    * changeCurrentOrg({ payload }, { select, call, put }) { //切换组织
      const res = yield call(changeOrg, payload)
      if(isApiResponseOk(res)) {
        const tokenArray = res.data.split('__')
        Taro.setStorageSync('access_token', tokenArray[0])
        Taro.setStorageSync('refresh_token', tokenArray[1])
        Taro.navigateBack()
      }else{
      }
    },


  },

  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
