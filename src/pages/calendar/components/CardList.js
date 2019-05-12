import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import CardItem from './CardItem'
import indexstyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import CardTypeSelect from "./CardTypeSelect";

@connect(({ calendar: {sche_card_list, no_sche_card_list} }) => ({
  sche_card_list, no_sche_card_list
}))
export default class CardList extends Component {

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { schedule, sche_card_list = [], no_sche_card_list = [] } = this.props
    const card_list = schedule == '1'? sche_card_list: no_sche_card_list //未排其和已排期的情况分别取不同数据
    return (
      <View className={`${indexstyles.card_item_out} ${globalStyles.global_horrizontal_padding}`}>
        {card_list.map((value, key) => {
          return (
            <View key={key}>
              <CardItem  itemValue={value} schedule={schedule}/>
            </View>
          )
        })}

        <View className={indexstyles.no_more_text}>没有更多内容了~</View>

      </View>
    )
  }
}

CardList.defaultProps = {
  schedule: '2', //1排期 0 没有排期
}
