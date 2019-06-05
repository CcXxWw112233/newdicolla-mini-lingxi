import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import indexStyles from  './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import Avatar from '../../../components/avatar'
import { getOrgName, timestampToTimeZH } from '../../../utils/basicFunction'
import { connect } from '@tarojs/redux'

@connect(({ my: { org_list } }) => ({
  org_list
}))
export default class MilestoneItem extends Component {

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  renderAA = () => {
    return (<Text className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}>&#xe633;</Text>)
  }

  render () {
    const { itemValue = {}, schedule, org_list } = this.props
    const { board_id, content_id, content_name, org_id, flag, board_name, start_time, due_time, is_realize } = itemValue
    const users = itemValue['data'] || []
    const card_logo_4 = (<Text className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`} style={`color: #ffffff`}>&#xe636;</Text>)

    return (
      <View >
        <View className={`${globalStyles.global_card_out} ${indexStyles.card_content} ${indexStyles.card_content2}`} style={`background-color: #FAAD14`}>
          <View className={`${indexStyles.card_content_left}`}>
            {card_logo_4}
          </View>
          <View className={`${indexStyles.card_content_middle}`}>
            <View className={`${indexStyles.card_content_middle_top}`}>
              <Text className={`${indexStyles.card_title_2}`}>{content_name}</Text>
              <Text className={`${indexStyles.organize_2}`}>#{getOrgName({org_id, org_list})}>{board_name}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
MilestoneItem.defaultProps = {
  schedule: '2', //1排期 0 没有排期
}
