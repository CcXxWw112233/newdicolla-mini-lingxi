import Taro from '@tarojs/taro'
import {isApiResponseOk} from "../../utils/request";
import { getOrgBoardList, getScheCardList, getNoScheCardList } from "../../services/calendar/index";
import { select_selected_board, select_selected_timestamp, select_search_text,  } from './selects'

export default {
  namespace: 'calendar',
  state: {
    board_list: [], //项目列表
    selected_board: '0', //当前选择项目，所有项目为0
    selected_timestamp: '', //选择查看时间的时间戳
    search_text: '',
    sche_card_list: [], //项目的所有排期的卡片列表
    no_sche_card_list: [], //项目的所有排期的卡片列表
  },
  effects: {
    // 获取当前组织项目列表
    * getOrgBoardList({ payload }, { select, call, put }) {
      const account_info_string = Taro.getStorageSync('account_info')
      let current_org = '0'
      if(!!account_info_string) {
        const account_info = JSON.parse(account_info_string)
        const { user_set = {} } = account_info
        current_org = user_set['current_org']
      }
      const { page_number = '1', page_size = '100'  } = payload
      const res = yield call(getOrgBoardList, {_organization_id: current_org, page_number, page_size})
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            board_list: res.data
          }
        })
      }else {

      }
    },

    //获取排期卡片列表
    * getScheCardList({ payload }, { select, call, put }) {
      const search_text = yield select(select_search_text)
      const selected_timestamp = yield select(select_selected_timestamp)
      const selected_board = yield select(select_selected_board)
      const params = {
        search_text,
        selected_board,
        selected_timestamp,
        ...payload
      }
      const res = yield call(getScheCardList, params)
      if(isApiResponseOk(res)) {

      }else {

      }
    },

    //获取没有排期卡片列表
    * getNoScheCardList({ payload }, { select, call, put }) {
      const search_text = yield select(select_search_text)
      const selected_timestamp = yield select(select_selected_timestamp)
      const selected_board = yield select(select_selected_board)
      const params = {
        search_text,
        selected_board,
        selected_timestamp,
        ...payload
      }
      const res = yield call(getNoScheCardList, params)
      if(isApiResponseOk(res)) {

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
