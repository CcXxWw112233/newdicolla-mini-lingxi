
import Taro, { Component } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'

export default class index extends Component {

    constructor() {
        super(...arguments)
    }

    render() {

        const { title, description, options } = this.props

        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.line_cell}>
                    <View className={indexStyles.line_empty}></View>
                    <View className={indexStyles.line}></View>
                </View>

                <View className={indexStyles.content_cell}>
                    <View className={indexStyles.content_padding}>
                        <View className={indexStyles.title}>{title}</View>
                        {
                            options ? (
                                <View className={indexStyles.options}>
                                    {options && options.map((value, key) => {
                                        const { id, label_name, } = value
                                        return (
                                            <View key={id} className={indexStyles.content}>{label_name}</View>
                                        )
                                    })}
                                </View>
                            ) : (<View className={indexStyles.content}>{description}</View>)
                        }

                    </View>
                </View>

            </View>
        )
    }
}

index.defaultProps = {
    title: '', //标题
    description: '', //内容
    options: '', //选择
};