
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

    loadProcessedState = (processed) => {
        let processed_status
        if (processed == '0') {
            processed_status = '未开始'
        } else if (processed == '1') {
            processed_status = '审批中'
        } else if (processed == '2') {
            processed_status = '通过'
        }
        return processed_status;
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
        const { assignees, approve_type, } = this.props
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
                                const { id, avatar, name, processed, } = item

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
                                            <View className={indexStyles.name}>{name}</View>
                                            <View className={indexStyles.status}>{this.loadProcessedState(processed)}</View>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

index.defaultProps = {
    assignees: '', //审批人array
    approve_type: '', //审批方式
};