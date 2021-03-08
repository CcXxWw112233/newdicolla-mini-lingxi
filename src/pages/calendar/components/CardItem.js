/* eslint-disable jsx-quotes */
import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { View, Button, Text } from "@tarojs/components";
import indexStyles from "./index.scss";
import globalStyles from "../../../gloalSet/styles/globalStyles.scss";
import Avatar from "../../../components/avatar";
import { getOrgName, timestampToTimeZH } from "../../../utils/basicFunction";

@connect(({ my: { org_list }, calendar: { selected_timestamp } }) => ({
  org_list,
  selected_timestamp
}))
export default class CardItem extends Component {
  gotoListItemDetails = itemValue => {
    const { flag, content_id, board_id, parent_id } = itemValue;
    if (itemValue && ["0", "1"].indexOf(flag) !== -1) {
      let tasks_id = parent_id ? parent_id : content_id;
      Taro.navigateTo({
        url: `../../pages/taksDetails/index?flag=${flag}&contentId=${tasks_id}&boardId=${board_id}&back_icon=arrow_icon`
      });
    } else if (itemValue && ["2"].indexOf(flag) !== -1) {

      Taro.navigateTo({
        url: `../../pages/templateDetails/index?flag=${flag}&contentId=${content_id}&boardId=${board_id}&back_icon=arrow_icon`
      });
    } else {
    }
  };

  // 点击复制链接
  handleSetClipboardData = (start_url) => {
    Taro.setClipboardData({
      data: start_url.meetingUrl,
      success: function (res) {
        Taro.showToast({
          title: "复制成功",
          duration: 3000
        });
        Taro.getClipboardData({
          success: function (res) {
          }
        });
      }
    });
  };

  // 渲染图标
  // renderCardLogo = ({ type, is_realize }) => {
  //   let title_icon;
  //   switch (type) {
  //     case "0":
  //       title_icon = is_realize == "1" ? <>&#xe7a8;</> : <>&#xe63d;</>;
  //       break;
  //     case "1":
  //       // title_icon = <>&#xe63e;</>;
  //       break;
  //     case "2":
  //       title_icon = <>&#xe633;</>;
  //       break;
  //     case "meeting":
  //       title_icon = <>&#xe63e;</>;
  //       break;
  //     case "3":
  //       title_icon = <>&#xe636;</>;
  //       break;
  //     default:
  //       break;
  //   }
  //   return title_icon;
  // };

