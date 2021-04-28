import "@tarojs/async-await";
import Taro, { Component } from "@tarojs/taro";
import { Provider } from "@tarojs/redux";
import Index from "./pages/index";
import { getAccountInfo } from "./services/login/index";
import { isApiResponseOk } from "./utils/request";
import "./app.scss";
// import 'taro-ui/dist/style/index.scss' //taro-ui默认
// import './gloalSet/styles/taro-ui1890ff.global.css' //taro-ui带主题
import "./gloalSet/styles/taro_ui_index.global.scss"; //global模式下转化taro-ui import 'taro-ui/dist/style/index.scss'

import dva from "./utils/dva";
import models from "./models/index";
// import { options } from "nervjs";
const dvaApp = dva.createApp({
  initialState: {},
  models: models,
  onError: function (e) {
    // console.log('sssss_dva_error', e)
  },
  onChange: function (e) {
    // console.log('sssss_dva_change', e)
  },
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
      "pages/index/index",
      "pages/index/userAgreement/index",
      // "pages/settingTabbar/index",
      "pages/seeBoardChart/index",
      "pages/login/index",
      "pages/calendar/index",
      // "pages/im/index",
      "pages/groupMember/index",
      // "pages/noSchedulesCard/index",
      "pages/subBoardChat/index",
      "pages/subChatDetail/index",
      "pages/chat/index",
      "pages/chatDetail/index",
      "pages/chatDetail/components/inviteMember/index",
      "pages/filesChat/index",
      // "pages/phoneNumberLogin/index",
      "pages/acceptInvitation/index",
      "pages/nowOpen/index",
      "pages/auccessJoin/index",
      "pages/qrCodeInvalid/index",
      // "pages/taksDetails/index",
      // "pages/labelSelection/index",
      "pages/tasksGroup/index",
      // "pages/executorsList/index",
      "pages/milestoneList/index",
      // "pages/fieldSelection/index",
      "pages/singleChoice/index",
      // "pages/textField/index",
      // "pages/dateField/index",
      // "pages/multipleSelectionField/index",
      // "pages/addSonTask/index",
      // "pages/sonTaskExecutors/index",
      "pages/sceneEntrance/index",
      // "pages/errorPage/index",
      "pages/file/index",
      // "pages/file/fileSearch/index",
      // "pages/file/previewImage/index",
      "pages/boardChat/index",
      // "pages/templateDetails/index",
      "pages/fieldPersonSingle/index",
      // "pages/fieldPersonMultiple/index",
      "pages/jumpToMeeting/index",
      // "pages/OnlineTableWebView/index",
      "pages/qrcodeHistory/index",
    ],
    "subpackages": [
      {
        "root": "pages/noSchedulesCard",
        "pages": [
          "index"
        ]
      },
      {
        "root": "pages/im",
        "pages": [
          "index"
        ]
      },
      {
        "root": "pages/templateDetails",
        "pages": [
          "index"
        ]
      },
      {
        "root": "pages/OnlineTableWebView",
        "pages": [
          "index"
        ]
      },
      {
        "root": "pages/phoneNumberLogin",
        "pages": [
          "index"
        ]
      },
      {
        "root": "pages/errorPage",
        "pages": [
          "index"
        ]
      },
      {
        "root": "pages/file/fileSearch",
        "pages": [
          "index"
        ]
      },
      {
        "root": "pages/file/previewImage",
        "pages": [
          "index"
        ]
      },
      {

        "root": "pages/taksDetails",
        "pages": [
          "index",
          "components/AddDesribeTaskText/index"
        ]
      }
    ],
    permission: {
      "scope.userLocation": {
        desc: "你的位置信息将用于上传图片",
      },
    },
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#1890FF",
      navigationBarTitleText: "聆悉",
      navigationBarTextStyle: "white",
      navigationStyle: "default",
    },
    tabBar: {
      // custom: true,
      backgroundColor: "#ffffff",
      color: "#8c8c8c",
      selectedColor: "#1890FF",
      list: [
        {
          pagePath: "pages/calendar/index",
          text: "日历",
          iconPath: "./asset/tabBar/calendar.png",
          selectedIconPath: "./asset/tabBar/calendar_selected.png",
        },
        {
          pagePath: "pages/boardChat/index",
          text: "项目圈",
          iconPath: "./asset/tabBar/board.png",
          selectedIconPath: "./asset/tabBar/board_selected.png",
        },
        {
          pagePath: "pages/file/index",
          text: "文件",
          iconPath: "./asset/tabBar/personal.png",
          selectedIconPath: "./asset/tabBar/personal_selected.png",
        },
        {
          pagePath: "pages/jumpToMeeting/index",
          text: "会协宝",
          iconPath: "./asset/tabBar/meeting.png",
          selectedIconPath: "./asset/tabBar/meeting_selected.png",
        },
        {
          pagePath: "pages/qrcodeHistory/index",
          text: "统计",
          iconPath: "./asset/tabBar/stastics.png",
          selectedIconPath: "./asset/tabBar/stastics_selected.png",
        },
        // {
        //   pagePath: "pages/settingTabbar/index",
        //   text: "设置",
        //   iconPath: "./asset/tabBar/setting.png",
        //   selectedIconPath: "./asset/tabBar/setting_selected.png",
        // },
      ],
    },
  };

  globalData = {
    store,
  };

  componentDidMount() {
    //进入miniapp初始化IM
    // this.registerIm();
    // 重定向到日历页面
    this.recordtoHome();
  }
  // 注册im
  registerIm = () => {
    const initImData = async () => {
      const {
        globalData: {
          store: { dispatch },

        },
      } = Taro.getApp();
      const { account, token } = await dispatch({
        type: "im/fetchIMAccount",
      });
      await dispatch({
        type: "im/initNimSDK",
        payload: {
          account,
          token,
        },
      });
      return await dispatch({
        type: "im/fetchAllIMTeamList",
      });
    };
    initImData().catch(
      (e) => {
        console.log(String(e))
      },
    );
  };
  recordtoHome = () => {
    // 验证token
    getAccountInfo({}, false, false).then((res) => {
      if (isApiResponseOk(res)) {
        // 注册im
        this.registerIm();
        // Taro.switchTab({
        //   url: '../../pages/calendar/index'
        // })
      }
    });
  };

  componentDidShow() {
    console.log("*************");
    // this.recordtoHome();
    /***
     * 备注: 小程序切换到后台后, im会重连会发送不了消息, 所以每次进入前台连接一次
     *
     * 注意: 进入前台时判断, 聊天页面中发送文件/图片/拍照都会进入后台, 选中之后小程序进入前台, 这次不用去连接, 连接的话会导致发送图片失败
     *
     * isChat 是否从聊天页面中选择文件/图片/拍照后进入前台
     * is_chat_extended_function --标识符条件成立的时候清除Storage, 防止下次从其他场景进入前台受影响,   --不成立的走备注流程
     */
    const isChat = Taro.getStorageSync("is_chat_extended_function");
    if (isChat === "true") {
      //清除 Storage 里的 isChat 标识符.
      Taro.removeStorageSync("is_chat_extended_function");
    } else {
      //重连 im.
      const { getState } = store;
      const {
        im: { nim },
      } = getState();
      console.log("*****");
      console.log(nim);
      if (nim) {
        nim.disconnect({
          done: () => {
            setTimeout(() => {
              nim.connect({
                done: () => {
                }
              });
            }, 50);
          },
        });
      }
    }
  }

  componentDidHide() {
  }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    );
  }
}

Taro.render(<App />, document.getElementById("app"));
