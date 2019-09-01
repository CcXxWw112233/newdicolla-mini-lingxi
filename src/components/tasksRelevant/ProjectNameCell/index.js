import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'

export default class ProjectNameCell extends Component {

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    gotoChangeOrgPage() {
        
        Taro.navigateTo({
            url: '../../pages/choiceProject/index'
        })
    }

    render() {

        return (
            <View >
                <View className={indexStyles.list_item} onClick={this.gotoChangeOrgPage}>
                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe649;</Text>
                    </View>
                    <View className={indexStyles.list_item_name}>项目</View>
                    <View className={indexStyles.list_item_detail}>项目名称</View>
                    <View className={`${indexStyles.list_item_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe654;</Text>
                    </View>
                </View>
            </View>
        )
    }
}
