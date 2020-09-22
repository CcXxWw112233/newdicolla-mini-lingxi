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
        navigationBarTitleText: '标签选择',
    }

    state = {
        card_id: '',
        checkedList: [],  //已选中数组
        checkboxOption: [],  //全部数组
    }

    componentDidMount() {

        const { contentId, data, } = this.$router.params

        this.setState({
            card_id: contentId,
        })

        const { label_list = [], tasksDetailDatas = {}, } = this.props

        label_list.forEach(item => {
            item['label'] = item.name
            item['value'] = item.id
        })

        //取出已经是执行人的id, 组成新数组(已选中)
        let new_arr = JSON.parse(data).map(obj => { return obj.label_id });

        this.setState({
            checkboxOption: label_list,
            checkedList: new_arr,
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
            let labelId = minus[0];

            dispatch({
                type: 'tasks/deleteCardLabel',
                payload: {
                    label_id: labelId,
                    card_id: card_id,
                    callBack: this.putCardLabel(value),
                },
            })
        }
        else if (this.state.checkedList.length < value.length) {  //增加
            //补集
            let complement = [...this.state.checkedList.filter(x => !sb.has(x)), ...value.filter(x => !sa.has(x))];
            let labelId = complement[0];

            dispatch({
                type: 'tasks/postCardLabel',
                payload: {
                    label_id: labelId,
                    card_id: card_id,
                    callBack: this.putCardLabel(value),
                },
            })
        }
    }

    putCardLabel = (value) => {

        const { dispatch, tasksDetailDatas, label_list = [], } = this.props
        const { properties = [] } = tasksDetailDatas
        let array = [];
        for (let i = 0; i < value.length; i++) {

            label_list.forEach(obj => {

                if (obj.id === value[i]) {

                    obj.label_id = obj.id
                    obj.label_name = obj.name
                    obj.label_color = obj.color

                    array.push(obj);
                }
            })
        }

        properties.forEach(item => {
            if (item['code'] === 'LABEL') {
                item.data = array
            }
        })

        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...properties,
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

