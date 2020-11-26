import { connect } from '@tarojs/redux';
import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { timestampToTimeEN, } from '../../../../utils/basicFunction'

@connect(({ workfile }) => ({

}))
export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {
        }
    }

    render() {

        const { create_time, name } = this.props

        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.workflow_icon}>
                    <Text className={`${globalStyle.global_iconfont}`}>&#xe68c;</Text>
                </View>

                <View class={indexStyles.workflow_name}>
                    {name ? name : ''}
                </View>
                {
                    create_time ? (<View class={indexStyles.workflow_start_time}>
                        {timestampToTimeEN(create_time) + ' ' + '开始'}
                    </View>) : (<View></View>)
                }
            </View>
        )
    }
}

index.defaultProps = {
    create_time: '', //完成时间
    name: '', //流程名称
};