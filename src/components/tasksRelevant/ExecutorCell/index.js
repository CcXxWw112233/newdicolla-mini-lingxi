import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../gloalSet/styles/globalStyles.scss'
import Avatar from '../../avatar';

export default class ExecutorCell extends Component {

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    choiceExecutorCellList() {
        Taro.navigateTo({
            url: '../../pages/choiceProject/index'
        })
    }
    closeExecutorCell() {
        console.log('关闭执行人cell');
    }

    render() {
        const description = this.props.executors || []
        return (
            <View className={indexStyles.viewStyle}>
                <View className={indexStyles.list_item} onClick={this.choiceExecutorCellList}>
                    <View className={indexStyles.list_item}>
                        <View className={`${indexStyles.list_item_left_iconnext}`}>
                            <Text className={`${globalStyle.global_iconfont}`}>&#xe7ae;</Text>
                        </View>
                        <View className={indexStyles.list_item_name}>执行人</View>
                        <View className={`${indexStyles.card_content_middle_left}`}>
                            <View className={`${indexStyles.avata_area}`}>
                                <Avatar avartarTotal={'multiple'} userList={description} />
                            </View>
                        </View>
                    </View>
                    <View className={`${indexStyles.list_item_iconnext}`} onClick={this.closeExecutorCell}>
                        <Text className={`${globalStyle.global_iconfont}`}>&#xe7fc;</Text>
                    </View>
                </View>
            </View>
        )
    }
}
