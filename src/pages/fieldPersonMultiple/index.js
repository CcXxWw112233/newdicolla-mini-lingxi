import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtCheckbox } from "taro-ui";
import indexStyles from './index.scss'

@connect(({ tasks: {
  // executors_list = [], 
  tasksDetailDatas = {} } }) => ({
    // executors_list,
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
    const { contentId, executors = [], item_id, executorsList, } = this.props;
    console.log("---****-------");
    console.log(executorsList);
    let executorsData;
    let new_arr;
    if (executors.length > 0) {
      executorsData = executors;
      //取出已经是执行人的id, 组成新数组(已选中)
      new_arr = executorsData && executorsData.map((obj) => {
        return obj.user_id;
      });
    }

    this.setState({
      card_id: contentId,
      itemId: item_id,
    });

    const executors_list = executorsList;
    executors_list.forEach((item) => {
      item["label"] = item.name;
      item["value"] = item.id ? item.id : item.user_id;
    });

    this.setState({
      checkboxOption: executors_list,
      checkedList: new_arr,
    });
  }

  handleChange(value) {
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
      },
    });
  }

  //更改本地数据
  deleteCardExecutor = (value) => {
    const { dispatch, tasksDetailDatas, executors_list = [], } = this.props;
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
  onClickAction() {
    typeof this.props.onClickAction == "function" &&
      this.props.onClickAction();
  }
  render() {
    const { checkboxOption = [] } = this.state;

    return (
      <View className={indexStyles.fieldSelectionView}>

        <View className={indexStyles.index}>
          <View className={indexStyles.titleView}>请选择</View>
          <ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>

            <AtCheckbox
              options={checkboxOption}
              selectedList={this.state.checkedList}
              onChange={this.handleChange.bind(this)} />
          </ScrollView>
          <View className={indexStyles.bootomBtnView}>
            <View onClick={this.onClickAction} className={indexStyles.btnView}>确定</View>
          </View>
        </View>
      </View>
    );
  }
}

fieldPersonMultiple.defaultProps = {};
