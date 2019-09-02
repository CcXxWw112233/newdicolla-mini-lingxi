import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'

export default class index extends Component {

  componentWillReceiveProps() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {

    return (
      <View className={indexStyles.viewStyle}>
        <View className={indexStyles.cancel_Style}>王五 新建了任务</View>
        <View className={indexStyles.determine_Style}>2019年9月2日 15:22</View>
      </View>
    )
  }
}
