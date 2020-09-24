import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { AtCheckbox } from 'taro-ui'

@connect(({ tasks: { tasksDetailDatas = {}, field_selection_list = [], }, }) => ({
    tasksDetailDatas, field_selection_list,
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

        const { contentId, fields, card_id, } = this.$router.params
        const fieldsData = JSON.parse(fields);

        const { field_selection_list = [], } = this.props

        field_selection_list.forEach(item => {
            item['label'] = item.name
            item['value'] = item.id
        })

        //取出已经是执行人的id, 组成新数组(已选中)
        let new_arr = fieldsData.map(obj => { return obj.field_id });

        this.setState({
            checkboxOption: field_selection_list,
            checkedList: new_arr,
            card_id: card_id,
        })
    }

    handleChange(value) {

        var sa = new Set(this.state.checkedList);
        var sb = new Set(value);

        const { dispatch } = this.props
        const { card_id } = this.state

        if (this.state.checkedList.length > value.length) {  //删减

        }
        else if (this.state.checkedList.length < value.length) {  //增加

            this.setState({
                checkedList: value
            })

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