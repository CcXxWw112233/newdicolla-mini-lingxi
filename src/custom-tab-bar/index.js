import Taro, { Component } from "@tarojs/taro";
import { CoverView, CoverImage } from "@tarojs/components";
import styles from "./index.scss";
import { connect } from "@tarojs/redux";

// @connect(({ im: { unread_all_number } }) => ({ unread_all_number }))

@connect(({ im: { unread_all_number }, accountInfo: { tabbar_index } }) => ({
  unread_all_number,
  tabbar_index
}))
class customTabBar extends Component {
  state = {
    color: "#8c8c8c",
    selectedColor: "#1890FF",
    list: [
      {
        pagePath: "../calendar/index",
        text: "日历",
        iconPath: "../asset/tabBar/calendar.png",
        selectedIconPath: "../asset/tabBar/calendar_selected.png"
      },
      {
        pagePath: "../boardChat/index",
        text: "项目圈",
        iconPath: "../asset/tabBar/board.png",
        selectedIconPath: "../asset/tabBar/board_selected.png"
      },
      {
        pagePath: "../file/index",
        text: "文件",
        iconPath: "../asset/tabBar/personal.png",
        selectedIconPath: "../asset/tabBar/personal_selected.png"
      },
      {
        pagePath: "../jumpToMeeting/index",
        text: "会协宝",
        iconPath: "../asset/tabBar/meeting.png",
        selectedIconPath: "../asset/tabBar/meeting_selected.png"
      },
      {
        pagePath: "../seeBoardChart/index",
        text: "统计",
        iconPath: "../asset/tabBar/stastics.png",
        selectedIconPath: "../asset/tabBar/stastics_selected.png"
      }
    ]
  };
  componentWillMount() {
    Taro.hideTabBar();
  }
  switchTab = item => {
    console.log("tabbaritem", item);
    const { pagePath, text } = item;
    const { list } = this.state;
    const { dispatch } = this.props;
    const index = list.findIndex(val => val.text == text);
    dispatch({
      type: "accountInfo/updateDatas",
      payload: {
        tabbar_index: index
      }
    });
    Taro.switchTab({
      url: pagePath
    });
  };

  // componentWillReceiveProps(nextProps) {
  //   const { unread_all_number } = this.props;
  //   const { unread_all_number: next_unread_all_number } = nextProps;
  //   if (unread_all_number != next_unread_all_number) {
  //     if (unread_all_number != 0) {
  //       wx.setTabBarBadge({
  //         index: 1,
  //         text:
  //           unread_all_number > 99
  //             ? "99+"
  //             : unread_all_number
  //             ? unread_all_number + ""
  //             : "0"
  //       });
  //     }
  //   }
  // }

  componentDidMount() {
    const { tabbar_index } = this.props;
    console.log("tabbarssssssss", tabbar_index);
  }

  // 自定义 tabBar的页面
  render() {
    const { tabbar_index } = this.props;
    return (
      <CoverView className={styles.tab_bar}>
        <CoverView className={styles.tab_bar_wrap}>
          {this.state.list.map((item, index) => {
            return (
              <CoverView
                className={styles.tab_bar_wrap_item}
                onClick={this.switchTab.bind(this, item)}
                data-path={item.pagePath}
                key={item.text}
              >
                <CoverImage
                  className={styles.tab_bar_wrap_item_icon}
                  src={
                    tabbar_index === index
                      ? item.selectedIconPath
                      : item.iconPath
                  }
                />
                <CoverView
                  className={styles.tab_bar_wrap_item_btn}
                  style={{
                    color:
                      tabbar_index === index
                        ? this.state.selectedColor
                        : this.state.color
                  }}
                >
                  {item.text}
                </CoverView>
              </CoverView>
            );
          })}
        </CoverView>
      </CoverView>
    );
  }
}
export default customTabBar;
