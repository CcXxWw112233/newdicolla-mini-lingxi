import Taro from '@tarojs/taro'
import { getTaskGroupList, addTask, getTasksDetail, getCardCommentListAll, boardAppRelaMiletones, addComment, checkContentLink, getTaskExecutorsList, getTaskMilestoneList, setTasksRealize, updataTasks, } from '../../services/tasks/index'
import { isApiResponseOk } from "../../utils/request";
import { setBoardIdStorage } from '../../utils/basicFunction'

export default {
  namespace: 'tasks',
  state: {
    tasks_list: [], //任务列表
    tasksDetailDatas: {}, //任务详情
    content_Link: [],  //关联内容
    executors_list: [], //执行人列表 
    milestone_list: [], //获取里程碑列表

  },
  effects: {
    //获取任务列表
    * getTaskGroupList({ payload }, { select, call, put }) {
      const res = yield call(getTaskGroupList, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            tasks_list: res.data
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

    //任务详情
    * getTasksDetail({ payload }, { select, call, put }) {
      const { id, boardId } = payload;
      const res = yield call(getTasksDetail, { id: id })

      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            tasksDetailDatas: res.data,
          }
        }
        )
        setBoardIdStorage(boardId)

        // yield put({
        //   type: 'getCardCommentListAll',
        //   payload: {
        //     id: res.data.card_id
        //   }
        // })

        yield put({
          type: 'checkContentLink',
          payload: {
            board_id: boardId,
            link_id: id,
            link_local: '3',
          }
        })

      } else {
        console.log(res, 'ssss');
        Taro.showToast({
          title: res.message + ' ,正在为你进行跳转...',
          icon: 'none',
          success: function () {
            if (res.code === 401) { //未登录, 没有权限查看

            } else { // code = 1
              setTimeout(function () {
                if (res.code === 4042) {  // 任务已归档/删除
                  Taro.navigateTo({
                    url: `../../pages/boardDetail/index?push=sceneEntrance&&boardId=${boardId}`
                  })
                } else {  //其他异常
                  Taro.reLaunch({
                    url: '../../pages/calendar/index',
                  })
                }
              }, 3000)
            }
          }
        });
      }
    },

    //新增任务
    * addTask({ payload }, { select, call, put }) {
      const res = yield call(addTask, payload)
      if (isApiResponseOk(res)) {

      } else {

      }
    },

    //评论列表
    * getCardCommentListAll({ payload }, { select, call, put }) {
      const res = yield call(getCardCommentListAll, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            // tasksDetailDatas: res.data
          }
        })
      } else {

      }
    },

    //新增评论
    * addComment({ payload }, { select, call, put }) {
      const res = yield call(addComment, payload)
      if (isApiResponseOk(res)) {

        yield call(getCardCommentListAll, payload)

      } else {

      }
    },

    //任务, 日程， 节点数据关联里程碑
    * boardAppRelaMiletones({ payload }, { select, call, put }) {
      const { parmas } = payload
      const res = yield call(boardAppRelaMiletones, parmas)
      if (isApiResponseOk(res)) {

      } else {

      }
    },

    //查看关联内容
    * checkContentLink({ payload }, { select, call, put }) {
      const res = yield call(checkContentLink, payload)

      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            content_Link: res.data
          }
        })
      } else {

      }
    },
    //执行人列表
    * getTaskExecutorsList({ payload }, { select, call, put }) {
      const { board_id } = payload
      const res = yield call(getTaskExecutorsList, { board_id: board_id })
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            executors_list: res.data
          }
        })
      } else {

      }
    },

    //获取里程碑列表
    * getTaskMilestoneList({ payload }, { select, call, put }) {
      const { board_id } = payload
      const res = yield call(getTaskMilestoneList, { id: board_id })
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            milestone_list: res.data
          }
        })
      } else {

      }
    },

    //完成/未任务
    * setTasksRealize({ payload }, { select, call, put }) {
      const res = yield call(setTasksRealize, payload)
      if (isApiResponseOk(res)) {

      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },

    //更新任务
    * updataTasks({ payload }, { select, call, put }) {
      const res = yield call(updataTasks, payload)
      if (isApiResponseOk(res)) {

      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
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
