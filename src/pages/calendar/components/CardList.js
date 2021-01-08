import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { View } from "@tarojs/components";
import CardItem from "./CardItem";
import indexstyles from "./index.scss";
import globalStyles from "../../../gloalSet/styles/globalStyles.scss";
import {
  timeSort,
  removeEmptyArrayEle,
  caldiffDays
} from "../../../utils/util";

@connect(
  ({
    calendar: {
      sche_card_list,
      no_sche_card_list,
      isReachBottom,
      meeting_list = [],
      selected_timestamp
    }
  }) => ({
    sche_card_list,
    no_sche_card_list,
    isReachBottom,
    meeting_list,
    selected_timestamp
  })
)
export default class CardList extends Component {
  // 对任务列表进行时间排序
  compareEvaluationTimeArray = (array = []) => {
    if (!array || !!!array.length) return [];
    let newArray = JSON.parse(JSON.stringify(array || []));
    newArray = newArray.map(item => {
      if (item.flag == "0" || item.flag == "meeting") {
        let new_item = { ...item };
        let compare_time = item.due_time
          ? item.due_time
          : item.end_time || item.start_time;
        new_item = { ...item, compare_time: compare_time };
        return new_item;
      }
    });
    return newArray;
  };

  render() {
    const {
      schedule,
      sche_card_list = [],
      no_sche_card_list = [],
      meeting_list = [],
      selected_timestamp
    } = this.props;
    let temp_ = timeSort(
      removeEmptyArrayEle(
        this.compareEvaluationTimeArray(
          [].concat(...sche_card_list, ...meeting_list)
        )
      ),
      "compare_time"
    );
    // temp_ =
    //   temp_.filter(item => {
    //     const today = new Date();
    //     const today_timestamp = today.getTime();
    //     const today_year = today.getFullYear();
    //     const today_month = today.getMonth();
    //     const today_day = today.getDate();
    //     const today_start_time = new Date(
    //       today_year,
    //       today_month,
    //       today_day,
    //       "00",
    //       "00",
    //       "00"
    //     ).getTime();
    //     console.log(item);
    //     if ((!!item.due_time || !!item.end_time) && !!item.start_time) {
    //       console.log("进来了", "sss_11");
    //       return (
    //         item.start_time <= today_start_time &&
    //         (item.due_time || item.end_time) >= today_start_time
    //       );
    //     } else {
    //       console.log("进来了", "sss_222");
    //       return (
    //         caldiffDays(
    //           item.due_time || item.end_time || item.start_time,
    //           selected_timestamp
    //         ) == 0
    //       );
    //     }
    //   }) || [];
    const card_list = schedule == "1" ? temp_ : no_sche_card_list; //未排其和已排期的情况分别取不同数据
    const { isReachBottom } = this.props;
    // console.log(this.props.meeting_list);
    const promptText =
      sche_card_list.length > 0
        ? `${isReachBottom === true ? "加载更多..." : "没有更多内容了"}`
        : "暂无数据";
    // console.log(selected_timestamp, temp_);
    return (
      <View
        className={`${indexstyles.card_item_out_01} ${globalStyles.global_horrizontal_padding}`}
      >
        {card_list.map((value, key) => {
          const { content_id, flag, id } = value;
          return (
            flag != "3" && (
              <View key={content_id || id}>
                <CardItem itemValue={value} schedule={schedule} />
              </View>
            )
          );
        })}
        <View className={indexstyles.no_more_text}>{promptText}</View>
      </View>
    );
  }
}

CardList.defaultProps = {
  schedule: "2" //1排期 0 没有排期
};
