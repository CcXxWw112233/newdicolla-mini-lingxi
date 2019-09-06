import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtInput } from 'taro-ui'
import { connect } from '@tarojs/redux';

@connect(({ tasks }) => ({
  tasks
}))
export default class index extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      value: ''
    }
  }

  handleChange (value) {
    console.log(value, 'sssss')
    this.setState({
      value
    })
  }

  onSend = () => {
    const { dispatch } = this.props
    const { value } = this.state
    const content_Id = this.props.content
    dispatch({
      type: 'tasks/addComment',
      payload: {
        comment: value,
        card_id: content_Id,
      }
    })
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
            value={value}
            onChange={this.handleChange.bind(this)}
          />
        <View className={`${indexStyles.emoji_icon_button}`}>
          <Text className={`${globalStyle.global_iconfont}`}>&#xe631;</Text>
        </View>
        {/* <View className={`${indexStyles.plus_icon_button}`} onClick={this.onSend} disabled={isDisabled}> */}
        <View className={`${indexStyles.plus_icon_button}`} onClick={this.onSend}>
          {send}
        </View>
      </View>
    )
  }
}
