import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import ChoiceTimes from './ChoiceTimes/index'
import { timestampToTimeZH } from '../../../utils/basicFunction'

export default class TasksTime extends Component {

    componentWillReceiveProps(nextProps) { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    ejectTimePicks = () => {
        this.props.timePicks()
    }

    render() {
        const { cellInfo = {} } = this.props
        const card_name = cellInfo.cardDefinition
        const input_disabled = !card_name ? false : true
        const sTime = cellInfo.sTime
        const eTime = cellInfo.eTime
        
        return (
            <View className={indexStyles.view_Style}>
                <View className={indexStyles.input_View}>
                    <View className={`${indexStyles.list_item_iconnext}`}>
                        <Text className={`${globalStyles.global_iconfont}`}>&#xe661;</Text>
                    </View>
                    <Input className={indexStyles.card_title} placeholder='填写名称' value={card_name} disabled={input_disabled}></Input>
                </View>
                <View className={indexStyles.selectionTime}>
                    <View className={indexStyles.startTime} >
                        {/* <ChoiceTimes onClick={this.ejectTimePicks} time={sTime} /> */}
                        {sTime ? timestampToTimeZH(sTime) : '开始时间'}
                    </View>
                    <View className={indexStyles.endTime} >
                        {/* <ChoiceTimes onClick={this.ejectTimePicks} time={eTime} /> */}
                        {eTime ? timestampToTimeZH(eTime) : '结束时间'}
                    </View>
                </View>
            </View>
        )
    }
}
