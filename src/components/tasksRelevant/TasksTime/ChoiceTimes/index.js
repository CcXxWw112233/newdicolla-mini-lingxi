import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import { timestampToTimeZH } from '../../../../utils/basicFunction'

export default class ChoiceTimes extends Component {

    componentWillReceiveProps(nextProps) { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        const time = this.props.time
        const timeTable = timestampToTimeZH(time)
        // const date = timeTable.substring(2, '日')
        // const hour = timeTable.slice(0, -1)

        return (
            <View className={indexStyles.viewStyle}>
               <View className={indexStyles.timeStyle}>
                   <View>{timeTable}</View>
                   {/* <View>{hour}</View> */}
               </View>
               <View>周一</View>
            </View>
        )
    }
}
