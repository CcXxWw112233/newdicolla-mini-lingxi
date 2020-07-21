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

        const { sort, name, runtime_type } = this.props

        return (
            <View className={indexStyles.viewStyle}>
                <View className={indexStyles.select_step_number}>
                    {sort ? sort : ''}
                </View>

                <View class={indexStyles.step_name}>
                    {name ? name : ''}
                </View>

                <View className={indexStyles.runtime_type}>
                    {runtime_type == '1' ? '被驳回' : ''}
                </View>

                <View className={indexStyles.open_icon}>
                    <Text className={`${globalStyle.global_iconfont}`}>&#xe8ec;</Text>
                </View>
            </View>
        )
    }
}
