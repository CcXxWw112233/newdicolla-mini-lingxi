import Taro, { Component } from './@tarojs/taro'
import { View, Button } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'

export default class AddFunctionCell extends Component {

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        return (
            <View className={indexStyles.viewStyle}>
                <View className={indexStyles.itemStyle}>
                    <View className={`${indexStyles.list_item_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7ae;</Text>
                    </View>
                    <View>执行人</View>
                </View>
                <View className={indexStyles.itemStyle}>
                    <View className={`${indexStyles.list_item_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe6a9;</Text>
                    </View>
                    <View>里程碑</View>
                </View>
                <View className={indexStyles.itemStyle}>
                    <View className={`${indexStyles.list_item_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7f5;</Text>
                    </View>
                    <View>描述</View>
                </View>
            </View>
        )
    }
}
