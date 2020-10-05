import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtRadio } from "taro-ui";

@connect(({ tasks: { tasksDetailDatas = {}, executors_list = [] } }) => ({
  tasksDetailDatas,
  executors_list,
}))
export default class index extends Component {
  config = {
    navigationBarTitleText: "人员单选",
  };

  constructor() {
    super(...arguments);
    this.state = {
      value: "", //当选选中id
      singleList: [], //数据列表
      itemId: "",
    };
  }

  handleChange(value) {
    this.setState({
      value,
    });

    //更新任务分组
    const { dispatch } = this.props;
    const { itemId } = this.state;

    dispatch({
      type: "tasks/putBoardFieldRelation",
      payload: {
        id: itemId,
        field_value: value,
        calback: this.putBoardFieldRelation(value),
      },
    });
  }

  putBoardFieldRelation = (value) => {
    const { singleList = [], field_item_id } = this.state;

    let fieldValue = "";
    singleList.forEach((obj) => {
      if (obj["id"] === value) {
        fieldValue = obj.id;
      }
    });

    const { dispatch, tasksDetailDatas } = this.props;
    const { fields = [] } = tasksDetailDatas;

    fields.forEach((item) => {
      if (item.id === field_item_id) {
        item.field_value = fieldValue;
      }
    });

    dispatch({
      type: "tasks/updateDatas",
      payload: {
        tasksDetailDatas: {
          ...tasksDetailDatas,
          ...singleList,
        },
      },
    });
  };

  componentDidMount() {
    const { executors, item_id } = this.$router.params;
    const itemsData = JSON.parse(executors);
    console.log(itemsData[0]["id"], "sssss");

    this.setState({
      value: itemsData[0]["id"], //当前选中人员id
      itemId: item_id,
    });

    const { executors_list = [] } = this.props;
    executors_list.forEach((item) => {
      item["label"] = item.name;
      item["value"] = item.id;
    });
    this.setState({
      singleList: executors_list,
    });
  }

  render() {
    const { singleList = [] } = this.state;

    return (
      <View>
        <AtRadio
          options={singleList}
          value={this.state.value}
          onClick={this.handleChange.bind(this)}
        />
      </View>
    );
  }
}

index.defaultProps = {};
