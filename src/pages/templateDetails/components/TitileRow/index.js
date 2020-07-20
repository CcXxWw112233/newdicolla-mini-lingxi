import { connect } from '@tarojs/redux';
import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'


@connect(({ workfile }) => ({

}))
export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {
        }
    }

    render() {

        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.workflow_icon}>
                    <Text className={`${globalStyle.global_iconfont}`}>&#xe68c;</Text>
                </View>

                <View class={indexStyles.workflow_name}>
                    沙寮审批流程
                </View>

                <View class={indexStyles.workflow_start_time}>
                    07/15 09:00 开始
                </View>

            </View>
        )
    }
}
