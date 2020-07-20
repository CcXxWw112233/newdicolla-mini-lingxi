import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'

export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {
        }
    }

    render() {

        return (
            <View className={indexStyles.viewStyle}>
                <View className={indexStyles.select_step_number}>
                    1
                </View>

                <View class={indexStyles.step_name}>
                    资料收集1
                </View>

                <View className={indexStyles.open_icon}>
                    <Text className={`${globalStyle.global_iconfont}`}>&#xe8ec;</Text>
                </View>
            </View>
        )
    }
}
