import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { AtCheckbox } from 'taro-ui'

@connect(({ tasks: { executors_list = [], tasksDetailDatas = {}, }, }) => ({
    executors_list, tasksDetailDatas,
}))
export default class sonTaskExecutors extends Component {
    config = {
        navigationBarTitleText: '选择执行人'
    }

    constructor() {
        super(...arguments)
        this.state = {
            checkedList: [],  //已选中数组
            checkboxOption: [],  //全部数组
        }
    }

    componentDidMount() {

        const { contentId, executors = [], } = this.$router.params

        let executorsData;
        let new_arr
        if (executors.length > 0) {
            executorsData = JSON.parse(executors);
            //取出已经是执行人的id, 组成新数组(已选中)
            new_arr = executorsData.map(obj => { return obj.user_id });
        }

        this.setState({
            card_id: contentId,
            // value: listId,
        })

        const { executors_list = [], } = this.props

        executors_list.forEach(item => {
            item['label'] = item.name
            item['value'] = item.id
        })

        this.setState({
            checkboxOption: executors_list,
            checkedList: new_arr,
        })
    }

    componentWillUnmount() {

        const { checkedList } = this.state
        var data = JSON.stringify(checkedList)
        Taro.setStorageSync('son_tasks_executors', data);
    }

    handleChange(value) {

        this.setState({
            checkedList: value
        })


        // var sa = new Set(this.state.checkedList);
        // var sb = new Set(value);

        // const { dispatch } = this.props
        // const { card_id } = this.state

        // if (this.state.checkedList.length > value.length) {  //删减
        //     // 差集
        //     let minus = this.state.checkedList.filter(x => !sb.has(x));
        //     let executor_id = minus[0];

        //     dispatch({
        //         type: 'tasks/deleteCardExecutor',
        //         payload: {
        //             card_id: card_id,
        //             executor: executor_id,
        //             callBack: this.deleteCardExecutor(value),
        //         },
        //     })
        // }
        // else if (this.state.checkedList.length < value.length) {  //增加
        //     //补集
        //     let complement = [...this.state.checkedList.filter(x => !sb.has(x)), ...value.filter(x => !sa.has(x))];
        //     let executor_id = complement[0];

        //     dispatch({
        //         type: 'tasks/addCardExecutor',
        //         payload: {
        //             card_id: card_id,
        //             executor: executor_id,
        //             callBack: this.deleteCardExecutor(value),
        //         },
        //     })
        // }
    }


    //更改本地数据
    // deleteCardExecutor = (value) => {
    //     const { dispatch, tasksDetailDatas, executors_list = [], } = this.props
    //     const { properties = [] } = tasksDetailDatas


    //     let array = [];
    //     for (let i = 0; i < value.length; i++) {

    //         executors_list.forEach(obj => {

    //             if (obj.id === value[i]) {

    //                 array.push(obj);
    //             }
    //         })
    //     }
    //     properties.forEach(item => {
    //         if (item['code'] === 'EXECUTOR') {
    //             item.data = array
    //         }
    //     })

    //     dispatch({
    //         type: 'tasks/updateDatas',
    //         payload: {
    //             tasksDetailDatas: {
    //                 ...tasksDetailDatas,
    //                 ...properties,
    //             }
    //         }
    //     })
    // }


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

sonTaskExecutors.defaultProps = {

};