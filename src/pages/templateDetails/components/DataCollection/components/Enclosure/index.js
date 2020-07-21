
import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../../../gloalSet/styles/globalStyles.scss'

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
                        <View className={indexStyles.title}>附件</View>
                        <View className={indexStyles.enclosure}>
                            <View className={indexStyles.enclosure_icon}>
                                <Text className={`${globalStyle.global_iconfont}`}>&#xe669;</Text>
                            </View>
                            <View className={indexStyles.enclosure_name}>采集.jpg</View>
                        </View>
                    </View>

                </View>

            </View>
        )
    }
}
