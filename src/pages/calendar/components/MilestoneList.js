import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import MilestoneItem from './MilestoneItem'
import indexstyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import CardTypeSelect from "./CardTypeSelect";

@connect(({ calendar: {sche_card_list, no_sche_card_list} }) => ({
  sche_card_list, no_sche_card_list
}))
export default class MilestoneList extends Component {

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { schedule, sche_card_list = [] } = this.props
    return (
      <View className={`${indexstyles.card_item_out} ${globalStyles.global_horrizontal_padding}`}>
        {sche_card_list.map((value, key) => {
          const { content_id, flag } = value
          return flag == '3' && (
            <View key={content_id}>
              <MilestoneItem  itemValue={value} schedule={schedule}/>
            </View>
          )
        })}
      </View>
    )
  }
}

MilestoneList.defaultProps = {
  schedule: '2', //1排期 0 没有排期
}
