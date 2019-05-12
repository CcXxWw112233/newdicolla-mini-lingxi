import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import CardItem from './CardItem'
import indexstyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'

export default class CardList extends Component {

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className={`${indexstyles.card_item_out} ${globalStyles.global_horrizontal_padding}`}>
        <CardItem />
        <CardItem />
        <CardItem />
        <CardItem />
        <CardItem />
        <CardItem />
        <CardItem />
        <CardItem />
        <View className={indexstyles.no_more_text}>没有更多内容了~</View>

      </View>
    )
  }
}
