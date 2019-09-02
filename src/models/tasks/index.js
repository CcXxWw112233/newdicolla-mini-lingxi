import Taro from '@tarojs/taro'
import { getTaskGroupList } from '../../services/tasks/index'
import {isApiResponseOk} from "../../utils/request";

export default {
  namespace: 'tasks',
  state: {
    tasks_list: [], //任务列表
  },
  effects: {
    //获取任务列表
    * getTaskGroupList({ payload }, { select, call, put }) {
      const boardId =  Taro.getStorageSync('board_Id')
      console.log('boardId = ', boardId);
      
      const res = yield call(getTaskGroupList, {board_id: boardId, type: 2, arrange_type: 1})
      console.log(res, '========res');
      
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            tasks_list: res.data
          }
        })
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
