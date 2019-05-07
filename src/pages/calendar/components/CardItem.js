import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'
import '../../../gloalSet/styles/globalStyles.scss'
import Avatar from '../../../components/avatar'
class RuningBoardItem extends Component {

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const starlist = [1, 2, 3, 4, 5]
    const tagList = [1, 2, 3, 4, 5]
    return (
      <View className='index global_horrizontal_padding'>
        <View className='card_content global_card_out'>
          <View className='card_content_left'></View>
          <View className='card_content_right'></View>
        </View>
      </View>
    )
  }
}

export default RuningBoardItem
