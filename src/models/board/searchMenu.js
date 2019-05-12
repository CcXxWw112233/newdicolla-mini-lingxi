import Taro from '@tarojs/taro'
import { getBoardList } from '../../services/board/index'
import {isApiResponseOk} from "../../utils/request";

export default {
  namespace: 'searchMenu',
  state: {
    search_mask_show: '0', // 0 1 2 默认 淡入 淡出
  },
  effects: {

  },

  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
