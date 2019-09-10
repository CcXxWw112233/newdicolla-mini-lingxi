import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'


export default class AddFunctionCell extends Component {

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    render() {
        const { isFunction = { } } = this.props
        const executors = isFunction.isExecutors
        const milestone_data = isFunction.isMilestone
        const description = isFunction.isDescription

        return (
            <View className={indexStyles.list_item}>
                {
                    executors ? '' : <View className={indexStyles.itemStyle}>
                        <View className={`${indexStyles.list_item_iconnext}`}>
                            <Text className={`${globalStyle.global_iconfont}`}>&#xe7ae;</Text>
                        </View>
                        <View className={indexStyles.name_style}>执行人</View>
                    </View>
                }
                {
                    milestone_data ? '' : <View className={indexStyles.itemStyle}>
                        <View className={`${indexStyles.list_item_iconnext}`}>
                            <Text className={`${globalStyle.global_iconfont}`}>&#xe6a9;</Text>
                        </View>
                        <View className={indexStyles.name_style}>里程碑</View>
                    </View>
                }
                {
                    description ? '' : <View className={indexStyles.itemStyle}>
                        <View className={`${indexStyles.list_item_iconnext}`}>
                            <Text className={`${globalStyle.global_iconfont}`}>&#xe7f5;</Text>
                        </View>
                        <View className={indexStyles.name_style}>描述</View>
                    </View>
                }

            </View>
        )
    }
}
