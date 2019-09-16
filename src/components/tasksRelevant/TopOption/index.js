import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'

export default class TopOption extends Component {

    constructor(props) {
        super(props)
    }

    componentWillReceiveProps() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    cancelChoice() {
        Taro.navigateBack({})
    }

    determineChoice = () => {
        this.props.topCurrencyDetermineChoice()
    }

    render() {
        return (
            <View className={indexStyles.viewStyle}>
                <View className={indexStyles.cancel_Style} onClick={this.cancelChoice}>取消</View>
                <View className={indexStyles.determine_Style} onClick={this.determineChoice}>确定</View>
            </View>
        )
    }
}
