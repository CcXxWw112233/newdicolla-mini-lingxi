import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { AtRadio } from 'taro-ui'

@connect(({ tasks: { tasksDetailDatas = {}, }, }) => ({
    tasksDetailDatas,
}))
export default class SingleChoicePicker extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            current_select_name: '未选择',
            value: '', //当选选中id
            singleList: [],  //数据列表 
            field_single_choice_id: '', //当前选中字段id
        }
    }

    onChange(e) {

        // this.setState({
        //     value,
        // })
        // dataArray[e.detail.value]['id']
        //更新任务分组
        const { dispatch, } = this.props
        const { field_single_choice_id, field_item_id, singleList } = this.state
        var value = singleList[e.detail.value]['value'];

        let fieldValue
        if (field_single_choice_id === value) {
            // this.setState({
            //     field_single_choice_id: '',
            //     value: '',
            // })

            // fieldValue = ''
        }
        else {
            this.setState({
                field_single_choice_id: value,
                current_select_name: singleList[e.detail.value]['label']
            })

            fieldValue = value
            dispatch({
                type: 'tasks/putBoardFieldRelation',
                payload: {
                    id: field_item_id,
                    field_value: fieldValue,
                    calback: this.putBoardFieldRelation(value),
                }
            })
        }


    }

    putBoardFieldRelation = (value) => {

        const { singleList = [], field_item_id, } = this.state

        let fieldValue = ''
        singleList.forEach(obj => {
            if (obj['id'] === value) {
                fieldValue = obj.id;
            }
        })

        const { dispatch, tasksDetailDatas, } = this.props
        const { fields = [] } = tasksDetailDatas

        fields.forEach(item => {

            if (item.id === field_item_id) {
                item.field_value = fieldValue
            }
        })

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...singleList,
                }
            }
        })
    }

    componentDidMount() {

        const { items, field_value, field_item_id, tasksDetailDatas, editAuth } = this.props
        const itemsData = items;
        const { fields = [] } = tasksDetailDatas

        this.setState({
            value: field_value,  //当选选中id
            field_single_choice_id: field_value,
            field_item_id: field_item_id, //单选字段id
        })

        itemsData.forEach(item => {
            item['label'] = item.item_value
            item['value'] = item.id
        })

        let fieldValue = ''
        itemsData.forEach(obj => {
            if (obj['id'] === field_value) {
                this.setState({
                    title: obj.label
                })
            }
        })
        fields.forEach(item => {

            if (item.id === field_item_id) {
                item.field_value = fieldValue
            }
        })
        this.setState({
            singleList: itemsData,
        })
    }

    render() {
        const { singleList = [], title, current_select_name } = this.state
        const rangeKey = 'label';
        return (
            <View >

                <Picker rangeKey={rangeKey} mode='selector' disabled={!editAuth} range={singleList} onChange={this.onChange}>
                    <View className={indexStyles.projectNameCellPicker}>
                        {current_select_name != '未选择' || !title ? current_select_name : title}
                    </View>
                </Picker>
            </View>
        )
    }
}

