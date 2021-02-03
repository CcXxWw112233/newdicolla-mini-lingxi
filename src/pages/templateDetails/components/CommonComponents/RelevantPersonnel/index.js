import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../../gloalSet/styles/globalStyles.scss'
import { renderRestrictionsTime, } from '../../../../../utils/basicFunction'

export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {

        }
    }

    getTime = () => {
        const { status, deadline_time_type, deadline_value, last_complete_time, deadline_type } = this.props
        let description = ''
        if (status == '0') {
            description = '步骤开始后' + deadline_value + this.getDeadlineTimeType(deadline_time_type) + '内'
            return description
        } else if (status == '1') {
            var itemValue = { deadline_time_type, deadline_value, last_complete_time, deadline_type };
            description = renderRestrictionsTime(itemValue);
            return description
        } else if (status == '2') {
            return '已完成'
        }
    }

    //时间单位转换
    getDeadlineTimeType = (deadline_time_type) => {
        let timeType = '' //最终时间单位
        switch (deadline_time_type) {
            case 'hour':
                timeType = '时'
                break;
            case 'day':
                timeType = '日'
                break
            case 'month':
                timeType = '月'
                break
            default:
                break;
        }
        return timeType;
    }

    render() {

        const { recipients = [], assignees, last_complete_time, } = this.props
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
                            {
                                <View className={indexStyles.content}>
                                    {/* {'完成时间' + ' ' + timestampToTimeEN(last_complete_time)} */}
                                    {this.getTime()}
                                </View>
                            }
                        </View>
                        <View className={indexStyles.assignees}>
                            {assignees && assignees.map((value, key) => {
                                const { id, avatar, } = value
                                return (
                                    <View key={id}>
                                        {
                                            avatar ? (
                                                <Image className={indexStyles.
                                                    avatar_image_style} src={avatar}></Image>
                                            ) : (
                                                    <Text className={`${globalStyles.
                                                        global_iconfont} ${indexStyles.
                                                            avatar_image_style}`}>&#xe647;</Text>
                                                )
                                        }
                                    </View>
                                )
                            })}
                        </View>
                        <View className={indexStyles.make_copy}>
                            {recipients && recipients.length > 0 ? (<View className={indexStyles.recipients}>

                                <View className={indexStyles.title}>抄送人</View>
                                { recipients.map((value, key) => {
                                    const { id, avatar, } = value
                                    return (
                                        <View key={id}>
                                            {
                                                avatar ? (
                                                    <Image className={indexStyles.avatar_image_style} src=
                                                        {avatar}></Image>
                                                ) : (
                                                        <Text className={`${globalStyles.global_iconfont} ${indexStyles.avatar_image_style}`}>&#xe647;</Text>
                                                    )
                                            }
                                        </View>
                                    )
                                })}
                            </View>) : (null)}
                        </View>
                    </View>
                </View>
            </View >
        )
    }
}

index.defaultProps = {
    recipients: [], //填写人array
    assignees: [], //抄送人array
    last_complete_time: '', //最后完成时间
    status: '', //当前节点进度 0未进行 1进行中 2完成
    deadline_time_type: '',  //截止时间类型
    deadline_value: '',    //截止时间数
    deadline_type: '', //限制时间类型 0未限制时间 1有限制时间
};
