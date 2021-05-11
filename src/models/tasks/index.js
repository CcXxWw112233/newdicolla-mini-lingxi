import Taro from '@tarojs/taro'
import { getTaskGroupList, addTask, getTasksDetail,putBoardtaskGroup,deleteTaskGroup, getCardCommentListAll, boardAppRelaMiletones, addComment, checkContentLink, getTaskExecutorsList, getTaskMilestoneList, setTasksRealize, updataTasks, putCardBaseInfo, getLabelList, postCardLabel, deleteCardLabel, getCardList, deleteCardExecutor, addCardExecutor, deleteAppRelaMiletones, deleteCard, deleteCardAttachment, deleteCardProperty, getBoardFieldGroupList, putBoardFieldRelation, deleteBoardFieldRelation, postBoardFieldRelation, postV2Card, getCardProperties, postCardProperty, deleteFileFieldsFileRemove, deleteTask, getRoleList } from '../../services/tasks/index'
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
    field_selection_list: [], //字段选择list
    field_selection_group_list: [], //字段分组选择list
    properties_list: [], //任务属性列表
    choice_image_temp_file_paths: '', //选择文件上传保存在本地的路径
    song_task_id: '', //子任务id/属性id
    tasks_upload_file_type: '', //上传类型,(子任务, 任务描述),
    roleOrOwnAuth: false,
    canEditRoleList: [],
    canEditpersonageList: [],
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
        })
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
        const account_info = JSON.parse(Taro.getStorageSync('account_info'));
        if (res.data.privileges && res.data.privileges.length > 0) {
          
          var canEditpersonageList = res.data.privileges.filter(function (value) {
            return (value.user_info && value.user_info.id) == account_info.id && (value.content_privilege_code == 'edit');
          })
          yield put({
            type: 'updateDatas',
            payload: {
              canEditpersonageList: canEditpersonageList,
            }
          })
        }

        const res1 = yield call(getRoleList,
          {
            board_id: res.data.board_id,
            id: res.data.board_id,
          });

        if (isApiResponseOk(res1)) {
          var list = res1.data.data.filter(function (value) {
            return value.user_id == account_info.id;
          })
          if (list && list.length > 0 && res.data.privileges && res.data.privileges.length > 0) {
            var canEditRoleList = res.data.privileges.filter(function (value) {
              return (value.role_info && value.role_info.id) == list[0].role_id && (value.
                content_privilege_code == 'edit');
            })

            yield put({
              type: 'updateDatas',
              payload: {
                canEditRoleList: canEditRoleList,
              }
            })
          }

        } else {
        }

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
    //删除任务
    * deleteTask({ payload }, { select, call, put }) {
      const res = yield call(deleteTask, payload)
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
      const { callBack } = payload
      const res = yield call(boardAppRelaMiletones, payload)
      if (isApiResponseOk(res)) {
        if (typeof callBack == 'function') callBack()
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
      const { callBack } = payload
      const res = yield call(deleteAppRelaMiletones, payload)
      if (isApiResponseOk(res)) {
        if (typeof callBack == 'function') callBack()
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
      return res || {}
    },

    //删除执行人
    * deleteCardExecutor({ payload }, { select, call, put }) {
      const { callBack } = payload
      const res = yield call(deleteCardExecutor, payload)
      if (isApiResponseOk(res)) {
        if (typeof callBack == 'function') callBack()
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
      const { callBack } = payload
      const res = yield call(addCardExecutor, payload)
      if (isApiResponseOk(res)) {
        if (typeof callBack == 'function') callBack()
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
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
      return res || {}
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

    //修改任务
    * putCardBaseInfo({ payload }, { select, call, put }) {
      const { card_id, card_name, name, due_time, list_id, calback, start_time, description} = payload;
      const res = yield call(putCardBaseInfo, { id: card_id, card_name: card_name, name: name, due_time: due_time, list_id: list_id, start_time: start_time,description })

      if (isApiResponseOk(res)) {
        if (typeof calback == 'function') calback()
      }
      else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
      return res || {}
    },


    //删除任务
    * deleteCard({ payload }, { select, call, put }) {
      const { callBack } = payload
      const res = yield call(deleteCard, payload)
      if (isApiResponseOk(res)) {
        if (typeof callBack == 'function') callBack()
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },
    // 添加任务分组
    *putBoardtaskGroup({ payload }, { select, call, put }) {
      const { callBack } = payload
      const res = yield call(putBoardtaskGroup, payload)
      if (isApiResponseOk(res)) {
        if (typeof callBack == 'function') callBack()
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },
    //删除任务分组
    *deleteTaskGroup({ payload }, { select, call, put }) {
      const { callBack } = payload
      const res = yield call(deleteTaskGroup, payload)
      if (isApiResponseOk(res)) {
        if (typeof callBack == 'function') callBack()
      } else {
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
      const { callBack } = payload
      const res = yield call(postCardLabel, payload)
      if (isApiResponseOk(res)) {
        if (typeof callBack == 'function') callBack()
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
      const { callBack } = payload
      const res = yield call(deleteCardLabel, payload)
      if (isApiResponseOk(res)) {
        if (typeof callBack == 'function') callBack()
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },

    //删除子任务交付物
    * deleteCardAttachment({ payload }, { select, call, put }) {
      const { card_id, attachment_id, calback } = payload
      const res = yield call(deleteCardAttachment, payload)
      if (isApiResponseOk(res)) {
        if (typeof calback == 'function') calback()
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
      return res || {}
    },


    //删除任务自定义字段
    * deleteCardProperty({ payload }, { select, call, put }) {
      const { callBack, } = payload
      const res = yield call(deleteCardProperty, payload)
      if (isApiResponseOk(res)) {
        if (typeof callBack == 'function') callBack()
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },

    //获取自定义字段列表
    * getBoardFieldGroupList({ payload }, { select, call, put }) {
      const res = yield call(getBoardFieldGroupList, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            field_selection_list: res.data.fields,
            field_selection_group_list: res.data.groups,
          }
        })
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }

      return res || {}
    },

    //自定义字段单选
    * putBoardFieldRelation({ payload }, { select, call, put }) {
      const { callBack } = payload
      const res = yield call(putBoardFieldRelation, payload)
      if (isApiResponseOk(res)) {
        if (typeof callBack == 'function') callBack()
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },

    //自定义字段删除
    * deleteBoardFieldRelation({ payload }, { select, call, put }) {
      const { callBack } = payload
      const res = yield call(deleteBoardFieldRelation, payload)
      if (isApiResponseOk(res)) {
        if (typeof callBack == 'function') callBack()
      } else {

        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },

    //自定义字段增加
    * postBoardFieldRelation({ payload }, { select, call, put }) {
      const { relation_id } = payload
      const res = yield call(postBoardFieldRelation, payload)
      if (isApiResponseOk(res)) {
        // if (typeof callBack == 'function') callBack()
        yield call(getTasksDetail, { id: relation_id })
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },

    //创建子任务
    * postV2Card({ payload }, { select, call, put }) {
      const res = yield call(postV2Card, payload)
      if (isApiResponseOk(res)) {
        if (res.code != 0) {
          Taro.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
        }
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }

      return res || {}
    },

    //获取任务属性
    * getCardProperties({ payload }, { select, call, put }) {

      // const { callBack } = payload

      const res = yield call(getCardProperties, {})

      if (isApiResponseOk(res)) {

        yield put({
          type: 'updateDatas',
          payload: {
            properties_list: res.data
          }
        })

        // if (typeof callBack == 'function') callBack()

      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },

    //添加任务属性
    * postCardProperty({ payload }, { select, call, put }) {
      const { callBack } = payload
      const res = yield call(postCardProperty, payload)
      if (isApiResponseOk(res)) {
        if (typeof callBack == 'function') callBack()
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },

    //自定义字段删除文件字段的文件
    * deleteFileFieldsFileRemove({ payload }, { select, call, put }) {
      const { callBack } = payload
      const res = yield call(deleteFileFieldsFileRemove, payload)
      if (isApiResponseOk(res)) {
        if (typeof callBack == 'function') callBack()
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
      return res || {}
    },


  },
  
  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
