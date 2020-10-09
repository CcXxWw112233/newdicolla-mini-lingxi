import { connect } from '@tarojs/redux'
import Taro, { Component, } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { AtCheckbox, } from 'taro-ui'

@connect(({ tasks: { label_list = [], tasksDetailDatas = {}, }, }) => ({
    label_list, tasksDetailDatas,
}))
export default class LabelSelection extends Component {
    config = {
        navigationBarTitleText: '多选字段',
    }

    state = {
        item_id: '',
        checkedList: [],  //已选中数组
        checkboxOption: [],  //全部数组
    }

    componentDidMount() {

        const { fieldValue, data, item_id, } = this.$router.params
        const itemData = JSON.parse(data)

        this.setState({
            item_id: item_id,
        })

        itemData.forEach(item => {
            item['label'] = item.item_value
            item['value'] = item.id
        })

        var new_arr = fieldValue.split(",");

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
            <View className={indexStyles.index}>
                <AtCheckbox
                    options={checkboxOption}
                    selectedList={this.state.checkedList}
                    onChange={this.handleChange.bind(this)}
                />
            </View>
        )
    }
}

