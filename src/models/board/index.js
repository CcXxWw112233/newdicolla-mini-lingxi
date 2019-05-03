import { getBar } from '../../services/testPage'
import {isApiResponseOk} from "../../utils/request";

export default {
  namespace: 'board',
  state: {
    board_id: '00000'
  },
  effects: {
    * effectsDemo({ payload }, { select, call, put }) {

    },
  },

  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
