import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../gloalSet/styles/globalStyles.scss'

export default class taksDetails extends Component {
navigationStyle
    config = {
        navigationBarTitleText: '任务详情'
    }
    constructor() {
        super(...arguments)
        this.state = {
        }
    }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <View>
               任务详情
            </View>
        )
    }
}
