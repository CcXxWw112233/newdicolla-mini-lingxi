import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtAvatar } from 'taro-ui'

export default class index extends Component {

  componentWillReceiveProps () { }

  componentDidMount() { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    
    return (
      <View className={indexStyles.viewStyle}>
        <AtAvatar 
          className={indexStyles.avatarStyle}
          circle
          image='https://jdc.jd.com/img/200'>
          </AtAvatar>
          <View className={indexStyles.textStyle}>
            <View className={indexStyles.topStyle}>
              <View className={indexStyles.nameStyle}>赵六</View>
              <View className={indexStyles.timeStyle}>今天 08:09</View>
            </View>
            <View className={indexStyles.bottom_comment_style}>评论了</View>
          </View>
      </View>
    )
  }
}
