import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'

export default class MilepostCell extends Component {

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    choiceCloseMilepostList() {
        Taro.navigateTo({
            url: '../../pages/choiceProject/index'
        })
    }
    closeMilepostCell() {
        console.log('关闭里程碑')
    }

    render() {
        const milestone_data = this.props.milestone_data || ''
        return (
            <View className={indexStyles.viewStyle}>

                <View className={indexStyles.list_item} onClick={this.choiceCloseMilepostList}>
                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe636;</Text>
                    </View>
                    <View className={indexStyles.list_item_name}>里程碑</View>
                    <View className={indexStyles.list_item_detail}>{milestone_data.name}</View>
                </View>

                <View className={`${indexStyles.list_item_iconnext}`} onClick={this.closeMilepostCell}>
                    <Text className={`${globalStyle.global_iconfont}`}>&#xe7fc;</Text>
                </View>
            </View>
        )
    }
}
