import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'

export default class ChoiceTimes extends Component {

    componentWillReceiveProps(nextProps) { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {

        return (
            <View className={indexStyles.viewStyle}>
               <View className={indexStyles.timeStyle}>
                   <View>2019年9月02日</View>
                   <View>09:30</View>
               </View>
               <View>周一</View>
            </View>
        )
    }
}
