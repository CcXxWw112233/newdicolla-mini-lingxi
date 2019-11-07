import Taro from '@tarojs/taro'
import { isApiResponseOk } from "../../utils/request";
import { weChatAuthLogin, weChatPhoneLogin, getAccountInfo, initializeOrganization } from "../../services/login/index";

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
          Taro.navigateTo({ url: `../../pages/phoneNumberLogin/index?user_key=${res.data}` })
        } else {

        }
      }
    },
    // 微信未绑定系统，通过手机号绑定
    * weChatPhoneLogin({ payload }, { select, call, put }) {
      const { parmas } = payload
      const res = yield call(weChatPhoneLogin, parmas)
      if (isApiResponseOk(res)) {
        yield put({
          type: 'handleToken',
          payload: {
            token_string: res.data,
          }
        })

        const query_Id = Taro.getStorageSync('id')
        const boardId = Taro.getStorageSync('board_Id')
        yield put({
          type: 'invitation/userScanCodeJoinOrganization',
          payload: {
            id: query_Id,
            board_Id: boardId,
          }
        })

      } else {
        // 微信已绑定系统，给出提示
        Taro.showToast({
          icon: 'none',
          title: res.message
        })
      }
    },
    //处理token，做相应的页面跳转
    * handleToken({ payload }, { select, call, put }) {

      const token_string = payload.token_string;
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
      const boardId = Taro.getStorageSync('board_Id')

      //日历页面是否需要注入im方法的标识
      const switchTabCurrentPage = 'currentPage_BoardDetail_or_Login'
      Taro.setStorageSync('switchTabCurrentPage', switchTabCurrentPage);

      if (payload.sourcePage === 'Invitation') {
        //邀请加入,未登录 --> 登录成功 --> 重新调用加入组织和项目请求
        const query_Id = Taro.getStorageSync('id')
        yield put({
          type: 'invitation/userScanCodeJoinOrganization',
          payload: {
            id: query_Id,
            board_Id: boardId,
          }
        })
      } else if (payload.sourcePage === 'taksDetails') {
        //从taksDetails页面过来的, 登录后继续去taksDetails页面
        Taro.redirectTo({
          url: `../../pages/taksDetails/index`
        })
      } else if (payload.sourcePage === 'sceneEntrance') {
        //从sceneEntrance页面过来的, 登录后继续去boardDetails页面
        const sceneEntrance_Goto_Other = Taro.getStorageSync('sceneEntrance_Goto_Other')
        //服务消息每日代办进入小程序, 自动切换为全组织,登录成后自动切换 
        const todoListData = Taro.getStorageSync('isTodoList')
        if (sceneEntrance_Goto_Other === 'boardDetail') {
          Promise.resolve(  //再次查询项目有没有失效
            dispatches({
              type: 'board/getBoardDetail',
              payload: {
                id: boardId,
              }
            })
          ).then(res => {
            if (isApiResponseOk(res)) {
              Taro.navigateTo({
                url: `../../pages/boardDetail/index?boardId=${boardId}&push=${payload.sourcePage}`
              })
            }
          })
        }
        else if (todoListData) {
          Promise.resolve(
            dispatches({
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
        } else if (sceneEntrance_Goto_Other === 'errorPage') {  // 其他错误页面
          Taro.navigateTo({
            url: '../../pages/errorPage/index'
          })
        } else {
          Taro.switchTab({ url: `../../pages/calendar/index` })
        }
        Taro.removeStorageSync('sceneEntrance_Goto_Other')
      }
      else {

        Taro.switchTab({ url: `../../pages/calendar/index` })

        yield put({
          type: 'calendar/updateDatas',
          payload: {
            isReachBottom: true,
          }
        })
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
      initImData().catch(e => Taro.showToast({ title: String(e), icon: 'none' }));
    }
  },

  reducers: {
    updateDatas(state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
