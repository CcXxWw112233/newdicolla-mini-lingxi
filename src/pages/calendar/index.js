import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { View, Button } from "@tarojs/components";
import CardList from "./components/CardList";
import indexStyles from "./index.scss";
import globalStyles from "../../gloalSet/styles/globalStyles.scss";
import CardTypeSelect from "./components/CardTypeSelect/index";
import SearchAndMenu from "../board/components/SearchAndMenu";
import CalendarSwiper from "./components/CalendarSwiper";
import MilestoneList from "./components/MilestoneList";
import CustomNavigation from "../acceptInvitation/components/CustomNavigation.js";
import PersonalCenter from "./components/PersonalCenter";
import { onSysMsgUnread } from "../../models/im/actions";

@connect(
  ({
    calendar: {
      no_sche_card_list,
      selected_board_name,
      page_number,
      isReachBottom,
      isOtherPageBack,
      selected_timestamp
    },
    accountInfo,
    im: { sessionlist, unread_all_number }
  }) => ({
    no_sche_card_list,
    selected_board_name,
    page_number,
    isReachBottom,
    isOtherPageBack,
    accountInfo,
    selected_timestamp,
    sessionlist,
    unread_all_number
  })
)
export default class Calendar extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    show_card_type_select: "0",
    search_mask_show: "0"
  };

  config = {
    navigationStyle: "custom",
    navigationBarTitleText: "",
    enablePullDownRefresh: true,
    backgroundColor: "#696969",
    onReachBottomDistance: 50 //默认值50
  };

  onShareAppMessage() {
    return {
      title: "日历",
      path: `/pages/Calendar/index`
    };
  }

  isGlobalPushNews;

  onPullDownRefresh(res) {
    //下拉刷新...

    const { dispatch, selected_timestamp } = this.props;
    dispatch({
      type: "calendar/updateDatas",
      payload: {
        page_number: 1,
        isReachBottom: true
      }
    });
    console.log(selected_timestamp);
    this.getNoScheCardList();
    this.getScheCardList();
    this.getOrgBoardList();
    this.getSignList();
    this.getMeetingTodoList({ query_time: selected_timestamp });

    Taro.showNavigationBarLoading();
    setTimeout(function () {
      Taro.stopPullDownRefresh();
      Taro.hideNavigationBarLoading();
    }, 300);
  }

  onReachBottom() {
    //上拉加载...
    const { isReachBottom } = this.props;

    if (isReachBottom === true) {
      this.pagingGet();
    }
  }
  componentDidMount() {
    //显示未读总数
    const { dispatch } = this.props;
    Promise.resolve(
      dispatch({
        type: "im/getImAllHistoryUnread",
        payload: {}
      })
    ).then(res => {
      const { unread_all_number } = this.props;
      if (unread_all_number != 0 && unread_all_number) {
        wx.setTabBarBadge({
          index: 1,
          text:
            unread_all_number > 99
              ? "99+"
              : unread_all_number
                ? unread_all_number + ""
                : "0"
        });
      }
    });
  }

  componentDidShow() {
    const { selected_board_name, selected_timestamp } = this.props;
    Taro.setNavigationBarTitle({
      title: selected_board_name
    });
    console.log("进来了", selected_timestamp);
    this.getOrgList();
    this.getOrgBoardList();
    this.getNoScheCardList();
    this.getScheCardList({});
    this.getSignList();
    this.getMeetingTodoList({ query_time: selected_timestamp });
    this.getUserAllOrgsAllBoards();
    this.getAccountInfo();

    if (Taro.pageScrollTo) {
      Taro.pageScrollTo({
        scrollTop: 0
      });
    } else {
      console.log("当前微信版本不支持");
    }
  }

  componentDidHide() {
    const { dispatch } = this.props;
    dispatch({
      type: "calendar/updateDatas",
      payload: {
        isOtherPageBack: false
      }
    });

    dispatch({
      type: "calendar/updateDatas",
      payload: {
        page_number: 1,
        isReachBottom: true
      }
    });

    if (Taro.getStorageSync("isTodoList")) {
      //清除从服务消息[每日代办]进来的标记
      Taro.removeStorageSync("isTodoList");
    }
  }

  getUserAllOrgsAllBoards = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "calendar/getUserAllOrgsAllBoards",
      payload: {}
    });
  };

  //获取用户信息
  getAccountInfo() {
    const { dispatch, accountInfo } = this.props;
    const { account_info = {} } = accountInfo;
    if (JSON.stringify(account_info) == "{}") {
      dispatch({
        type: "accountInfo/getAccountInfo",
        payload: {}
      });
    }
  }

  //获取项目列表
  getOrgBoardList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "calendar/getOrgBoardList",
      payload: {}
    });
  };

  //获取尚未排期列表
  getNoScheCardList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "calendar/getNoScheCardList",
      payload: {}
    });
  };
  // 获取排期列表
  getScheCardList = (payload = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: "calendar/getScheCardList",
      payload: {
        ...payload
      }
    });
  };

  // 获取会议列表
  getMeetingTodoList = ({ query_time }) => {
    const { dispatch } = this.props;
    dispatch({
      type: "calendar/getMeetingTodoList",
      payload: { query_time }
    });
  };

  pagingGet = () => {
    const { page_number, dispatch } = this.props;
    let new_page_number = page_number;
    new_page_number = new_page_number + 1;
    dispatch({
      type: "calendar/updateDatas",
      payload: {
        page_number: new_page_number
      }
    });

    this.getScheCardList({ type: 1 });
  };

  // 获取组织列表
  getOrgList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "my/getOrgList",
      payload: {}
    });
  };

  //获取打点列表
  getSignList = month => {
    const { dispatch } = this.props;
    dispatch({
      type: "calendar/getSignList",
      payload: {
        month
      }
    });
  };

  gotoAddingTasks = () => {
    Taro.navigateTo({
      url: "../../pages/addingTasks/index"
    });
  };

  onSelectType = ({ show_type }) => {
    this.setState({
      show_card_type_select: show_type,
      search_mask_show: show_type
    });
  };

  gotoNoSchedule = () => {
    const { selected_board_name } = this.props;
    Taro.navigateTo({
      url: `../../pages/noSchedulesCard/index?title=${selected_board_name}`
    });
  };

  newlyBuildThingProject = () => {
    Taro.navigateTo({
      url: "../../pages/addingTasks/index"
    });
  };

  showPersonalCenter = value => {
    //子组件传值到父组件,去改变state里面值的时候, value不能用this.setState,is_mask_show_personalCenter
    // this.setState({
    //   is_mask_show_personalCenter: value
    // })

    const { dispatch } = this.props;
    dispatch({
      type: "accountInfo/updateDatas",
      payload: {
        is_mask_show_personalCenter: value
      }
    });
  };

  render() {
    const { show_card_type_select, search_mask_show } = this.state;
    const { no_sche_card_list = [] } = this.props;

    const {
      account_info = {},
      is_mask_show_personalCenter
    } = this.props.accountInfo;
    const { avatar } = account_info;

    const SystemInfo = Taro.getSystemInfoSync();
    const statusBar_Height = SystemInfo.statusBarHeight;
    const navBar_Height = SystemInfo.platform == "ios" ? 44 : 48;

    return (
      <View className={indexStyles.view_style}>
        <CustomNavigation
          home_personal_center="homePersonalCenter"
          personal_center_image={avatar}
          showPersonalCenter={() => this.showPersonalCenter(true)}
          title="日历"
        />

        {is_mask_show_personalCenter && is_mask_show_personalCenter === true ? (
          <PersonalCenter
            account_info={account_info}
            closePersonalCenter={() => this.showPersonalCenter(false)}
          />
        ) : (
            ""
          )}
        <View
          style={{
            position: "sticky",
            top: `${statusBar_Height + navBar_Height}` + "px",
            zIndex: 15,
            left: 0
          }}
        >
          <SearchAndMenu
            onSelectType={this.onSelectType}
            search_mask_show={search_mask_show}
          />
          <CalendarSwiper />
        </View>
        <CardTypeSelect
          show_card_type_select={show_card_type_select}
          onSelectType={this.onSelectType}
          schedule={"1"}
        />
        {/* <MilestoneList schedule={'1'} /> */}
        {/* {no_sche_card_list.length && ( */}
        <View
          className={`${globalStyles.global_card_out} ${indexStyles.no_scheduling}`}
          onClick={this.gotoNoSchedule}
        >
          暂未排期的工作（{no_sche_card_list.length}）
        </View>
        {/* )} */}
        <CardList schedule={"1"} />
        <View style="height: 50px"></View>

        {/* <View className={indexStyles.plusTasks} onClick={this.gotoAddingTasks}>
          +
        </View> */}
      </View>
    );
  }
}
