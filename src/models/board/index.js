import Taro from '@tarojs/taro'
import { getBoardList,getBoardListSearch } from '../../services/board/index'
import {isApiResponseOk} from "../../utils/request";

export default {
  namespace: 'board',
  state: {
    board_list: [], //项目列表
    selectVal:''//输入内容
  },
  effects: {
    //获取项目列表
    * getBoardList({ payload }, { select, call, put }) {
      const account_info_string = Taro.getStorageSync('account_info')
      let current_org = '0'
      if(!!account_info_string) {
        const account_info = JSON.parse(account_info_string)
        const { user_set = {} } = account_info
        current_org = user_set['current_org']
      }

      const { page_number = '1', page_size = '100'  } = payload
      const res = yield call(getBoardList, {_organization_id: current_org, page_number, page_size})
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
    //获取搜索展示列表
    * getSearchShowList({payload},{select,call,put}){
      const account_info_string = Taro.getStorageSync('account_info')
      let current_org=0
      // const selectVal=yield select(selectVal)
      if(!account_info_string) {
        const account_info = JSON.parse(account_info_string)
        const { user_set = {} } = account_info
        current_org = user_set['current_org']
      }
      let {page_number=1,page_size=10, search_term=''}=payload
      let obj={
        _organization_id: current_org,
        page_number,
        page_size,
        search_term
      }
      let res=yield call(getBoardListSearch,obj)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            board_list: res.data
          }
        })
      }
    }
  },

  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
