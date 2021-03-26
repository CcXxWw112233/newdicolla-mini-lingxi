import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
@connect(({
    tasks: { milestone_list = [], tasksDetailDatas, },
}) => ({
    milestone_list, tasksDetailDatas,
}))
export default class taskGroupPicker extends Component {
    state = {
        current_select_taskGroup_name: '未选择'
    }

    componentDidMount() {
        const { contentId, listId } = this.$router.params
        this.setState({
            card_id: contentId,
            value: listId,
        })
        const { tasksGroupList = [] } = this.props

        // tasksGroupList.forEach(item => {
        //     item['label'] = item.list_name
        //     item['value'] = item.list_id
        // })
    }
    putCardBaseInfo = (value, currtne_value,) => {
        const { tasksGroupList = [], } = this.state
        let listName = ''
        if (value !== currtne_value) {
            // tasksGroupList.forEach(obj => {
            // if (obj['list_id'] === value) {
            // listName = obj.list_name;
            // }
            // })
        }
        else {
            // this.setState({
            // value: '',
            // })
        }
        const { dispatch, tasksDetailDatas, } = this.props
        dispatch({
            type: 'tasks/updateDatas',
            payload: {
                tasksDetailDatas: {
                    ...tasksDetailDatas,
                    ...{ list_name: listName },
                }
            }
        })
    }
    onChange = e => {
        const {
            tasksGroupList,
            listId,
            contentId
        } = this.props;
        var listId1 = listId;
        var currtne_value = tasksGroupList[e.detail.value]['list_id']
        if (currtne_value !== listId) {
            listId1 = currtne_value
            //更新任务分组
            const { dispatch } = this.props
            const { card_id } = this.state
            dispatch({
                type: 'tasks/putCardBaseInfo',
                payload: {
                    card_id: contentId,
                    list_id: currtne_value,

                    calback: this.putCardBaseInfo(currtne_value, listId),
                }
            }).then(res => {
                this.setState({
                    current_select_taskGroup_name: tasksGroupList[e.detail.value]['list_name']
                })
            })
        }
    }

    render() {
        const {
            title,
            tasksGroupList,
            editAuth
        } = this.props;
        const { current_select_taskGroup_name } = this.state;
        var rangeKey = 'list_name';
        return (
            <View>
                <Picker rangeKey={rangeKey} disabled={!editAuth} mode='selector' range={tasksGroupList} onChange={this.onChange}>
                    <View className={indexStyles.projectNameCellPicker}>
                        {current_select_taskGroup_name != '未选择' || !title ? current_select_taskGroup_name : title}
                    </View>
                </Picker>
            </View >
        );
    }

}
taskGroupPicker.defaultProps = {
    title: "", //显示的信息, 是
    dataArray: [], //Picker的自定义数据源, 是
    tag: "", //标识符, 是
};