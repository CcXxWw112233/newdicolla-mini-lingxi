import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtInput } from 'taro-ui'

export default class index extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      value: ''
    }
  }

  handleChange (value) {
    this.setState({
      value
    })
    return value
  }

  componentWillReceiveProps() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {

    const { value } = this.state
    const send = value ? '发送' : <Text className={`${globalStyle.global_iconfont}`}>&#xe632;</Text>
    return (
      <View className={indexStyles.viewStyle}>
          <AtInput
            className={indexStyles.inputStyle}
            type='text'
            placeholder='输入评论, 可以@他人'
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
          />
        <View className={`${indexStyles.emoji_icon_button}`}>
          <Text className={`${globalStyle.global_iconfont}`}>&#xe631;</Text>
        </View>
        <View className={`${indexStyles.plus_icon_button}`}>
          {send}
        </View>
      </View>
    )
  }
}
