/* eslint-disable taro/this-props-function */
import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { View, Button, Text, Swiper, SwiperItem } from "@tarojs/components";
import indexStyles from "./index.scss";
import globalStyles from "../../../../gloalSet/styles/globalStyles.scss";
import { getMonthDate, isToday, isSamDay } from "./getDate";

@connect(({ calendar: { sign_data, calendar_mark_list, isCartListScroll } }) => ({
  sign_data, calendar_mark_list, isCartListScroll
}))
export default class CalendarSwiper extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    swiper_list: [0, 1, 2],
    current_indi: 1, //滑动组件当前所在哪个点
    windowWidth: 0,
    selected_timestamp: new Date().getTime(), //当前选择的日期
    show_whole_calendar: "0", // 0 /1 /2 初始/展开/关闭,
    isHandOpen: false, //是否是手动展开日历
    todayMaginTop: 0 //收起日历时日历的位置
  };

  componentDidMount() {
    // 1.1 从服务消息[每日代办]进入, 打开选中当时的日期
    const todoListData = Taro.getStorageSync("isTodoList");
    if (todoListData) {
      this.selectDate(`${todoListData}__${undefined}`);
    }

    this.getDataArray({});
    this.getSelectDateDetail();
    const systemInfo = Taro.getSystemInfoSync();
    const { windowWidth } = systemInfo;
    this.setState({
      windowWidth
    });
  }

  componentDidShow() {
    this.getDataArray({});
    this.getSelectDateDetail();
    const systemInfo = Taro.getSystemInfoSync();
    const { windowWidth } = systemInfo;
    this.setState({
      windowWidth
    });
  }

  componentDidHide() { }

  //获取日历列表数据
  getDataArray = ({ year, month }) => {
    const date_array = getMonthDate({ year, month });
    this.setState({
      date_array
    });
  };

  //滑动后处理数据
  swiperChangeHandle = decoration => {
    const { select_year, select_month, select_date_no } = this.state;
    let select_year_new = select_year;
    let select_month_new = select_month;
    // eslint-disable-next-line taro/this-props-function
    // 处理日期--->选择31号日期，滑动到下个月只有30号的时候，自动显示的下下个月的数据，再滑动会多跳动一个月
    /**
     * 1.向左滑动增加时，获取下个月共有多少天，
     * 2.当前选中日期与下月最大天数进行对比，进行选择新的选中日期，向右滑动减少亦然，获取上月最大天数
     */
    let select_date_no_new;
    // 向后一个月有多少天
    let afterDays = new Date(select_year, select_month + 1, 0).getDate();
    // 向前一个月有多少天
    let forwardDays = new Date(select_year, select_month - 1, 0).getDate();

    if ("to_left" == decoration) {
      //增加
      if (select_month == 12) {
        select_month_new = 1;
        select_year_new = select_year + 1;
      } else {
        select_month_new = select_month + 1;
      }

      if (select_date_no == afterDays || select_date_no < afterDays) {
        select_date_no_new = select_date_no;
      } else if (select_date_no > afterDays) {
        select_date_no_new = afterDays;
      }
    } else {
      //减少
      if (select_month == 1) {
        select_month_new = 12;
        select_year_new = select_year - 1;
      } else {
        select_month_new = select_month - 1;
      }

      if (select_date_no == forwardDays || select_date_no < forwardDays) {
        select_date_no_new = select_date_no;
      } else if (select_date_no > forwardDays) {
        select_date_no_new = forwardDays;
      }
    }

    const new_timestamp = new Date(
      `${select_year_new}/${select_month_new}/${select_date_no_new}`
    ).getTime();

    typeof this.props.settitleText == "function" &&
      this.props.settitleText(`${select_year_new}年${select_month_new}月`);


    this.updateSelecedTime(new_timestamp);
    this.getDataArray({ year: select_year_new, month: select_month_new });
    this.getSelectDateDetail(new_timestamp);
    this.getSignList(new_timestamp);
  };

  //监听滑动
  swiperChange = e => {
    const {
      detail: { current }
    } = e;
    const { current_indi } = this.state;
    let decoration;
    if (0 == current_indi) {
      if (1 == current) {
        decoration = "to_left";
      } else if (2 == current) {
        decoration = "to_right";
      }
    } else if (1 == current_indi) {
      if (0 == current) {
        decoration = "to_right";
      } else if (2 == current) {
        decoration = "to_left";
      }
    } else if (2 == current_indi) {
      if (0 == current) {
        decoration = "to_left";
      } else if (1 == current) {
        decoration = "to_right";
      }
    }
    this.swiperChangeHandle(decoration);
    this.setState({
      current_indi: current
    });
  };

  //选择日期
  selectDate = string => {
    //选中日期打点重新刷新打点
    const { select_year, select_month, select_date_no } = this.state;
    const new_timestamp = new Date(
      `${select_year}/${select_month}/${select_date_no}`
    ).getTime();
    this.getSignList(new_timestamp);

    const arr = string.split("__");
    const timestamp = arr[0];
    const no_in_select_month = arr[1];
    if (!no_in_select_month || no_in_select_month != "undefined") {
      return;
    }
    this.updateSelecedTime(Number(timestamp));
    this.getSelectDateDetail(timestamp);

    //存储当前选择的日期和上一个选择的日期, 当做对比
    Taro.setStorageSync("timestamp", timestamp);
    Taro.setStorageSync("new_timestamp", new_timestamp);
  };

  //获取选择日期的详情
  getSelectDateDetail = (timestamp) => {
    const select_date = timestamp ? new Date(Number(timestamp)) : new Date();
    const select_year = select_date.getFullYear();
    const select_month = select_date.getMonth() + 1;
    const select_date_no = select_date.getDate();
    const select_week_day = select_date.getDay();
    const select_week_day_arr = [
      "周日",
      "周一",
      "周二",
      "周三",
      "周四",
      "周五",
      "周六"
    ];
    const select_week_day_dec = select_week_day_arr[select_week_day];
    this.setState({
      select_year,
      select_month,
      select_date_no,
      select_week_day_dec
    });

    typeof this.props.settitleText == "function" &&
      this.props.settitleText(`${select_year}年${select_month}月`);
  }

  setShowWholeCalendar() {
    const { dispatch, isCartListScroll } = this.props;
    const { show_whole_calendar } = this.state;
    let show_flag = "0";

    if (isCartListScroll) {
      dispatch({
        type: "calendar/updateDatas",
        payload: {
          isCartListScroll: false
        }
      });
      show_flag = "1";
    } else {
      if ("0" == show_whole_calendar) {
        show_flag = "2";
        // this.calculationTodayMaginTop("dynamic");
      } else if ("1" == show_whole_calendar) {
        show_flag = "2";
        // this.calculationTodayMaginTop("dynamic");
      } else if ("2" == show_whole_calendar) {
        show_flag = "1";
        // this.calculationTodayMaginTop("initial");
      } else {
      }
    }
    if (show_flag == '0' || show_flag == '1') {
      dispatch({
        type: "calendar/updateDatas",
        payload: {
          isHandleOpen: true
        }
      });
    }
    this.setState({
      show_whole_calendar: show_flag,
    });
  }

  calculationTodayMaginTop = action => {
    if (action === "dynamic") {
      const { date_array } = this.props;
      var newArr = date_array.filter(function (obj) {
        return obj.is_today == true;
      });
      const index = this.getArrayIndex(date_array, newArr[0]);

      const FirstLineOfCalendarArray = [0, 1, 2, 3, 4, 5, 6];
      const SecondLineOfCalendarArray = [7, 8, 9, 10, 11, 12, 13];
      const ThirdLineOfCalendarArray = [14, 15, 16, 17, 18, 19, 20];
      const FourthLineOfCalendarArray = [21, 22, 23, 24, 25, 26, 27];
      const FifthLineOfCalendarArray = [28, 29, 30, 31, 32, 33, 34];

      let today_magin_top = 0;
      if (FirstLineOfCalendarArray.indexOf(index) > -1) {
        today_magin_top = 0;
      } else if (SecondLineOfCalendarArray.indexOf(index) > -1) {
        today_magin_top = -51;
      } else if (ThirdLineOfCalendarArray.indexOf(index) > -1) {
        today_magin_top = -51 * 2;
      } else if (FourthLineOfCalendarArray.indexOf(index) > -1) {
        today_magin_top = -51 * 3;
      } else if (FifthLineOfCalendarArray.indexOf(index) > -1) {
        today_magin_top = -51 * 4;
      }
      this.setState({
        todayMaginTop: today_magin_top
      });
    } else if (action === "initial") {
      this.setState({
        todayMaginTop: 0
      });
    }
  };

  getArrayIndex = (array, obj) => {
    var i = array.length;
    while (i--) {
      if (array[i] === obj) {
        return i;
      }
    }
    return -1;
  };

  updateSelecedTime = timestamp => {
    const { dispatch } = this.props;
    this.setState({
      selected_timestamp: timestamp
    });
    dispatch({
      type: "calendar/updateDatas",
      payload: {
        selected_timestamp: timestamp,
        page_number: 1, //重新选择日历上的日期,重置 page_number 为 1
        isReachBottom: true
      }
    });
    console.log("进来了", "ssss_1111");
    //获取排期列表
    dispatch({
      type: "calendar/getScheCardList",
      payload: {
        selected_timestamp: timestamp
      }
    });
    dispatch({
      type: "calendar/getMeetingTodoList",
      payload: {
        query_time: timestamp
      }
    });
  };

  //更新打点列表
  getSignList = new_timestamp => {
    const { dispatch } = this.props;
    //获取打点列表
    dispatch({
      type: "calendar/getSignList",
      payload: {
        selected_timestamp: new_timestamp
      }
    });
  };

  //返回是否具有任务打点
  isHasNormalTask = timestamp => {
    const { sign_data = {} } = this.props;
    const { calendar_normal_sign_data = [] } = sign_data;
    let i = calendar_normal_sign_data.find(item => item == timestamp);
    return !!i;
  };

  //返回是否具有里程碑打点
  isHasMiletone = timestamp => {
    const { sign_data = {} } = this.props;
    const { calendar_milestone_sign_data = [] } = sign_data;
    let i = calendar_milestone_sign_data.find(item => item == timestamp);
    return !!i;
  };

  render() {
    var {
      swiper_list = [],
      current_indi,
      windowWidth,
      date_array = [],
      selected_timestamp,
      select_year,
      select_month,
      select_date_no,
      select_week_day_dec,
      show_whole_calendar,
      todayMaginTop,
      isHandOpen
    } = this.state;
    const { calendar_mark_list, isCartListScroll } = this.props;
    const week_array = ["日", "一", "二", "三", "四", "五", "六"];

    const renderDate = (
      <View className={indexStyles.month_area}>
        <View className={indexStyles.week_head} style={{ height: 30 + "px" }}>
          {week_array.map((value, index) => {
            return (
              <View className={indexStyles.week_day} key={index}>
                {value}
              </View>
            );
          })}
        </View>
        <View
          className={indexStyles.date_area}
          style={{ marginTop: todayMaginTop + 30 + "px" }}
        >
          {date_array.map((value, key) => {
            const {
              date_no,
              timestamp,
              is_today,
              is_has_task,
              is_has_flow,
              no_in_select_month
            } = value;

            const is_selected = isSamDay(selected_timestamp, timestamp);
            var minus = calendar_mark_list.filter(function (item) {

              var is_mark = isSamDay(parseInt(item.time), parseInt(timestamp));
              return is_mark;
            });

            // minus = minus.filter(function (item, index) {
            // return minus.indexOf(item, 0) === index;
            // });
            for (var i = 0, len = minus.length; i < len; i++) {
              for (var j = i + 1, len = minus.length; j < len; j++) {
                if (minus[i].value === minus[j].value) {
                  minus.splice(j, 1);
                  j--;        // 每删除一个数j的值就减1
                  len--;      // j值减小时len也要相应减1（减少循环次数，节省性能）   
                  // console.log(j,len)
                }
              }
            }
            return (
              <View
                className={indexStyles.date_day}
                key={`${timestamp}_${date_no}`}
                style={`width: ${windowWidth / 7}px`}
              >
                <View
                  onClick={this.selectDate.bind(
                    this,
                    `${timestamp}__${no_in_select_month}`
                  )}
                  className={`${indexStyles.date_day_inner}  ${is_today &&
                    (is_selected ? indexStyles.is_now_date : indexStyles.is_now_sdate)}  ${is_selected &&
                    indexStyles.date_day_selected}  ${no_in_select_month &&
                    indexStyles.no_current_month_date}`}
                >
                  <Text>{is_today ? '今' : date_no}</Text>
                  <View
                    className={`${indexStyles.check_has_task} ${no_in_select_month &&
                      indexStyles.check_has_task_no_current_moth}`} >
                    {this.isHasNormalTask(timestamp) && (
                      <View
                        className={`${indexStyles.has_task}`}
                        style={`background-color: ${is_selected ? "#ffffff" : "#1890FF"
                          }`}></View>
                    )}
                    {/* {this.isHasMiletone(timestamp) && (
                      <View className={`${indexStyles.has_flow}`}></View>
                    )} */}
                  </View>
                </View>
                {

                  minus.length > 0 ? (
                    <View className={indexStyles.markView}>
                      <View className={`${indexStyles.markCircel} ${minus[0].type == 2 ?
                        indexStyles.warnCircel : ''}`}>{minus[0].value}</View>
                      {
                        minus.length == 2 ? (<View className={`${indexStyles.overdue} ${minus[1].type == 2 ?
                          indexStyles.warnCircel : ''} ${indexStyles.markCircel}`}>{minus[1].value}</View>) : (null)
                      }

                    </View>
                  ) : (null)
                }

              </View>
            );
          })}

        </View>
      </View>
    );
    const renderDateVisual = (
      <View className={indexStyles.month_area}>
        <View className={indexStyles.week_head}>
          {week_array.map((value, key) => {
            return (
              <View className={indexStyles.week_day} key={key}>
                {value}
              </View>
            );
          })}
        </View>

        <View className={indexStyles.date_area}>
          {date_array.map((value, key) => {
            const {
              date_no,
              timestamp,
              is_today,
              is_has_task,
              is_has_flow,
              no_in_select_month
            } = value;
            return (
              <View
                className={indexStyles.date_day}
                key={`${timestamp}_${date_no}`}
                style={`width: ${windowWidth / 7}px`}
              >
                <View
                  className={`${indexStyles.date_day_inner
                    } ${no_in_select_month && indexStyles.no_current_month_date}`}
                >
                  <Text>{date_no}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );

    return (
      <View className={indexStyles.index}>
        <View className={indexStyles.calendar_out}>
          <Swiper
            className={`${indexStyles.month_area_swiper
              } ${(show_whole_calendar == "0" && !isCartListScroll) &&
              indexStyles.swiper_show_nomal} ${show_whole_calendar == "1" && !isCartListScroll &&
              indexStyles.swiper_show_whole} ${(show_whole_calendar == "2" || isCartListScroll) &&
              indexStyles.swiper_show_part}`}
            onChange={this.swiperChange}
            current={current_indi}
            duration={100}
            circular
          >
            {swiper_list.map((value, key) => {
              return (
                <SwiperItem className={indexStyles.month_area} key={key}>
                  {current_indi == key ? renderDate : renderDateVisual}
                </SwiperItem>
              );
            })}
          </Swiper>
          {/* <View className={indexStyles.date_detail_dec}> */}
          {/* {select_year}年{select_month}月{select_date_no}日{" "} */}
          {/* {select_week_day_dec} */}
          {/* </View> */}
          <View className={indexStyles.set_calendar} onClick={this.setShowWholeCalendar}>
            {/*<View
              className={`${globalStyles.global_iconfont} ${show_whole_calendar == "0" &&
                indexStyles.set_calendar_icon_nomal} ${show_whole_calendar ==
                "1" &&
                indexStyles.set_calendar_icon_all} ${show_whole_calendar ==
                "2" && indexStyles.set_calendar_icon_part}`}
              onClick={this.setShowWholeCalendar}>
              &#xe653;
                </View>*/}

            {
              ((show_whole_calendar == '0' || show_whole_calendar == '1') && !isCartListScroll) ? (<View onClick={this.setShowWholeCalendar} className={indexStyles.showcalendar}></View>) : (<Text className={`${globalStyles.global_iconfont} ${indexStyles.hidecalendaricon}`}>&#xe642;</Text>)
            }

          </View>
        </View>
        <View
          className={`${indexStyles.calendar_back} ${show_whole_calendar ==
            "0" && !isCartListScroll && indexStyles.calendar_back_nomal} ${show_whole_calendar ==
            "1" && !isCartListScroll && indexStyles.calendar_back_all} ${(show_whole_calendar ==
              "2" || isCartListScroll) && indexStyles.calendar_back_part}`}
        ></View>
      </View>
    );
  }
}
