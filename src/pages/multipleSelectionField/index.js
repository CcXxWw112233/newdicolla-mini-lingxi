import { connect } from '@tarojs/redux'
import Taro, { Component, } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { AtCheckbox, } from 'taro-ui'
import indexStyles from './index.scss'

@connect(({ tasks: { label_list = [], tasksDetailDatas = {}, }, }) => ({
    label_list, tasksDetailDatas,
}))
export default class LabelSelection extends Component {
    // config = {
    // navigationBarTitleText: '多选字段',
    // }

    // state = {
    //     item_id: '',
    //     checkedList: [],  //已选中数组
    //     checkboxOption: [],  //全部数组
    // }
    onClickAction() {
        typeof this.props.onClickAction == "function" &&
            this.props.onClickAction();
    }

    componentDidMount() {

        const { fieldValue, data, item_id, } = this.props
        const itemData = data
        this.setState({
            item_id: item_id,
        })
        console.log("---------")
        console.log(data);
        console.log(fieldValue);
        itemData.forEach(item => {
            item['label'] = item.item_value
            item['value'] = item.id
        })
        var new_arr = [];
        if (fieldValue) {
            new_arr = fieldValue.split(",");
        }


        this.setState({
            checkboxOption: itemData,
            checkedList: new_arr,
        })
    }

    handleChange(value) {

        var sa = new Set(this.state.checkedList);
        var sb = new Set(value);

        this.setState({
            checkedList: value
        })

        const valueStr = value.toString()

        const { dispatch, } = this.props
        const { item_id } = this.state

        if (this.state.checkedList.length > value.length) {  //删减

            dispatch({
                type: 'tasks/putBoardFieldRelation',
                payload: {
                    id: item_id,
                    field_value: valueStr,
                    calback: this.putBoardFieldRelation(value),
                }
            })
        }
        else if (this.state.checkedList.length < value.length) {  //增加

            dispatch({
                type: 'tasks/putBoardFieldRelation',
                payload: {
                    id: item_id,
                    field_value: valueStr,
                    calback: this.putBoardFieldRelation(value),
                }
            })
        }
    }

    putBoardFieldRelation = (value) => {
        const { dispatch, tasksDetailDatas, } = this.props
        const { fields = [] } = tasksDetailDatas
        var fieldValueStr = value.toString();

        fields.forEach(item => {

            if (item['field_content']['field_type'] === '2') {

                item.field_value = fieldValueStr
            }
        })

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...fields,
                }
            }
        })
    }


    render() {

        const { checkboxOption = [] } = this.state

        return (
            <View className={indexStyles.multipleSelectionField}>
                <View className={indexStyles.index}>
                    <View className={indexStyles.titleView}>请选择</View>
                    <ScrollView className={indexStyles.scrollview} scrollY scrollWithAnimation>
                        <View>
                            <AtCheckbox
                                options={checkboxOption}
                                selectedList={this.state.checkedList}
                                onChange={this.handleChange.bind(this)}
                            />
                        </View>
                    </ScrollView>
                    <View className={indexStyles.bootomBtnView}>
                        <View onClick={this.onClickAction} className={indexStyles.btnView}>确定</View>
                    </View>
                </View>
            </View>
        )
    }
}

