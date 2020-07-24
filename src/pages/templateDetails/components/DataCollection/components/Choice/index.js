
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

        const { title, options, } = this.props

        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.line_cell}>
                    <View className={indexStyles.line_empty}></View>
                    <View className={indexStyles.line}></View>
                </View>

                <View className={indexStyles.content_cell}>
                    <View className={indexStyles.content_padding}>

                        <View className={indexStyles.title}>{title}</View>

                        <View className={indexStyles.choice_view}>
                            {options && options.map((item, key) => {
                                const { flow_file_id, label_name } = item
                                return (
                                    <View key={flow_file_id} className={indexStyles.choice_name}>{label_name}</View>
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
    title: '', //标题
    options: [], //选项列表
};