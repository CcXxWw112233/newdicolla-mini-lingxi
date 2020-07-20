
import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
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

                <View className={indexStyles.line_cell}>
                    <View className={indexStyles.line_empty}></View>
                    <View className={indexStyles.line}></View>
                </View>

                <View className={indexStyles.content_cell}>

                    <View className={indexStyles.content_padding}>

                        <View className={indexStyles.fill_in}>
                            <View className={indexStyles.title}>填写人</View>
                            <View className={indexStyles.content}>完成时间 07/15 09:51</View>
                        </View>

                        <View className={indexStyles.make_copy}>
                            <View className={indexStyles.title}>抄送人</View>
                            <View className={indexStyles.content}></View>
                        </View>

                    </View>

                </View>

            </View>
        )
    }
}
