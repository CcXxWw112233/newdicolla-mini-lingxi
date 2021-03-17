import Taro from '@tarojs/taro'
import { isApiResponseOk } from "../../utils/request";
import { qrCodeIsInvitation, userScanCodeJoinOrganization, commInviteQRCodejoin } from "../../services/invitation/index";
import { NODE_ENV } from '../../gloalSet/js/constant';

export default {
  namespace: 'invitation',
  state: {
    qrCodeInfo: {},  //扫描小程序码返回的信息
  },
  effects: {
    //检查二维码是否过期
    * qrCodeIsInvitation({ payload }, { select, call, put }) {
      const res = yield call(qrCodeIsInvitation, payload)
      if (res.code === '1') {  // 1.过期 0.有效
        Taro.reLaunch(
          {
            url: '../../pages/qrCodeInvalid/index'
          }
        )
        return false
      }
      else {
        yield put({
          type: 'updateDatas',
          payload: {
            qrCodeInfo: res.data || {},
          },
        })
        const value = Taro.getStorageSync('qrCodeInfo');
        const query_Id = Taro.getStorageSync('id');
        const boardId = Taro.getStorageSync('board_Id');
        if (res.data.has_join) {
          Taro.removeStorageSync('qrCodeInfo')
        } else if (value && !res.data.has_join) {
          yield put({
            type: 'userScanCodeJoinOrganization',
            payload: {
              id: query_Id,
              relaId: value.rela_id,
              relaType: value.rela_type,
              pageRoute: 'acceptInvitation',
            }
          })
          Taro.removeStorageSync('qrCodeInfo')
          yield put({
            type: 'calendar/updateDatas',
            payload: {
              is_mask_show_Updatename: true
            }
          })
        }
        Taro.setStorageSync('qrCodeInfo', res.data)

        return res.data
      }
    },

    //2>用户扫码加入项目
    * commInviteQRCodejoin({ payload }, { select, call, put }) {
      const { id, relaId, relaType, pageRoute, role_id } = payload
      const joinData = {
        id: id,
        role_id: role_id,
      }
      const res = yield call(commInviteQRCodejoin, joinData)
      Taro.removeStorageSync('qrCodeInfo')

      if (isApiResponseOk(res)) {
        Taro.showToast({
          title: '加入成功, 正在为你跳转...',
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          if (["1", "2", "12"].indexOf(relaType) != -1) {  //项目
            Taro.navigateTo({
              url: `../../pages/auccessJoin/index?boardId=${relaId}&pageRoute=${pageRoute}`
            })
          }
          else if (["3", "4", "5"].indexOf(relaType) != -1) {  //任务
            Taro.navigateTo({
              url: `../../pages/taksDetails/index?flag=${'0'}&contentId=${relaId}&back_icon=arrow_icon`
            })
          }
          // else if (["11",].indexOf(relaType) != -1) {  //组织
          // }
          // else if (["6", "7", "8"].indexOf(relaType) != -1) {  //流程
          // }
          // else if (["9", "10"].indexOf(relaType) != -1) {  //文件
          // }
          else {
            Taro.switchTab({
              url: `../../pages/calendar/index`
            })
          }
        }, 2000);
      }
      else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    },

    // 1>用户扫码加入组织
    * userScanCodeJoinOrganization({ payload }, { select, call, put }) {
      const { id, relaId, relaType, pageRoute, } = payload
      const parameterInfo = {
        id: id,
      }
      const res = yield call(userScanCodeJoinOrganization, parameterInfo)
      const joinBoardData = {
        id,
        relaId,
        relaType,
        pageRoute,
        role_id: res.data.role_id,
      }
      if (isApiResponseOk(res)) {
        yield put({
          type: 'commInviteQRCodejoin',
          payload: {
            ...joinBoardData
          }
        })
      } else {
        Taro.showToast({
          title: '还未登录, 请先登录',
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
