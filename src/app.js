import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import Index from './pages/index'
import './app.scss'
// import 'taro-ui/dist/style/index.scss' //taro-ui默认
// import './gloalSet/styles/taro-ui1890ff.global.css' //taro-ui带主题
import './gloalSet/styles/taro_ui_index.global.scss' //global模式下转化taro-ui import 'taro-ui/dist/style/index.scss'

import dva from './utils/dva';
import models from './models/index';
import { options } from 'nervjs';
const dvaApp = dva.createApp({
  initialState: {},
  models: models,
  onError: function (e) {
    console.log('sssss_dva_error', e)
  },
  onChange: function (e) {
    console.log('sssss_dva_change', e)
  }
});
const store = dvaApp.getStore();

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  config = {
    pages: [
      'pages/calendar/index',
      'pages/im/index',
      'pages/groupMember/index',
      'pages/noSchedulesCard/index',
      // 'pages/boardDetail/index',
      // 'pages/board/index',
      'pages/my/index',
      'pages/chat/index',
      'pages/chatDetail/index',
      'pages/login/index',
      'pages/selectOrg/index',
      'pages/phoneNumberLogin/index',
      'pages/testPage/index',
      'pages/index/index',
      'pages/acceptInvitation/index',
      'pages/nowOpen/index',
      'pages/auccessJoin/index',
      'pages/qrCodeInvalid/index',
      'pages/taksDetails/index',
      // 'pages/addingTasks/index',
      // 'pages/choiceProject/index',
      // 'pages/fillDescribe/index',
      // 'pages/DateTimePicker/index',
      'pages/sceneEntrance/index',
      'pages/errorPage/index',
      'pages/file/index',
      'pages/webView/index',
      'pages/boardChat/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#1890FF',
      navigationBarTitleText: '聆悉',
      navigationBarTextStyle: 'white',
      navigationStyle: 'default',
    },
    tabBar: {
      "backgroundColor": "#ffffff",
      "color": "#8c8c8c",
      "selectedColor": "#1890FF",
      "list": [
        {
          "pagePath": "pages/calendar/index",
          "text": "日历",
          "iconPath": './asset/tabBar/calendar.png',
          "selectedIconPath": './asset/tabBar/calendar_selected.png',
        },
        // {
        //   "pagePath": "pages/board/index",
        //   "text": "boardChat",
        //   "iconPath": './asset/tabBar/board.png',
        //   "selectedIconPath": './asset/tabBar/board_selected.png',
        // },
        {
          "pagePath": "pages/boardChat/index",
          "text": "项目圈",
          "iconPath": './asset/tabBar/board.png',
          "selectedIconPath": './asset/tabBar/board_selected.png',
        },
        {
          "pagePath": "pages/file/index",
          "text": "文件",
          "iconPath": './asset/tabBar/personal.png',
          "selectedIconPath": './asset/tabBar/personal_selected.png',
        }
      ]
    }
  }

  globalData = {
    store,
  }

  componentDidMount() { }

  componentDidShow() {

    /***
    * 备注: 小程序切换到后台后, im会重连会发送不了消息, 所以每次进入前台连接一次
    * 
    * 注意: 进入前台时判断, 聊天页面中发送文件/图片/拍照都会进入后台, 选中之后小程序进入前台, 这次不用去连接, 连接的话会导致发送图片失败
    * 
    * isChat 是否从聊天页面中选择文件/图片/拍照后进入前台
    * is_chat_extended_function --标识符条件成立的时候清除Storage, 防止下次从其他场景进入前台受影响,   --不成立的走备注流程
    */
    const isChat = Taro.getStorageSync('is_chat_extended_function')
    if (isChat === 'true') {//清除 Storage 里的 isChat 标识符.
      Taro.removeStorageSync('is_chat_extended_function')
    } else {  //重连 im.
      const { getState } = store
      const { im: { nim } } = getState()
      if (nim) {
        nim.disconnect({
          done: () => {
            setTimeout(() => {
              nim.connect({})
            }, 50)
          }
        })
      }
    }
  }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
