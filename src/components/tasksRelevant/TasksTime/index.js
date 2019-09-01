import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import ChoiceTimes from './ChoiceTimes/index'


export default class TasksTime extends Component {

    componentWillReceiveProps(nextProps) { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    ejectTimePicks = () => {
        debugger
        this.props.timePicks()
    }

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
                    <ChoiceTimes onClick={this.ejectTimePicks}/>
                    <ChoiceTimes onClick={this.ejectTimePicks}/>
                </View>
            </View>
        )
    }
}
