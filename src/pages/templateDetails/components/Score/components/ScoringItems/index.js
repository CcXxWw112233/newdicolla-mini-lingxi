
import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
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
                    <View className={indexStyles.scoring_items_title}>评分项</View>
                    {/* <View className={indexStyles.scoring_input}>
                        <ScrollView
                            scrollX
                        >
                        </ScrollView>

                    </View> */}
                    <View className={indexStyles.average}>
                        {/* {
                            avatar ? (
                                <Image className={indexStyles.avatar_image_style} src={avatar}></Image>
                            ) : ( */}
                        <Text className={`${globalStyles.global_iconfont} ${indexStyles.avatar_image_style}`}>&#xe647;</Text>
                        {/* )
                        } */}
                        <View className={indexStyles.rater_name}>吴婷</View>
                        <View className={indexStyles.average_number}>67分</View>
                    </View>
                    <View class={indexStyles.opinion_cell}>
                        <View class={indexStyles.opinion_title}>意见</View>
                        <View class={indexStyles.opinion_content}>填写</View>
                    </View>
                    <View class={indexStyles.complete}>
                        <View class={indexStyles.complete_button}>完成</View>
                    </View>
                </View>
            </View>
        )
    }
}
