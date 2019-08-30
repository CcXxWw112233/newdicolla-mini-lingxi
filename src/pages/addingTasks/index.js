import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import ContentIndex from './components/ContentIndex'


export default class AddingTasks extends Component {
    config = {
        navigationBarTitleText: '新建事项'
    }

    constructor() {
        super(...arguments)
        this.state = {
            current: 0,
            describeInfo: '',
        }
    }

    componentWillMount(e) {
        console.log(e, 'eeeeeeeeee');
        
    }

    handleClick(value) {
        this.setState({
            current: value,
        })
    }
    shili() {
        Taro.navigateTo({
            url: '../../pages/DateTimePicker/index'
        })
    }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }


    render() {
        const tabList = [{ title: '任务' }, { title: '日程' }]
        const state_current = this.state.current
        return (
            <View>
                <AtTabs current={state_current} tabList={tabList} onClick={this.handleClick.bind(this)}>
                    <AtTabsPane current={state_current} index={0}>
                        <ContentIndex />
                    </AtTabsPane>
                    <AtTabsPane current={state_current} index={1}>
                        <ContentIndex />
                    </AtTabsPane>
                </AtTabs>
            </View>
        )
    }
}

