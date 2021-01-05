import Taro, { Component } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import indexStyles from "./index.scss";
import globalStyles from "../../../gloalSet/styles/globalStyles.scss";
import Avatar from "../../../components/avatar";
import {
  getOrgName,
  timestampToTimeZH,
  setBoardIdStorage
} from "../../../utils/basicFunction";
import { connect } from "@tarojs/redux";

@connect(({ my: { org_list } }) => ({
  org_list
}))
export default class CardItem extends Component {
  gotoListItemDetails = itemValue => {
    console.log("itemValue===", itemValue);
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

  render() {
    const { itemValue = {}, schedule, org_list } = this.props;
    const {
      board_id,
      content_id,
      content_name,
      org_id,
      flag,
      board_name,
      start_time,
      due_time,
      is_realize
    } = itemValue;
    const users = itemValue["data"] || [];
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
    return (
      <View onClick={() => flag != "1" && this.gotoListItemDetails(itemValue)}>
        <View
          className={`${globalStyles.global_card_out} ${indexStyles.card_content} `}
          style={`opacity: ${dis_due_style()}`}
        >
          <View className={`${indexStyles.card_content_left}`}>
            {"0" == flag
              ? is_realize == "1"
                ? card_logo_1_relize
                : card_logo_1
              : "1" == flag
              ? card_logo_2
              : "2" == flag
              ? card_logo_3
              : card_logo_4}
          </View>
          <View className={`${indexStyles.card_content_middle}`}>
            <View className={`${indexStyles.card_content_middle_top}`}>
              <Text className={`${indexStyles.card_title}`}>
                {content_name}
              </Text>
              <Text className={`${indexStyles.organize}`}>
                #{getOrgName({ org_id, org_list })}>{board_name}
              </Text>
            </View>
            <View
              className={`${indexStyles.card_content_middle_bott}`}
              style={{
                color:
                  now > due_time && flag != "1" && is_realize != "1"
                    ? "#F5222D"
                    : "#8c8c8c"
              }}
            >
              {schedule == "0"
                ? "未排期"
                : `${
                    start_time
                      ? timestampToTimeZH(start_time)
                      : "开始时间未设置"
                  } - ${
                    due_time ? timestampToTimeZH(due_time) : "截止时间未设置"
                  }`}
            </View>
            {flag == "1" && (
              <View className={indexStyles.card_content_meeting_btn}>
                <Button>复制链接参会</Button>
              </View>
            )}
          </View>

          <View className={`${indexStyles.card_content_right}`}>
            <Avatar avartarTotal={"multiple"} userList={users} />
          </View>
        </View>
      </View>
    );
  }
}
CardItem.defaultProps = {
  schedule: "2" //1排期 0 没有排期
};
