import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import { AtRadio } from 'taro-ui'
import Item from 'antd-mobile-rn/lib/list/ListItem.native'

@connect(({ tasks: { group_list = [], }, }) => ({
    group_list,
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

    handleChange(value) {

        this.setState({
            value
        })

        //更新任务分组
        const { dispatch } = this.props
        const { cardId } = this.state
        dispatch({
            type: 'tasks/putCardBaseInfo',
            payload: {
                card_id: cardId,
                list_id: value
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