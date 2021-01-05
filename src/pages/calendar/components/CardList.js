import Taro, { Component } from "@tarojs/taro";
import { connect } from "@tarojs/redux";
import { View, Button, Text } from "@tarojs/components";
import CardItem from "./CardItem";
import indexstyles from "./index.scss";
import globalStyles from "../../../gloalSet/styles/globalStyles.scss";
import CardTypeSelect from "./CardTypeSelect";

@connect(
  ({
    calendar: {
      sche_card_list,
      no_sche_card_list,
      isReachBottom,
      meeting_list = []
    }
  }) => ({
    sche_card_list,
    no_sche_card_list,
    isReachBottom,
    meeting_list
  })
)
export default class CardList extends Component {
  render() {
    const {
      schedule,
      sche_card_list = [],
      no_sche_card_list = []
    } = this.props;
    const card_list = schedule == "1" ? sche_card_list : no_sche_card_list; //未排其和已排期的情况分别取不同数据
    const { isReachBottom } = this.props;
    // console.log(this.props.meeting_list);
    const promptText =
      sche_card_list.length > 0
        ? `${isReachBottom === true ? "加载更多..." : "没有更多内容了"}`
        : "暂无数据";
    return (
      <View
        className={`${indexstyles.card_item_out_01} ${globalStyles.global_horrizontal_padding}`}
      >
        {card_list.map((value, key) => {
          const { content_id, flag } = value;
          return (
            flag != "3" && (
              <View key={content_id}>
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
