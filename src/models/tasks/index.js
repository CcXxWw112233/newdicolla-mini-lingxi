import Taro from '@tarojs/taro'
import { getTaskGroupList, addTask, getTasksDetail, getCardCommentListAll, boardAppRelaMiletones, addComment, checkContentLink, getTaskExecutorsList, getTaskMilestoneList, setTasksRealize, updataTasks, putCardBaseInfo, getLabelList, postCardLabel, deleteCardLabel, getCardList, deleteCardExecutor, addCardExecutor, deleteAppRelaMiletones, } from '../../services/tasks/index'
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
    isPermission: true, //是否有权限更改
    label_list: [], // 标签列表
    group_list: [], //任务分组
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
        if (res.code === 401) { //未登录, 没有权限查看

        } else {
          Taro.showToast({
            title: res.message + '正在为你进行跳转...',
            icon: 'none',
            duration: 2000,
          })
          setTimeout(function () {
            if (res.code === '4041') { //如果任务已删除/归档 就去任务列表(首页)

            } else {  //其他异常
              Taro.switchTab({
                url: '../../pages/calendar/index',
              })
            }
          }, 2000)
        }
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
      const res = yield call(boardAppRelaMiletones, payload)
      if (isApiResponseOk(res)) {
        yield call(getTasksDetail, { id: payload.id })
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },


    //任务, 日程， 节点数据 删除里程碑
    * deleteAppRelaMiletones({ payload }, { select, call, put }) {
      const res = yield call(deleteAppRelaMiletones, payload)
      if (isApiResponseOk(res)) {
        yield call(getTasksDetail, { payload })
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
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
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
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
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },

    //删除执行人
    * deleteCardExecutor({ payload }, { select, call, put }) {
      const res = yield call(deleteCardExecutor, payload)
      if (isApiResponseOk(res)) {
        yield call(getTasksDetail, { id: payload.card_id })
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },

    //添加执行人
    * addCardExecutor({ payload }, { select, call, put }) {
      const res = yield call(addCardExecutor, payload)
      if (isApiResponseOk(res)) {
        yield call(getTasksDetail, { id: payload.card_id })
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
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },

    //完成/未任务
    * setTasksRealize({ payload }, { select, call, put }) {
      const res = yield call(setTasksRealize, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            isPermission: true
          }
        })
      } else {
        yield put({
          type: 'updateDatas',
          payload: {
            isPermission: false
          }
        })
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

    //修改任务名称
    * putCardBaseInfo({ payload }, { select, call, put }) {
      const { card_id, card_name, name, due_time } = payload;
      const res = yield call(putCardBaseInfo, { id: card_id, card_name: card_name, name: name, due_time: due_time, })

      if (isApiResponseOk(res)) {

        yield call(getTasksDetail, { id: card_id })
      }
      else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },


    //标签列表
    * getLabelList({ payload }, { select, call, put }) {
      const res = yield call(getLabelList, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            label_list: res.data
          }
        })
      }
      else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },


    //新增标签
    * postCardLabel({ payload }, { select, call, put }) {
      const res = yield call(postCardLabel, payload)
      if (isApiResponseOk(res)) {
        yield call(getTasksDetail, { id: card_id })
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },

    //删除标签
    * deleteCardLabel({ payload }, { select, call, put }) {
      const res = yield call(deleteCardLabel, payload)
      if (isApiResponseOk(res)) {
        yield call(getTasksDetail, { id: card_id })
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },


    //任务分组列表
    * getCardList({ payload }, { select, call, put }) {
      const res = yield call(getCardList, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            group_list: res.data
          }
        })
      }
      else {
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
