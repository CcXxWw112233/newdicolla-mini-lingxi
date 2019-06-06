import Taro from '@tarojs/taro'
import { getBoardList } from '../../services/board/index'
import {isApiResponseOk} from "../../utils/request";
import { select_board_list } from '../selects'
export default {
  namespace: 'board',
  state: {
    board_list: [], //项目列表
    page_size: 6,
  },
  effects: {
    //获取项目列表
    * getBoardList({ payload }, { select, call, put }) {
      const board_list = yield select(select_board_list)
      console.log(board_list)
      const account_info_string = Taro.getStorageSync('account_info')
      let current_org = '0'
      if(!!account_info_string) {
        const account_info = JSON.parse(account_info_string)
        const { user_set = {} } = account_info
        current_org = user_set['current_org']
      }
      const { page_number = '1', page_size = '100' } = payload
      const res = yield call(getBoardList, {_organization_id: current_org, page_number, page_size})
      console.log(res)
      if(isApiResponseOk(res)) {
        const new_board_list = [].concat(board_list, res.data)
        yield put({
          type: 'updateDatas',
          payload: {
            board_list: new_board_list,
            curent_page_number_total: res.data.length > 0 ? res.data.length : 0, // 每次请求获取当前的条数
          }
        })
      }else {

      }
    },
  },

  reducers: {
    updateDatas(state, { payload }) {
      console.log(payload)
      return { ...state, ...payload };
      // return {
      //   ...state,
      //   board_list: [...state.board_list, ...payload.board_list],
      //   curent_page_number_total: payload.curent_page_number_total
      // }
    },
  },

};
