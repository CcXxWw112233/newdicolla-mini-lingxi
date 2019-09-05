import Taro from '@tarojs/taro'
import { getTaskGroupList, addTask, getTasksDetail, getCardCommentListAll, boardAppRelaMiletones, addComment } from '../../services/tasks/index'
import {isApiResponseOk} from "../../utils/request";

export default {
  namespace: 'tasks',
  state: {
    tasks_list: [], //任务列表
    tasksDetailDatas: {} //任务详情
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

    //任务详情
    * getTasksDetail({ payload }, { select, call, put }) {
      const res = yield call(getTasksDetail, payload)
      console.log('tasksDetailDatas, ', res.data);
      
      if(isApiResponseOk(res)) {
        yield put({
          type: 'getCardCommentListAll',
          payload: {
            tasksDetailDatas: res.data
          }
        })
        
      }else {

      }
    },

    //新增任务
    * addTask({ payload }, { select, call, put }) {
      const { parmas } = payload
      const res = yield call(addTask, parmas)
      console.log('res = ', res);
      
      if(isApiResponseOk(res)) {
       
      }else {
        
      }
    },

    //评论列表
    * getCardCommentListAll({ payload }, { select, call, put }) {
      const res = yield call(getCardCommentListAll, payload)
      console.log('res = 评论列表', res);
      
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            tasksDetailDatas: res.data
          }
        })
      }else {
        
      }
    },

    //新增评论
    * addComment({ payload }, { select, call, put }) {
      console.log(payload, 'payload');
      const res = yield call(addComment, payload)
      console.log('res = 新增评论:', res);
      
      if(isApiResponseOk(res)) {

        yield call(getCardCommentListAll, payload)
        
      }else {
        
      }
    },

    //任务, 日程， 节点数据关联里程碑
    * boardAppRelaMiletones({ payload }, { select, call, put }) {
      const { parmas } = payload
      const res = yield call(boardAppRelaMiletones, parmas)
      console.log('res = ', res);
      
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
