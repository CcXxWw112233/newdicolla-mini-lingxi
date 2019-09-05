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
        this.props.timePicks()
    }

    render() {
        const cellInfo = this.props.cellInfo
        const card_name = cellInfo.cardName || ''
        const input_disabled = !card_name ? false : true
        const sTime = cellInfo.sTime || ''
        const eTime = cellInfo.eTime || ''
        return (
            <View className={indexStyles.viewStyle}>
                <View className={indexStyles.input_View}>
                <View className={`${indexStyles.list_item_iconnext}`}>
                    <Text className={`${globalStyles.global_iconfont}`}>&#xe661;</Text>
                    </View>
                    <Input className={indexStyles.card_title} placeholder='填写名称'  value={card_name} disabled={input_disabled}></Input>
                </View>
                <View className={indexStyles.selectionTime}>  
                    <ChoiceTimes onClick={this.ejectTimePicks} time={sTime}/>
                    <ChoiceTimes onClick={this.ejectTimePicks} time={eTime}/>
                </View>
            </View>
        )
    }
}
