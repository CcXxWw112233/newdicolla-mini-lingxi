import { getBar } from '../../services/testPage'
import {isApiResponseOk} from "../../utils/request";
import { select_number } from '../selects'

export default {
  namespace: 'testPage',
  state: {
    number: 0
  },
  effects: {
    * effectsDemo({ payload }, { select, call, put }) {
      const number = yield select(select_number)
      // console.log({number})
      const res = yield call(getBar, payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload:{
            catogery: res.data
          }
        })
        yield put({
          type: 'board/updateDatas',
          payload:{
            board_id: '888888'
          }
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
