import { isApiResponseOk } from "../../utils/request";
import { changeOrg, getOrgList, getMemberAllList, } from "../../services/login";
import Taro from '@tarojs/taro'

export default {
  namespace: 'my',
  state: {
    org_list: [],  //组织列表
    member_all_list: [], //某个组织内全部成员的列表
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
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
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
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },

    //获取组织内全部成员
    * getMemberAllList({ payload }, { select, call, put }) { //切换组织
      const { _organization_id } = payload
      const res = yield call(getMemberAllList, { _organization_id: _organization_id })
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            member_all_list: res.data
          }
        })
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
      return res || {}
    },

  },

  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