  render() {
    const { itemValue = {}, schedule, org_list, selected_timestamp } = this.props;
    const {
      board_id,
      content_id,
      content_name,
      org_id,
      flag,
      board_name,
      start_time,
      due_time,
      is_realize,
      topic,
      end_time,
      is_urge,
      start_url,
      rela_url,
      join_url,
      content_url,
      time_warning
    } = itemValue;

    var meetingUrl = flag == 1 && content_url || rela_url || start_url || join_url;

    const users = itemValue["data"] || [];
    var timeStamp = new Date(parseInt(selected_timestamp)).setHours(0, 0, 0, 0), duetimeStamp = new Date(parseInt(due_time)).setHours(0, 0, 0, 0);
    // var is_warning = (((duetimeStamp - 86400000 * 3 > timeStamp) && (timeStamp > duetimeStamp - 86400000 * 4)) || (duetimeStamp - 86400000 * 3 == timeStamp)) ? true : false;
    var is_warning = time_warning && (timeStamp > (duetimeStamp - 86400000 * time_warning) || timeStamp == (duetimeStamp - 86400000 * time_warning)) ? true : false
    var duetime = due_time && due_time.length < 11 ? due_time * 1000 : due_time;
    const card_logo_1 = (
      <Text
        className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}
      >
        &#xe63d;
      </Text>
    );
    const card_logo_2 = (
      <Text
        className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}
      >
        &#xe63e;
      </Text>
    );
    const card_logo_3 = (
      <Text
        className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}
      >
        &#xe633;
      </Text>
    );
    const card_logo_4 = (
      <Text
        className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}
      >
        &#xe636;
      </Text>
    );
    const card_logo_1_relize = (
      <Text
        className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}
      >
        &#xe7a8;
      </Text>
    );
    const card_logo_meeting = (
      <Text
        className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}
      >
        &#xe63e;
      </Text>
    );
    const dis_due_style = () => {
      let opacity = "1";
      if ("0" == flag) {
        if (is_realize == "1") {
          opacity = "0.6";
        }
      } else if ("1" == flag) {
        if (due_time && due_time < new Date().getTime() / 1000) {
          opacity = "0.6";
        }
      } else if ("2" == flag) {
        if (is_realize == "1") {
          opacity = "0.6";
        }
      } else if ("3" == flag) {
        if (is_realize == "1") {
          opacity = "0.6";
        }
      } else {
      }
      return opacity;
    };

    var now = Date.parse(new Date());
    var isToday = new Date(parseInt(start_time)).toDateString() === new Date().toDateString()
    return (
      <View
        onClick={() => flag != "meeting" && flag != "1" && flag != '3' && this.gotoListItemDetails(itemValue)}
      >
        <View
          className={`${globalStyles.global_card_out} ${indexStyles.card_content} `}
          style={`opacity: ${dis_due_style()}`}
        >
          {/* <View className={`${indexStyles.card_content_left}`}> */}
          {/* {/* {/* {"0" == flag ? is_realize == "1" ? card_logo_1_relize : card_logo_1: "1" == flag ? card_logo_2 : "2" == flag ? card_logo_3 : "meeting" == flag ? card_logo_meeting: card_logo_4}</View> */}

          <View className={`${indexStyles.card_content_middle}`}>
            <View className={`${indexStyles.card_content_middle_top}`}>
              <Text className={`${indexStyles.card_title}`}>
                {content_name || topic}
              </Text>

              {
                is_warning && flag == '0' && is_realize == '0' && !(due_time && now > duetime) ? (
                  <View className={`${indexStyles.urge} ${indexStyles.iswaring}`}><Text className={`${globalStyles.
                    global_iconfont} ${indexStyles.urgeicon} `}>&#xe849;</Text> 预警</View>)
                  : (null)
              }

              {
                is_urge == '1' && flag == '2' ? (
                  <View className={indexStyles.urge}><Text className={`${globalStyles.global_iconfont} ${indexStyles.urgeicon}`}>&#xe849;</Text> 催办</View>) : (null)
              }
              {
                due_time && now > duetime && (flag == '0' || flag == '2') && is_realize == '0' ? (<View className={indexStyles.urge}><Text className={`${globalStyles.global_iconfont} ${indexStyles.urgeicon}`}>&#xe849;</Text>
逾期</View>) : (null)
              }
            </View>
            <View className={`${indexStyles.organize}`}>
              {/* #{getOrgName({ org_id, org_list })}&gt;{board_name} */}{
                board_name && board_name.length > 0 ? ('#' + board_name) : (null)
              }
            </View>
            <View
              className={`${indexStyles.card_content_middle_bott}`}
              style={{
                color:
                  now > duetime && flag != "1" && is_realize != "1"
                    ? "#F5222D" : "#8c8c8c"
              }}
            >
              {!due_time
                ? "未排期"
                : `${start_time
                  ? (timestampToTimeZH(start_time).substring(0, 4) == timestampToTimeZH(due_time || end_time).substring(0, 4) ? timestampToTimeZH(start_time).substring(5) : timestampToTimeZH(start_time))
                  : "开始时间未设置"
                } - ${due_time || end_time
                  ? (timestampToTimeZH(due_time || end_time).substring(0, 4) == timestampToTimeZH(start_time).substring(0, 4) ? timestampToTimeZH(due_time || end_time).substring(5) : timestampToTimeZH(due_time || end_time))
                  : "截止时间未设置"
                }`}
            </View>

            {(flag == "meeting" || flag == '1') && isToday && (
              <View className={indexStyles.card_content_meeting_btn} onClick={() => this.handleSetClipboardData({ meetingUrl })}>
                复制链接参会
              </View>
            )}
          </View>

          <View className={`${indexStyles.card_content_right}`}>
            <Avatar avartarTotal="multiple" userList={users} />

          </View>
        </View>
      </View >
    );
  }
}
CardItem.defaultProps = {
  schedule: "2" //1排期 0 没有排期
};
