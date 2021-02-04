
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { timestampToDateTimeLine } from '../../../../../utils/basicFunction'

export default class index extends Component {

    constructor() {
        super(...arguments)
    }

    onClickAction() {
        const { status } = this.props;
        if (status == '1') {
            Taro.showToast({
                title: '小程序暂不支持编辑,请前往PC端操作',
                icon: 'none',
                duration: 2000
            })
        }
    }

    render() {

        const { title, status, item, value } = this.props
        const datetype = item ? (item.date_precision == '1' ? 'YMD' : 'YMDHM') : ""
        const dateString = timestampToDateTimeLine(item.value, datetype)
        return (
            <View className={indexStyles.viewStyle} onClick={this.onClickAction}>

                <View className={indexStyles.line_cell}>
                    <View className={indexStyles.line_empty}></View>
                    <View className={indexStyles.line}></View>
                </View>

                <View className={indexStyles.content_cell}>
                    <View className={indexStyles.content_padding}>
                        <View className={indexStyles.titleView}>
                            <View className={indexStyles.title}>{title}</View>
                            {item.is_required && item.is_required == '1' ? (<Text className={indexStyles.isrequired}>*</Text>) : (null)}
                        </View>

                        <View className={indexStyles.content}>{dateString}</View>
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