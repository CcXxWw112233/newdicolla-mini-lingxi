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
        const title = this.props.title
        const name = this.props.name
        const tasksIcon = <Text className={`${globalStyle.global_iconfont}`}>&#xe6a8;</Text>
        const boardIcon = <Text className={`${globalStyle.global_iconfont}`}>&#xe6a7;</Text>
        return (
            <View >
                <View className={indexStyles.list_item} onClick={this.gotoChangeOrgPage}>
                    <View className={`${indexStyles.list_item_left_iconnext}`}>
                        {title === '项目' ? (boardIcon) : (tasksIcon)}
                    </View>
                    <View className={indexStyles.list_item_name}>{title}</View>
                    <View className={indexStyles.list_item_detail}>{name}</View>
                    <View className={`${indexStyles.list_item_iconnext}`}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe654;</Text>
                    </View>
                </View>
            </View>
        )
    }
}
