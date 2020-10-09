import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCheckbox } from 'taro-ui'

@connect(({ tasks: { tasksDetailDatas = {}, field_selection_list = [], field_selection_group_list = [], }, }) => ({
    tasksDetailDatas, field_selection_list, field_selection_group_list,
}))
export default class fieldSelection extends Component {
    config = {
        navigationBarTitleText: '字段分组'
    }

    constructor() {
        super(...arguments)
        this.state = {
            checkedList: [],  //已选中数组
            checkboxOption: [],  //全部数组
            card_id: '', //card_id, relation_id
        }
    }

    componentDidMount() {

        const { fields, card_id, } = this.$router.params
        const fieldsData = JSON.parse(fields);

        const { field_selection_list = [], field_selection_group_list = [], } = this.props

        //重组字段分组的数据
        let new_group_array = []
        field_selection_group_list && field_selection_group_list.forEach(objData => {
            if (objData.fields) {
                objData.fields.forEach(item => {
                    item.desc = objData.name   //把分组名称作为描述
                })
                new_group_array.push(objData.fields)
            }
        })

        var combinationArray = new_group_array.reduce(function (a, b) { return a.concat(b) });
        var finalArray = combinationArray.concat(field_selection_list)

        finalArray.forEach(item => {
            item['label'] = item.name
            item['value'] = item.id
            item['desc'] = item.desc
        })

        //取出已经是执行人的id, 组成新数组(已选中)
        let new_arr = fieldsData.map(obj => { return obj.field_id });

        this.setState({
            checkboxOption: finalArray,
            checkedList: new_arr,
            card_id: card_id,
        })

    }

    handleChange(value) {

        var sa = new Set(this.state.checkedList);
        var sb = new Set(value);

        const { dispatch } = this.props
        const { card_id } = this.state

        this.setState({
            checkedList: value
        })

        if (this.state.checkedList.length > value.length) {  //删减
            // // 差集
            // let minus = this.state.checkedList.filter(x => !sb.has(x));
            // let executor_id = minus[0];

            // dispatch({
            //     type: 'tasks/postBoardFieldRelation',
            //     payload: {
            //         fields: [executor_id],
            //         relation_id: card_id,
            //         source_type: '2',
            //     },
            // })
        }
        else if (this.state.checkedList.length < value.length) {  //增加

            //补集
            let complement = [...this.state.checkedList.filter(x => !sb.has(x)), ...value.filter(x => !sa.has(x))];
            let executor_id = complement[0];

            dispatch({
                type: 'tasks/postBoardFieldRelation',
                payload: {
                    fields: [executor_id],
                    relation_id: card_id,
                    source_type: '2',
                },
            })
        }
    }


    render() {

        const { checkboxOption = [] } = this.state

        return (
            <View >
                <AtCheckbox
                    options={checkboxOption}
                    selectedList={this.state.checkedList}
                    onChange={this.handleChange.bind(this)}
                />
            </View>
        )
    }
}

fieldSelection.defaultProps = {

};