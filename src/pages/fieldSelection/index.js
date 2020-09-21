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
        }
    }

    componentDidMount() {

        // const { contentId, } = this.$router.params

        // this.setState({
        //     card_id: contentId,
        //     // value: listId,
        // })

        const { items } = this.$router.params

        // executors_list.forEach(item => {
        //     item['label'] = item.name
        //     item['value'] = item.id
        // })

        // //取出已经是执行人的id, 组成新数组(已选中)
        // let new_arr = executors.map(obj => { return obj.user_id });

        const { field_selection_list } = this.props

        this.setState({
            checkboxOption: field_selection_list,
            // checkedList: new_arr,
        })
    }

    handleChange(value) {

        var sa = new Set(this.state.checkedList);
        var sb = new Set(value);


        this.setState({
            checkedList: value
        })

        const { dispatch } = this.props
        const { card_id } = this.state

        if (this.state.checkedList.length > value.length) {  //删减
            // 差集
            let minus = this.state.checkedList.filter(x => !sb.has(x));
            let executor_id = minus[0];

            dispatch({
                type: 'tasks/deleteCardExecutor',
                payload: {
                    card_id: card_id,
                    executor: executor_id,
                },
            })
        }
        else if (this.state.checkedList.length < value.length) {  //增加
            //补集
            let complement = [...this.state.checkedList.filter(x => !sb.has(x)), ...value.filter(x => !sa.has(x))];
            let executor_id = complement[0];

            dispatch({
                type: 'tasks/addCardExecutor',
                payload: {
                    card_id: card_id,
                    executor: executor_id,
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
                    // selectedList={this.state.checkedList}
                    onChange={this.handleChange.bind(this)}
                />
            </View>
        )
    }
}

fieldSelection.defaultProps = {

};