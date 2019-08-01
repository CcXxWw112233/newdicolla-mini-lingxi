import Taro from '@tarojs/taro'
import {isApiResponseOk} from "../../utils/request";
import { qrCodeIsInvitation, userScanCodeJoinBoard, userScanCodeJoinOrganization } from "../../services/invitation/index";

export default {
  namespace: 'invitation',
  state: {
    qrCodeInfo: {},
    },
  effects: {
    //检查二维码是否过期
    * qrCodeIsInvitation({ payload }, { select, call, put }) {
      const res = yield call(qrCodeIsInvitation, payload)
      console.log('res', res)
      console.log('payload', payload)
      if(isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
             qrCodeInfo: res.data,
          },
        })
      }else {

      }
    },

    // 1>用户扫码加入组织
    * userScanCodeJoinOrganization({ payload }, { select, call, put }) {
      const parameterInfo = {
        id: payload.id,
      }
      console.log('parameterInfo:', parameterInfo)
      const res = yield call(userScanCodeJoinOrganization, parameterInfo)
      console.log('res', res)
      if(isApiResponseOk(res)) {
          //2>用户扫码加入项目
          const parameter = {
            board_id: payload.board_Id,
          }
          console.log('parameter:', parameter)
          const res = yield call(userScanCodeJoinBoard, parameter)
          if(isApiResponseOk(res)) {
              Taro.navigateTo({
                url: `../../pages/auccessJoin/index?boardId=${parameter}`
              })
          }else {
    
          }
      }else {

      }
    },

    //用户扫码加入项目
    // * userScanCodeJoinBoard({ payload }, { select, call, put }) {
    //   const pa = {
    //     board_id: payload.id,
    //   }
    //   const res = yield call(userScanCodeJoinBoard, pa)
    //   if(isApiResponseOk(res)) {
    //       Taro.navigateTo({
    //         url: `../../pages/auccessJoin/index?boardId=${payload.id}`
    //       })
    //   }else {

    //   }
    // },
  },

  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
