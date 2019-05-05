import { getBar } from '../../services/testPage'
import {isApiResponseOk} from "../../utils/request";

export default {
  namespace: 'authorize',
  state: {
    show_authorize: false, //是否显示微信授权登陆弹框弹框
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
