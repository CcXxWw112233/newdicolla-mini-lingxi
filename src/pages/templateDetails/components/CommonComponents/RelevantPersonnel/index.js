
import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../../gloalSet/styles/globalStyles.scss'
import { timestampToTimeEN, } from '../../../../../utils/basicFunction'

export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {

        }
    }

    render() {

        const { recipients, assignees, last_complete_time, } = this.props

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
                            <View className={indexStyles.assignees}>
                                {assignees && assignees.map((value, key) => {
                                    const { id, avatar, } = value
                                    return (
                                        <View key={id}>
                                            {
                                                avatar ? (
                                                    <Image className={indexStyles.avatar_image_style} src={avatar}></Image>
                                                ) : (
                                                        <Text className={`${globalStyles.global_iconfont} ${indexStyles.avatar_image_style}`}>&#xe647;</Text>
                                                    )
                                            }
                                        </View>
                                    )
                                })}
                            </View>
                            {
                                last_complete_time ? (
                                    <View className={indexStyles.content}>
                                        {'完成时间' + ' ' + timestampToTimeEN(last_complete_time)}
                                    </View>
                                ) : (<View></View>)
                            }
                        </View>

                        <View className={indexStyles.make_copy}>
                            <View className={indexStyles.title}>抄送人</View>
                            <View className={indexStyles.recipients}>
                                {recipients && recipients.map((value, key) => {
                                    const { id, avatar, } = value
                                    return (
                                        <View key={id}>
                                            {
                                                avatar ? (
                                                    <Image className={indexStyles.avatar_image_style} src={avatar}></Image>
                                                ) : (
                                                        <Text className={`${globalStyles.global_iconfont} ${indexStyles.avatar_image_style}`}>&#xe647;</Text>
                                                    )
                                            }
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

index.defaultProps = {
    recipients: [], //填写人array
    assignees: [], //抄送人array
    last_complete_time: '', //最后完成时间
};