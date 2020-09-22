import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { AtRadio } from 'taro-ui'
import Item from 'antd-mobile-rn/lib/list/ListItem.native'

@connect(({ tasks: { group_list = [], tasksDetailDatas = {}, }, }) => ({
    group_list, tasksDetailDatas,
}))
export default class tasksGroup extends Component {
    config = {
        navigationBarTitleText: '选择任务分组'
    }

    constructor() {
        super(...arguments)
        this.state = {
            value: '',
            groupList: [],
            card_id: '',
        }
    }

    handleChange(value,) {

        this.setState({
            value,
        })

        //更新任务分组
        const { dispatch, tasksDetailDatas, } = this.props
        const { card_id, } = this.state

        dispatch({
            type: 'tasks/putCardBaseInfo',
            payload: {
                card_id: card_id,
                list_id: value,
                calback: this.putCardBaseInfo(value),
            }

        }).then(res => {
            // if () {
            // }
        })
    }

    putCardBaseInfo = (value) => {
        const { groupList = [], } = this.state

        let listName = ''
        groupList.forEach(obj => {
            if (obj['list_id'] === value) {
                listName = obj.list_name;
            }
        })

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

    componentDidMount() {

        const { contentId, listId } = this.$router.params

        this.setState({
            card_id: contentId,
            value: listId,
        })

        const { group_list = [] } = this.props

        group_list.forEach(item => {
            item['label'] = item.list_name
            item['value'] = item.list_id
        })

        this.setState({
            groupList: group_list,
        })
    }

    render() {

        const { groupList = [] } = this.state

        return (
            <View >
                <AtRadio
                    options={groupList}
                    value={this.state.value}
                    onClick={this.handleChange.bind(this)}
                />
            </View>
        )
    }
}

tasksGroup.defaultProps = {

};