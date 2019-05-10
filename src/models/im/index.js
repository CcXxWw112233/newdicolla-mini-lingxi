import { INITIAL_STATE } from './initialState';
import initNimSDK from './initNimSDK';
import { isPlainObject } from './../../utils/util';
import { selectFieldsFromIm } from './selectFields';

export default {
  namespace: 'im',
  state: INITIAL_STATE,
  effects: {
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
    }
  },
  reducers: {
    //当拿不到 redux store 数据的时候， 可以通过回调的方式，拿到当前 model 的 state
    //因为已经将 store 实例挂载到了 小程序 app 实例 的 globalData 属性上，
    //所以可以通过 Taro.getApp() 拿到 小程序 app 实例， 也就 可以通过 globalData - store - getState()
    //获取到 store 的数据
    handleDependOnState(state, {callback}) {
      if(callback && typeof callback === 'function') {
        callback(state)
      }
      return state
    },
    updateStateByReplace(state, {state: newState}) {
      //这个model 的 state 是一个 object,
      if(newState && isPlainObject(newState)) {
        return newState
      }
      //如果试图用其他类型的 state 替换，返回原来的 state
      return state
    },
    updateStateFieldByCover(state, { payload, callback }) {
      if (callback && typeof callback === 'function') {
        callback(state);
      }
      if(payload && isPlainObject(payload)) {
        return { ...state, ...payload };
      }
      return state
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
  },
  // subscriptions: {
  //   setup({ dispatch: dis }, done) {

  //   }
  // },
};
