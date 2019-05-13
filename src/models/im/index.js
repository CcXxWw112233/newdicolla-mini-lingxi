import Taro from '@tarojs/taro';
import { INITIAL_STATE } from './initialState';
import initNimSDK from './initNimSDK';
import { isPlainObject } from './../../utils/util';
import { selectFieldsFromIm } from './selectFields';
import { getAllIMTeamList, getIMAccount } from './../../services/im/index';
import { isApiResponseOk } from './../../utils/request';
import { onMsg } from './actions/index';

export default {
  namespace: 'im',
  state: INITIAL_STATE,
  effects: {
    *fetchIMAccount({}, { call }) {
      const res = yield call(getIMAccount);

      if (isApiResponseOk(res)) {
        const { accid, token } = res.data;
        return {
          account: accid,
          token
        };
      }
    },
    *fetchAllIMTeamList({}, { put, call }) {
      const res = yield call(getAllIMTeamList);
      if (isApiResponseOk(res)) {
        const { data } = res;
        //这里应该是会拿到当前用户的全部组织的所有项目群组数据，
        //但是目前还混有其他数据，所以这里过滤一下
        const filteredAllBoardList = (arr = []) =>
          arr.filter(i => i.type && i.type === '2');

        yield put({
          type: 'updateStateFieldByCover',
          payload: {
            allBoardList: filteredAllBoardList(data)
          },
          desc: 'get all team list.'
        });
      }
    },
    *initNimSDK({ payload }, { select, put }) {
      const { account, token } = payload;

      const { nim } = yield selectFieldsFromIm(select, 'nim');

      if (nim) {
        nim.disconnect();
      }
      const nimInstance = yield initNimSDK({ account, token });

      yield put({
        type: 'updateStateFieldByCover',
        payload: {
          nim: nimInstance
        }
      });
    },
    *updateCurrentChatUnreadNewsState({ payload }, { select }) {
      const { im_id } = payload;
      const { nim } = yield selectFieldsFromIm(select, 'nim');
      if (nim) {
        nim.resetSessionUnread(im_id);
      }
    },
    *sendMsg({ payload }, { select }) {
      const { scene, to, text } = payload;
      const { nim } = yield selectFieldsFromIm(select, 'nim');
      function onSendMsgDone(error, msg) {
        if (error) {
          // 被拉黑
          if (error.code === 7101) {
            msg.status = 'success';
            alert(error.message);
          } else {
            Taro.showToast({
              title: `发送消息失败: ${String(error)}`,
              icon: 'none'
            });
          }
          return;
        }
        msg.status = 'success';
        onMsg(msg);
      }
      nim.sendText({
        scene,
        to,
        text,
        // needMsgReceipt: obj.needMsgReceipt || false
        needMsgReceipt: false,
        done: (error, msg) => {
          onSendMsgDone(error, msg);
        }
      });
    }
  },
  reducers: {
    //当拿不到 redux store 数据的时候， 可以通过回调的方式，拿到当前 model 的 state
    //因为已经将 store 实例挂载到了 小程序 app 实例 的 globalData 属性上，
    //所以可以通过 Taro.getApp() 拿到 小程序 app 实例， 也就 可以通过 globalData - store - getState()
    //获取到 store 的数据
    handleDependOnState(state, { callback }) {
      if (callback && typeof callback === 'function') {
        callback(state);
      }
      return state;
    },
    updateStateByReplace(state, { state: newState }) {
      //这个model 的 state 是一个 object,
      if (newState && isPlainObject(newState)) {
        return newState;
      }
      //如果试图用其他类型的 state 替换，返回原来的 state
      return state;
    },
    updateStateFieldByCover(state, { payload, callback }) {
      if (callback && typeof callback === 'function') {
        callback(state);
      }
      if (payload && isPlainObject(payload)) {
        return { ...state, ...payload };
      }
      return state;
    },
    updateStateFieldByExtension(state, { payload, callback }) {
      if (callback && typeof callback === 'function') {
        callback(state);
      }

      const updatedFields = Object.keys(payload).reduce((acc, curr) => {
        const getCurrValue = (stateFieldValue, currFieldValue) => {
          //如果都是对象的话，那么就合并属性
          if (isPlainObject(stateFieldValue) && isPlainObject(currFieldValue)) {
            return { ...stateFieldValue, ...currFieldValue };
          }
          //如果都是数组的话，那么也合并属性
          if (Array.isArray(stateFieldValue) && Array.isArray(currFieldValue)) {
            return [...stateFieldValue, ...currFieldValue];
          }
          //其他情况，直接替换
          return currFieldValue;
        };
        return Object.assign({}, acc, {
          [curr]: getCurrValue(state[curr], payload[curr])
        });
      }, {});
      return { ...state, ...updatedFields };
    }
  }
};
