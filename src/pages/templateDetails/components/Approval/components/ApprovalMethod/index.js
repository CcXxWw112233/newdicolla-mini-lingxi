
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../../../gloalSet/styles/globalStyles.scss'

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
                            <View className={indexStyles.title_content}>审批方式：串签</View>
                        </View>

                        <View className={indexStyles.make_copy}>
                            {/* {
                            avatar ? (
                                <Image className={indexStyles.avatar_image_style} src={avatar}></Image>
                            ) : ( */}
                            <Text className={`${globalStyles.global_iconfont} ${indexStyles.avatar_image_style}`}>&#xe647;</Text>
                            {/* )
                        } */}
                            <View className={indexStyles.name}>吴婷</View>
                            <View className={indexStyles.status}>未审批</View>
                        </View>

                    </View>

                </View>

            </View>
        )
    }
}
