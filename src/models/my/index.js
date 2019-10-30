import { getBar } from '../../services/testPage'
import { isApiResponseOk } from "../../utils/request";
import { changeOrg, getOrgList } from "../../services/login";
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
      const { isTodo, _organization_id } = payload
      const res = yield call(changeOrg, { _organization_id: _organization_id })
      if (isApiResponseOk(res)) {
        yield put({
          type: 'accountInfo/getAccountInfo',
          payload: {}
        })
        //从服务消息进入每日代办,进入当前日期,并切换为全组织
        if (isTodo === 'todoList') return res || {}
        Taro.navigateBack()
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
