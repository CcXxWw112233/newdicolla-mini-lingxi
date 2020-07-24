
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../../../../gloalSet/styles/globalStyles.scss'
import { timestampToTimeEN, } from '../../../../../../utils/basicFunction'

export default class index extends Component {

    constructor() {
        super(...arguments)
        this.state = {

        }
    }

    loadProcessedState = (comment, pass) => {
        let pass_status
        if (comment) {
            if (pass == '0') {
                pass_status = '驳回'
            } else if (pass == '1') {
                pass_status = '通过'
            }
        } else {
            pass_status = '未开始'
        }
        return pass_status;
    }

    approveType = (approve_type) => {
        let approveType;
        if (approve_type == '1') {
            approveType = '串签'
        } else if (approve_type == '2') {
            approveType = '并签'
        } else if (approve_type == '3') {
            approveType = '汇签'
        }
        return approveType;
    }

    render() {
        const { assignees, approve_type, his_comments = [], } = this.props

        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.line_cell}>
                    <View className={indexStyles.line_empty}></View>
                    <View className={indexStyles.line}></View>
                </View>

                <View className={indexStyles.content_cell}>
                    <View className={indexStyles.content_padding}>
                        <View className={indexStyles.fill_in}>
                            <View className={indexStyles.title_content}>审批方式：{this.approveType(approve_type)}</View>
                        </View>
                        <View className={indexStyles.view_cell}>
                            {assignees && assignees.map((item, key) => {
                                const { id, avatar, name, pass, comment, } = item
                                return (
                                    <View key={id}>
                                        <View className={indexStyles.make_copy}>
                                            {
                                                avatar ? (
                                                    <Image className={indexStyles.avatar_image_style} src={avatar}></Image>
                                                ) : (
                                                        <Text className={`${globalStyles.global_iconfont} ${indexStyles.avatar_image_style}`}>&#xe647;</Text>
                                                    )
                                            }
                                            <View className={indexStyles.make_copy_content}>
                                                <View className={indexStyles.name_status_row}>
                                                    <View className={indexStyles.name}>{name}</View>
                                                    <View className={indexStyles.status}>{this.loadProcessedState(comment, pass)}</View>
                                                </View>
                                                <View className={indexStyles.comment_cell}>{comment}</View>

                                            </View>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </View>
                {
                    his_comments.length > 0 ? (<View className={indexStyles.his_comments}>
                        <View className={indexStyles.his_content_padding}>
                            <View className={indexStyles.fill_in}>
                                <View className={indexStyles.title_content}>历史审批</View>
                            </View>
                            {his_comments && his_comments.map((item, key) => {
                                const { id, avatar, name, comment, pass, time } = item
                                return (
                                    <View key={id} className={indexStyles.his_comments_view}>
                                        {
                                            avatar ? (
                                                <Image className={indexStyles.his_avatar_image_style} src={avatar}></Image>
                                            ) : (
                                                    <Text className={`${globalStyles.global_iconfont} ${indexStyles.his_avatar_image_style}`}>&#xe647;</Text>
                                                )
                                        }
                                        <View className={indexStyles.his_comments_content}>
                                            <View className={indexStyles.name_status_cell}>
                                                <View className={indexStyles.his_name}>{name}</View>
                                                <View className={indexStyles.his_status}>{this.loadProcessedState(comment, pass)}</View>
                                            </View>
                                            <View className={indexStyles.his_comment}>{comment}</View>
                                        </View>
                                        <View className={indexStyles.his_time} > {timestampToTimeEN(time)}</View>
                                    </View>
                                )
                            })}
                        </View>
                    </View>) : (<View> </View>)
                }
            </View>
        )
    }
}

index.defaultProps = {
    assignees: '', //审批人array
    approve_type: '', //审批方式
};
