import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import CardItem from './CardItem'
import './index.scss'
import '../../../gloalSet/styles/globalStyles.scss'

export default class RuningBoard extends Component {

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className="card_item_out">
        <CardItem />
      </View>
    )
  }
}
