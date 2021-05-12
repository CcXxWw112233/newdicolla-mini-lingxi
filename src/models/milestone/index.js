import Taro from '@tarojs/taro'
import { getMilestoneDetail,updateMilestone } from '../../services/milestone/index'
import { isApiResponseOk } from "../../utils/request";

export default {
    namespace: 'milestone',
    state: {
        mileStone_detail: {}, //项目详情
    },
  effects: {
    /**
     * 里程碑详情
     * @param {*} param0 
     * @param {*} param1 
     * @returns 
     */
    * getMilestoneDetail({ payload }, { select, call, put }) {
    let res = yield call(getMilestoneDetail, payload)
    if (isApiResponseOk(res)) {
      yield put({
        type: 'updateDatas',
        payload: {
            mileStone_detail: res.data
        }
      })
      return res || {}
    }
    else {
      if (res.code === 401) { //未登录, 没有权限查看

      } else {
        Taro.showToast({
          title: res.message + '正在为你进行跳转...',
          icon: 'none',
          duration: 2000,
        })
        setTimeout(function () {
          if (res.code === '4041') { //如果项目已删除/归档 就去项目列表
            Taro.switchTab({
              url: `../../pages/boardChat/index`
            })
          } else {  //其他异常
            Taro.switchTab({
              url: '../../pages/calendar/index',
            })
          }
        }, 2000)
      }
    }
  },


  *updateMilestone({ payload }, { select, call, put }) {
  let res = yield call(updateMilestone, payload)
    if (isApiResponseOk(res)) {
      return res 
    } else {
      Taro.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000,
      })
    }
  },

  },

  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
