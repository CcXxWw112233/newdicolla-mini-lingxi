import Taro from '@tarojs/taro'
import { isApiResponseOk } from "../../utils/request";
import { qrCodeIsInvitation, userScanCodeJoinBoard, userScanCodeJoinOrganization, commInviteQRCodejoin } from "../../services/invitation/index";

export default {
  namespace: 'invitation',
  state: {
    qrCodeInfo: {},
  },
  effects: {
    //检查二维码是否过期
    * qrCodeIsInvitation({ payload }, { select, call, put }) {
      const res = yield call(qrCodeIsInvitation, payload)
      // if(isApiResponseOk(res)) {
      if (res.code === '1') {  // 1.过期 0.有效
        Taro.reLaunch(
          {
            url: '../../pages/qrCodeInvalid/index'
          }
        )
      }
      else {
        yield put({
          type: 'updateDatas',
          payload: {
            qrCodeInfo: res.data || {},
          },
        })
      }
      // }else {

      // }
    },

    // 1>用户扫码加入组织
    * userScanCodeJoinOrganization({ payload }, { select, call, put }) {
      const parameterInfo = {
        id: payload.id,
      }
      const res = yield call(userScanCodeJoinOrganization, parameterInfo)
      if (isApiResponseOk(res)) {
        //2>用户扫码加入项目
        const parameter = {
          id: payload.id,
        }


        const result = yield call(commInviteQRCodejoin, { id: payload.id, role_id: res.data.role_id })
        if (isApiResponseOk(result)) {

        }
        else {

        }

        const returnResult = yield call(userScanCodeJoinBoard, parameter)
        if (isApiResponseOk(returnResult)) {
          Taro.navigateTo({
            url: `../../pages/auccessJoin/index?boardId=${parameter}&&pageRoute=${payload.pageRoute}`
          })
        } else {

        }
      } else {

      }
    },
  },

  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
