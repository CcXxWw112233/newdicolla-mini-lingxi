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
      'pages/boardDetail/index',
      'pages/noSchedulesCard/index',
      'pages/board/index',
      'pages/my/index',
      'pages/chat/index',
      'pages/chatDetail/index',
      'pages/login/index',
      'pages/selectOrg/index',
      'pages/phoneNumberLogin/index',
      'pages/testPage/index',
      'pages/personalCenter/index',
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
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#1890FF',
      navigationBarTitleText: '灵犀',
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
        {
          "pagePath": "pages/board/index",
          "text": "项目",
          "iconPath": './asset/tabBar/board.png',
          "selectedIconPath": './asset/tabBar/board_selected.png',
        },
        {
          "pagePath": "pages/personalCenter/index",
          "text": "我的",
          "iconPath": './asset/tabBar/personal.png',
          "selectedIconPath": './asset/tabBar/personal_selected.png',
        }
      ]
    }

  }

  globalData = {
    store,
  }

  componentDidMount() {
  }

  componentDidShow() {
    const options = this.$router.params
    if (options.path === 'pages/acceptInvitation/index') {
      Taro.setStorageSync('sceneParams', options)
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
