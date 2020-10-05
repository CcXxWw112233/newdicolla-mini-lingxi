import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtCheckbox } from "taro-ui";

@connect(({ tasks: { executors_list = [], tasksDetailDatas = {} } }) => ({
  executors_list,
  tasksDetailDatas,
}))
export default class fieldPersonMultiple extends Component {
  config = {
    navigationBarTitleText: "多选人员",
  };

  constructor() {
    super(...arguments);
    this.state = {
      checkedList: [], //已选中数组
      checkboxOption: [], //全部数组
      itemId: "",
    };
  }

  componentDidMount() {
    const { contentId, executors = [], item_id } = this.$router.params;

    let executorsData;
    let new_arr;
    if (executors.length > 0) {
      executorsData = JSON.parse(executors);
      //取出已经是执行人的id, 组成新数组(已选中)
      new_arr = executorsData.map((obj) => {
        return obj.user_id;
      });
    }

    this.setState({
      card_id: contentId,
      itemId: item_id,
    });

    const { executors_list = [] } = this.props;

    executors_list.forEach((item) => {
      item["label"] = item.name;
      item["value"] = item.id;
    });

    this.setState({
      checkboxOption: executors_list,
      checkedList: new_arr,
    });
  }

  handleChange(value) {
    console.log("value=====", value);

    this.setState({
      checkedList: value,
    });

    var valueText = value.join(",");

    const { dispatch } = this.props;
    const { itemId } = this.state;

    dispatch({
      type: "tasks/putBoardFieldRelation",
      payload: {
        id: itemId,
        field_value: valueText,
        // calback: this.putBoardFieldRelation(valueText),
      },
    });
  }

  //更改本地数据
  deleteCardExecutor = (value) => {
    const { dispatch, tasksDetailDatas, executors_list = [] } = this.props;
    const { properties = [] } = tasksDetailDatas;

    let array = [];
    for (let i = 0; i < value.length; i++) {
      executors_list.forEach((obj) => {
        if (obj.id === value[i]) {
          array.push(obj);
        }
      });
    }
    properties.forEach((item) => {
      if (item["code"] === "EXECUTOR") {
        item.data = array;
      }
    });

    dispatch({
      type: "tasks/updateDatas",
      payload: {
        tasksDetailDatas: {
          ...tasksDetailDatas,
          ...properties,
        },
      },
    });
  };

  render() {
    const { checkboxOption = [] } = this.state;

    return (
      <View>
        <AtCheckbox
          options={checkboxOption}
          selectedList={this.state.checkedList}
          onChange={this.handleChange.bind(this)}
        />
      </View>
    );
  }
}

fieldPersonMultiple.defaultProps = {};
