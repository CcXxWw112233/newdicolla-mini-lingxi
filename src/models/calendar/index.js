import Taro from "@tarojs/taro";
import { isApiResponseOk } from "../../utils/request";
import {
  getOrgBoardList,
  getScheCardList,
  getNoScheCardList,
  getSignList,
  getMeetingTodoList,
  getUserAllOrgsAllBoards
} from "../../services/calendar/index";
import {
  select_selected_board,
  select_selected_timestamp,
  select_search_text,
  select_page_number,
  select_sche_card_list,
  select_is_reach_bottom
} from "./selects";
import { getCurrentOrgByStorage } from "../../utils/basicFunction";

export default {
  namespace: "calendar",
  state: {
    board_list: [], //项目列表
    selected_board: "0", //当前选择项目，所有项目为0
    selected_board_name: "所有参与的项目",
    selected_timestamp: new Date().getTime(), //选择查看时间的时间戳
    search_text: "",
    sche_card_list: [], //项目的所有排期的卡片列表
    no_sche_card_list: [], //项目的所有排期的卡片列表
    sign_data: [], //日历列表打点数据
    page_number: 1, //默认第1页
    isReachBottom: true, //是否上拉加载分页
    isOtherPageBack: false //当前日历页面是首页加载还是其他页面返回来的标识
  },
  effects: {
    // 获取当前组织项目列表
    *getOrgBoardList({ payload }, { select, call, put }) {
      const account_info_string = Taro.getStorageSync("account_info");
      // const current_org = getCurrentOrgByStorage()
      const current_org = "0";
      const { page_number = "1", page_size = "100" } = payload;
      const res = yield call(getOrgBoardList, {
        _organization_id: current_org,
        page_number,
        page_size
      });

      if (isApiResponseOk(res)) {
        yield put({
          type: "updateDatas",
          payload: {
            board_list: res.data
          }
        });
      } else {
      }
    },

    //获取排期卡片列表
    *getScheCardList({ payload }, { select, call, put }) {
      const selected_timestamp = yield select(select_selected_timestamp);
      const selected_board = yield select(select_selected_board);
      // const current_org = getCurrentOrgByStorage()
      const current_org = "0";
      const page_number = yield select(select_page_number);
      let typeSource = payload["type"];

      const obj = {
        current_org,
        selected_board,
        selected_timestamp,
        ...payload
      };
      //保证和获取最新的参数
      const date = new Date(obj["selected_timestamp"]);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const date_no = date.getDate();
      const start_time =
        new Date(`${year}/${month}/${date_no} 00:00:00`).getTime() / 1000;
      const due_time =
        new Date(`${year}/${month}/${date_no} 23:59:59`).getTime() / 1000;
      const params = {
        _organization_id: obj["current_org"],
        board_id: obj["selected_board"],
        queryDate: start_time,
        maxDate: due_time,
        page_number: page_number,
        ...payload
      };
      const res = yield call(getScheCardList, { ...params });
      const current_sche_card_list = yield select(select_sche_card_list);

      if (isApiResponseOk(res)) {
        if (typeSource === 1) {
          //处理上拉加载
          let arr1 = current_sche_card_list; //1.1>从data获取当前datalist数组
          let arr2 = res.data; //1.2>从此次请求返回的数据中获取新数组
          arr1 = arr1.concat(arr2); //1.3>合并数组
          yield put({
            type: "updateDatas",
            payload: {
              sche_card_list: arr1
            }
          });
          if (res.data && res.data.length === 0) {
            yield put({
              type: "updateDatas",
              payload: {
                isReachBottom: false
              }
            });
          }
        } else {
          yield put({
            type: "updateDatas",
            payload: {
              sche_card_list: res.data
            }
          });
        }
      } else {
        yield put({
          type: "updateDatas",
          payload: {
            isReachBottom: false
          }
        });
      }
    },

    //获取没有排期卡片列表
    *getNoScheCardList({ payload }, { select, call, put }) {
      // const current_org = getCurrentOrgByStorage()
      const current_org = "0";
      const selected_board = yield select(select_selected_board);

      const res = yield call(getNoScheCardList, {
        _organization_id: current_org,
        board_id: selected_board,
        page_size: "200",
        page_number: "1"
      });
      if (isApiResponseOk(res)) {
        yield put({
          type: "updateDatas",
          payload: {
            no_sche_card_list: res.data
          }
        });
      } else {
      }
    },

    //获取打点列表
    *getSignList({ payload }, { select, call, put }) {
      let selected_timestamp = payload["selected_timestamp"];
      if (!selected_timestamp) {
        selected_timestamp = yield select(select_selected_timestamp);
      }

      const date = new Date(selected_timestamp);
      const year_ = date.getFullYear();
      const month_ = date.getMonth() + 1;
      const month = month_ < 10 ? `0${month_}` : month_;
      // const current_org = getCurrentOrgByStorage()
      const current_org = "0";
      const selected_board = yield select(select_selected_board);
      const res = yield call(getSignList, {
        _organization_id: current_org,
        board_id: selected_board,
        month: `${year_}-${month}`
      });

      if (isApiResponseOk(res)) {
        yield put({
          type: "updateDatas",
          payload: {
            sign_data: res.data
          }
        });
      } else {
      }
    },

    // 获取会议列表
    *getMeetingTodoList({ payload }, { select, call, put }) {
      const current_org = "0";
      const selected_board = yield select(select_selected_board);
      const res = yield call(getMeetingTodoList, {
        org_id: current_org,
        board_id: selected_board,
        query_time: String(payload.query_time)
      });
      if (isApiResponseOk(res)) {
        let data = res.data;
        data = data.map(item => {
          let new_item = { ...item };
          new_item.flag = "meeting";
          return new_item;
        });
        yield put({
          type: "updateDatas",
          payload: {
            meeting_list: data
          }
        });
      }
    },

    // 获取用户下所有组织Id及项目Id
    *getUserAllOrgsAllBoards({ payload }, { select, call, put }) {
      // const current_org = getCurrentOrgByStorage()
      const current_org = "0"; //小程序默认为全组织, 不能切换其他组织
      const res = yield call(getUserAllOrgsAllBoards, {
        _organization_id: current_org
      });
      if (isApiResponseOk(res)) {
        Taro.setStorageSync("userAllOrgsAllBoards", JSON.stringify(res.data));
      } else {
      }
    }
  },

  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    }
  }
};
