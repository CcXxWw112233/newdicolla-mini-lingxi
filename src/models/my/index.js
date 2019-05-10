import { getBar } from '../../services/testPage'
import {isApiResponseOk} from "../../utils/request";
import { getOrgList } from "../../services/login";
import Taro from '@tarojs/taro'

export default {
  namespace: 'my',
  state: {
    org_list: [],
    current_org: ''
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
      // let res = yield call(changeCurrentOrg, payload)
      // if(isApiResponseOk(res)) {
      //   const tokenArray = res.data.split('__')
      //   Taro.setStorageSync().set('Authorization', tokenArray[0], {expires: 30, path: ''})
      //   Cookies.set('refreshToken', tokenArray[1], {expires: 30, path: ''})
      //   yield put({
      //     type: 'getUSerInfo',
      //     payload: {
      //       operateType: 'changeOrg',
      //     }
      //   })
      //   yield put({ //重新获取名词方案
      //     type: 'getCurrentNounPlan',
      //     payload: {
      //     }
      //   })
      //
      //   // //组织切换重新加载
      //   // const redirectHash =  locallocation.pathname
      //   // if(locallocation.pathname === '/technological/projectDetail') {
      //   //   redirectHash === '/technological/project'
      //   // }
      //   // yield put(routerRedux.push(`/technological?redirectHash=${redirectHash}`));
      // }else{
      //   message.warn(`${currentNounPlanFilterName(ORGANIZATION)}切换出了点问题`, MESSAGE_DURATION_TIME)
      // }
    },


  },

  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
