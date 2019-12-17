import { isPlainObject } from './../../utils/util';

//当拿不到 redux store 数据的时候， 可以通过回调的方式，拿到当前 model 的 state
//现在因为已经将 store 实例挂载到了 小程序 app 实例 的 globalData 属性上，
//所以可以通过 Taro.getApp() 拿到 小程序 app 实例， 也就 可以通过 globalData - store - getState()
//获取到 store 的数据
export function handleDependOnState(state, { callback }) {
  if (callback && typeof callback === 'function') {
    callback(state);
  }
  return state;
}

// 这里采取： 轻 reducer, 重 action 的模式，
// 也就是 将大部分的数据处理和整合的工作放到 dispatch action 的时候处理
// 而 这里的 reducer 只是简单的用 action 里的数据替换或者合并到现有的 state

//替换整个 state
export function updateStateByReplace(state, { state: newState }) {

  //这个model 的 state 是一个 object,
  if (newState && isPlainObject(newState)) {
    return newState;
  }
  // 如果试图用其他类型的 state 替换，
  // 静默失败
  // 直接返回原来的 state
  return state;
}

// 替换 state 的某个字段
export function updateStateFieldByCover(state, { payload, callback }) {
  if (callback && typeof callback === 'function') {
    callback(state);
  }
  if (payload && isPlainObject(payload)) {
    return { ...state, ...payload };
  }
  return state;
}

// 扩展 state 的可扩展字段
export function updateStateFieldByExtension(state, { payload, callback }) {
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
