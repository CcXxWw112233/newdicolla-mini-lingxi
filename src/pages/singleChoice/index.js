import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { AtRadio } from 'taro-ui'

@connect(({ tasks: { tasksDetailDatas = {}, }, }) => ({
    tasksDetailDatas,
}))
export default class singleChoice extends Component {
    config = {
        navigationBarTitleText: '单项选择'
    }

    constructor() {
        super(...arguments)
        this.state = {
            value: '', //当选选中id
            singleList: [],  //数据列表 
            field_item_id: '',  //单选字段id
            field_single_choice_id: '', //当前选中字段id
        }
    }

    handleChange(value,) {

        this.setState({
            value,
        })

        //更新任务分组
        const { dispatch, } = this.props
        const { field_single_choice_id, field_item_id, } = this.state

        let fieldValue
        if (field_single_choice_id === value) {
            this.setState({
                field_single_choice_id: '',
                value: '',
            })

            fieldValue = ''
        }
        else {
            this.setState({
                field_single_choice_id: value,
            })

            fieldValue = value
        }

        dispatch({
            type: 'tasks/putBoardFieldRelation',
            payload: {
                id: field_item_id,
                field_value: fieldValue,
                calback: this.putBoardFieldRelation(value),
            }
        })
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

        const { items, field_value, field_item_id, } = this.$router.params
        const itemsData = JSON.parse(items);

        this.setState({
            value: field_value,  //当选选中id
            field_single_choice_id: field_value,
            field_item_id: field_item_id, //单选字段id
        })

        itemsData.forEach(item => {
            item['label'] = item.item_value
            item['value'] = item.id
        })

        this.setState({
            singleList: itemsData,
        })
    }

    render() {

        const { singleList = [] } = this.state

        return (
            <View >
                <AtRadio
                    options={singleList}
                    value={this.state.value}
                    onClick={this.handleChange.bind(this)}
                />
            </View>
        )
    }
}

singleChoice.defaultProps = {

};