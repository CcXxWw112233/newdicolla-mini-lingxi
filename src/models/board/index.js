import Taro from '@tarojs/taro'
import { getBoardList, getBoardDetail, v2BoardList, } from '../../services/board/index'
import { isApiResponseOk } from "../../utils/request";

export default {
  namespace: 'board',
  state: {
    board_list: [], //项目列表
    board_detail: {}, //项目详情
    v2_board_list: [],  //文件页面项目列表
  },
  effects: {
    //获取项目列表
    * getBoardList({ payload }, { select, call, put }) {
      // const account_info_string = Taro.getStorageSync('account_info')
      let current_org = '0'
      // if (!!account_info_string) {
      //   const account_info = JSON.parse(account_info_string)
      //   const { user_set = {} } = account_info
      //   current_org = user_set['current_org']
      // }
      const { page_number = '1', page_size = '100' } = payload
      const res = yield call(getBoardList, { _organization_id: current_org, page_number, page_size })

      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            board_list: res.data
          }
        })
      } else {

      }
    },

    * getProjectList({ payload }, { select, call, put }) {
      let res = yield call(getProjectList, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            projectList: res.data
          }
        })
      } else {

      }
    },

    * getBoardDetail({ payload }, { select, call, put }) {
      let res = yield call(getBoardDetail, payload)

      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            board_detail: res.data
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
              Taro.redirectTo({
                url: `../../pages/boardChat/index`
              })
            } else {  //其他异常
              Taro.redirectTo({
                url: '../../pages/calendar/index',
              })
            }
          }, 2000)
        }
      }
    },

    * v2BoardList({ payload }, { select, call, put }) {
      let res = yield call(v2BoardList, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            v2_board_list: res.data
          }
        })
      }
      else {
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
