import Taro from '@tarojs/taro'
import { isApiResponseOk } from "../../utils/request";
import { weChatAuthLogin, weChatPhoneLogin, getAccountInfo, initializeOrganization, getVerifyOrgJurisdiction } from "../../services/login/index";
import { sceneEntrancePages } from '../../services/sceneEntrance/index'


let dispatches
export default {
  namespace: 'login',
  state: {},
  subscriptions: {
    setup({ dispatch }) {
      dispatches = dispatch
    },
  },
  effects: {
    //微信授权登录）
    * weChatAuthLogin({ payload }, { select, call, put }) {
      const parmas = payload.parmas
      const res = yield call(weChatAuthLogin, { ...parmas })
      if (isApiResponseOk(res)) {
        yield put({
          type: 'handleToken',
          payload: {
            token_string: res.data,
            sourcePage: payload.sourcePage,
          }
        })

      } else {
        const res_code = res.code
        if ('4013' == res_code) {
          Taro.navigateTo({ url: `../../pages/phoneNumberLogin/index?user_key=${res.data}&sourcePage=${payload.sourcePage}` })
        } else {

        }
      }
      return res;
    },
    // 微信未绑定系统，通过手机号绑定
    * weChatPhoneLogin({ payload }, { select, call, put }) {
      const { parmas, sourcePage, phoneNumberBind, } = payload
      const res = yield call(weChatPhoneLogin, parmas)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'handleToken',
          payload: {
            token_string: res.data,
            phoneNumberBind,
          }
        })

        if (sourcePage === 'Invitation') {
          const query_Id = Taro.getStorageSync('id')
          const boardId = Taro.getStorageSync('board_Id')
          yield put({
            type: 'invitation/userScanCodeJoinOrganization',
            payload: {
              id: query_Id,
              board_Id: boardId,
            }
          })
        }
      } else {
        // 微信已绑定系统，给出提示
        Taro.showToast({
          icon: 'none',
          title: res.message,
          duration: 2000
        })
      }
    },
    //处理token，做相应的页面跳转
    * handleToken({ payload }, { select, call, put }) {

      const { token_string, phoneNumberBind } = payload;
      const tokenArr = token_string.split('__');
      Taro.setStorageSync('access_token', tokenArr[0]);        //设置token
      Taro.setStorageSync('refresh_token', tokenArr[1]);       //设置refreshToken

      yield put({
        type: 'registerIm'
      })

      yield put({
        type: 'getAccountInfo',
        payload: {}
      })
      const redirectPath = Taro.getStorageSync('redirectPath')
      //日历页面是否需要注入im方法的标识
      const switchTabCurrentPage = 'currentPage_BoardDetail_or_Login'
      Taro.setStorageSync('switchTabCurrentPage', switchTabCurrentPage);

      const pages = getCurrentPages()
      if (redirectPath) {
        Taro.removeStorageSync('redirectPath')
        Taro.navigateTo({
          url: redirectPath,
          fail: function () {
            Taro.switchTab({
              url: redirectPath
            })
          }
        })
        return
      }
      Taro.getStorage({
        key: 'sceneEntrance',
        complete: function (res) {
          console.log(res)
          if (res.data) {
            Taro.redirectTo({
              url: '/pages/sceneEntrance/index?sceneEntrance=' + res.data + '&route=login'
            })
            // this.sceneEntrancePages(res.data)
            // dispatches({
            // type: 'sceneEntrancePages',
            // payload: {
            // show_authorize
            // }
            // })
            // yield call(sceneEntrancePages, JSON.parse(res.data))
          } else {
            var value = Taro.getStorageSync('qrCodeInfo');
            if (value) {
              // Do something with return value
              Taro.reLaunch({
                url: '/pages/acceptInvitation/index?accept=yes'
              })
            } else {
              Taro.switchTab({
                url: `../../pages/calendar/index`
              })
            }
          }
        }
      })


      if (pages.length === 1) {

      } else {
        // if (phoneNumberBind) {
        //   Taro.navigateBack({
        //     delta: 2,
        //   })
        // } else {
        //   Taro.navigateBack({
        //     delta: 1,
        //   })
        // }
      }
    },


    *sceneEntrancePages({ payload }, { select, call, put }) {
      /***
       * redirectType 对象类型 错误页面=0 项目=1 任务=2 会议=3 流程=4 文件=5 每日代办=6
       * contentId 对象id
       * boardId 项目id
       * currentDate 每日代办的日期时间
       */
      const { redirectType, contentId, boardId, currentDate } = payload
      const { globalData: { store: { dispatch } } } = Taro.getApp()
      let pageObject
      let that = this
      if (redirectType === '6') {
        Taro.setStorageSync('isTodoList', currentDate)
        Promise.resolve(
          dispatch({
            type: 'my/changeCurrentOrg',
            payload: {
              _organization_id: '0',
              isTodo: 'todoList',
            }
          })
        ).then(res => {
          if (isApiResponseOk(res)) {
            Taro.switchTab({ url: `../../pages/calendar/index` })
          }
        })
      } else {
        if (redirectType === '0') {  //未知错误
          Taro.setStorageSync('sceneEntrance_Goto_Other', 'errorPage')
          pageObject = 'errorPage'
        } else if (redirectType === '1' || redirectType === '7') {  //1 项目详情  7 公众号
          // 读消息(通知路径/统计未读路径)
          // @通知路径 ： pages/sceneEntrance/index?redirectType=7&boardId=1111111
          // 统计未读路径 ： pages/sceneEntrance/index?redirectType=7&boardId=
          // 进不进具体圈子 看 boardId 是不是空
          if (boardId.match(/^[ ]*$/)) {
            Taro.switchTab({ url: `../../pages/boardChat/index` })
            return
          }
          Taro.setStorageSync('sceneEntrance_Goto_Other', 'chat')
          Taro.setStorageSync('board_Id', boardId)
          Promise.resolve(
            dispatch({
              type: 'im/fetchAllIMTeamList',
              payload: {}
            })
          ).then(() => {
            dispatch({
              type: 'board/getBoardDetail',
              payload: {
                id: boardId,
              }
            }).then(res => {
              if (isApiResponseOk(res)) {
                pageObject = 'chat'
                const { setCurrentBoardId, setCurrentBoard, allBoardList,
                  checkTeamStatus, } = this.props
                const fileIsCurrentBoard = allBoardList.filter((item, index) => {
                  if (item.board_id === boardId) {
                    return item
                  }
                })
                if (fileIsCurrentBoard.length === 0) return
                const { im_id } = fileIsCurrentBoard && fileIsCurrentBoard[0]
                const getCurrentBoard = (arr, id) => {
                  const ret = arr.find(i => i.board_id === id);
                  return ret ? ret : {};
                };
                Promise.resolve(setCurrentBoardId(boardId))
                  .then(() => {
                    setCurrentBoard(getCurrentBoard(allBoardList, boardId))
                  }).then(() => {
                    checkTeamStatus(boardId)
                  }).then(() => {
                    that.validGroupChat({ im_id }, pageObject, contentId)
                  })
                  .catch(e => console.log('error in boardDetail: ' + e));
              }
              return
            })
          })
        } else if (redirectType === '2' || redirectType === '8') {  //2 任务类型 8 日程类型
          pageObject = 'taksDetails'
        } else if (redirectType === '3') { //会议
        } else if (redirectType === '4') { //流程
          pageObject = 'templateDetails'
        } else if (redirectType === '5') {  //文件预览
          Promise.resolve(
            //解决wx.switchTab不能传值
            Taro.setStorageSync('switchTabFileInfo', {
              contentId: contentId,
              boardId: boardId,
              push: 'officialAccount',
            })
          ).then(() => {
            Taro.switchTab({ url: `../../pages/file/index` })
          })
        }
        if (pageObject) {
          Taro.redirectTo({
            url: `../../pages/${pageObject}/index?contentId=${contentId}&boardId=$
    {boardId}&push=sceneEntrance&flag=${redirectType}`
          })
        }
      }
    },
    //获取用户信息
    * getAccountInfo({ payload }, { select, call, put }) {
      const res = yield call(getAccountInfo)

      if (isApiResponseOk(res)) {
        yield put({
          type: 'accountInfo/updateDatas',
          payload: {
            account_info: res.data
          }
        })
        Taro.setStorageSync('account_info', JSON.stringify(res.data))
        //如果没有组织 => 默认初始化一个组织
        //has_org = 1 已有组织, 0 没有组织则初始化一个默认组织
        if (res.data.has_org === '0') {
          const result = yield call(initializeOrganization)
          if (isApiResponseOk(result)) {

          } else {
            Taro.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000
            })
          }
        }
      } else {

      }
    },
    //注入im
    * registerIm({ payload }, { select, call, put }) {
      const initImData = async () => {
        const { account, token } = await dispatches({
          type: 'im/fetchIMAccount'
        });
        await dispatches({
          type: 'im/initNimSDK',
          payload: {
            account,
            token
          }
        });
        return await dispatches({
          type: 'im/fetchAllIMTeamList'
        });
      };
      initImData().catch(e => Taro.showToast({ title: String(e), icon: 'none', duration: 2000 }));
    },




    *verifyOrgAuthority({ payload }, { select, call, put }) {
      const res = yield call(getVerifyOrgJurisdiction, payload)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'updateDatas',
          payload: {
            verify_org_authority_list: res.data
          }
        })
        Taro.setStorageSync('verify_org_authority_list', res.data)
        return res;
      } else {
        console.log('res:', res);
      }
    },
  },

  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
