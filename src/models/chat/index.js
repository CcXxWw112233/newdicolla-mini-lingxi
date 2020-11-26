import { updateStateFieldByCover } from './../im/reducers.js';

export default {
  namespace: 'chat',
  state: {
    isUserInputFocus: false, // 是否呼出虚拟键盘
    isUserInputHeightChange: 0, //用户输入区域变高, 如果变高，需要调整 chatcontent 高度， 否则 chatcontent 的部分内容会被遮挡
    chatContentHeightStyle: '',
    handleInputMode: 'text',
  },
  reducers: {
    updateStateFieldByCover
  }
};
