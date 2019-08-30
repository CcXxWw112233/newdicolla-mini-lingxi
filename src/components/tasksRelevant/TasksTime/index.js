import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'

export default class TasksTime extends Component {

    componentWillReceiveProps(nextProps) { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {

        return (
            <View className={indexStyles.viewStyle}>
                <View className={indexStyles.input_View}>
                <View className={`${indexStyles.list_item_iconnext}`}>
                    <Text className={`${globalStyles.global_iconfont}`}>&#xe661;</Text>
                    </View>
                    <Input className={indexStyles.card_title} placeholder='填写名称'></Input>
                </View>
                <View className={indexStyles.selectionTime}>
                    <View className={indexStyles.startTime}>开始时间</View>
                    <View className={indexStyles.endTime}>结束时间</View>
                </View>
            </View>
        )
    }
}
