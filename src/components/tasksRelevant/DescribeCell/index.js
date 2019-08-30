import Taro, { Component } from '@tarojs/taro'
import { View, Input, Button } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'

export default class DescribeCell extends Component {

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    choiceCloseMilepostList() {
        Taro.navigateTo({
            url: '../../pages/fillDescribe/index'
        })
    }
    closeDescribeCell() {
        console.log('关闭描述')
    }

    render() {

        return (
            <View className={indexStyles.viewStyle}>


                <View className={indexStyles.list_item} onClick={this.choiceCloseMilepostList}>
                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7f5;</Text>
                    </View>
                    <View className={indexStyles.list_item_name}>描述</View>
                    <View className={indexStyles.list_item_detail}>描述...</View>
                </View>

                <View className={`${indexStyles.list_item_iconnext}`} onClick={this.closeDescribeCell}>
                    <Text className={`${globalStyle.global_iconfont}`}>&#xe7fc;</Text>
                </View>
            </View>
        )
    }
}
