import Taro, { Component } from "@tarojs/taro";
import { View, Picker } from "@tarojs/components";
import { connect } from "@tarojs/redux";
import { AtRadio } from "taro-ui";
import indexStyles from './index.scss'
import Avatar from "../../avatar";

@connect(({ tasks: {
    tasksDetailDatas = {},
} }) => ({
    tasksDetailDatas,
}))
export default class FieldPersonSinglePicker extends Component {
    // config = {
    // navigationBarTitleText: "人员单选",
    // };

    constructor() {
        super(...arguments);
        this.state = {
            value: "", //当选选中id
            singleList: [], //数据列表
            itemId: "",
            current_select_user_id: '', //当前选中人员的id,
            current_select_name: '未选择',
            executors1: []
        };
    }

    onChange(e) {

        const { dispatch, executorsList, item_id } = this.props
        const { itemId, current_select_user_id, singleList } = this.state
        var value = executorsList[e.detail.value]['user_id'];
        if (current_select_user_id === value) {

            // this.setState({
            // value: '',
            // current_select_user_id: '',
            // });

            // dispatch({
            // type: "tasks/putBoardFieldRelation",
            // payload: {
            // id: itemId,
            // field_value: '',
            // calback: this.putBoardFieldRelation(value),
            // },
            // });
        }
        else {

            // this.setState({
            // value,
            // });
            var executors1 = [];
            executors1.push(executorsList[e.detail.value])
            this.setState({
                current_select_user_id: value,
                current_select_name: executorsList[e.detail.value]['name'],
                executors1: executors1
            });

            dispatch({
                type: "tasks/putBoardFieldRelation",
                payload: {
                    id: item_id,
                    field_value: value,
                    calback: this.putBoardFieldRelation(value),
                },
            });
        }

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

        const { executors, item_id, executorsList, } = this.props;
        const itemsData = executors;
        const itemsDataIdValue = itemsData && itemsData[0] && itemsData[0]["id"]
        const executors_list = executorsList;
        executors_list && executors_list.forEach((item) => {
            item["label"] = item.name;
            item["value"] = item.id ? item.id : item.user_id;
        });
        this.setState({
            singleList: executors_list,
            value: itemsDataIdValue, //当前选中人员id
            itemId: item_id,
            current_select_user_id: itemsDataIdValue,
        });
    }

    render() {

        const { singleList = [], current_select_name, executors1 = [] } = this.state;
        const rangeKey = "name";
        const { executors = [], item_id, executorsList, title } = this.props;
        var isShowAvator = false;
        if (executors.length) {
            isShowAvator = true
            current_select_name != '未选择'
        }
        if (current_select_name != '未选择') {
            isShowAvator = true
        }
        return (
            <View>
                {/* <AtRadio
                    options={singleList}
                    value={this.state.value}
                    onClick={this.handleChange.bind(this)}
                /> */}
                <Picker rangeKey={rangeKey} mode='selector' range={executorsList} onChange={this.onChange}>
                    <View className={indexStyles.projectNameCellPicker}>
                        {!isShowAvator ? "未选择" : <Avatar avartarTotal={"multiple"} userList={executors1.length ? executors1 : executors} />}
                    </View>
                </Picker>
            </View>
        );
    }
}

FieldPersonSinglePicker.defaultProps = {};
