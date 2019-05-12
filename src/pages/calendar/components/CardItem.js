import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import indexStyles from  './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import Avatar from '../../../components/avatar'
import CardList from "./CardList";

export default class CardItem extends Component {

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  renderAA = () => {
    return (<Text className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}>&#xe633;</Text>)
  }

  render () {
    const { itemValue = {}, schedule } = this.props
    const { board_id, content_id, content_name, org_id, flag } = itemValue
    const users = itemValue['data'] || []
    const card_logo_1 = (<Text className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}>&#xe63d;</Text>)
    const card_logo_2 = (<Text className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}>&#xe63e;</Text>)
    const card_logo_3 = (<Text className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}>&#xe636;</Text>)
    const card_logo_4 = (<Text className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}>&#xe633;</Text>)

    return (
      <View >
        <View className={`${globalStyles.global_card_out} ${indexStyles.card_content} `}>
          <View className={`${indexStyles.card_content_left}`}>
            {'0' == flag? (
              card_logo_1
            ):(
              '1' == flag? (card_logo_2):(
                '2' == flag?card_logo_3: card_logo_4
              )
            )}
          </View>
          <View className={`${indexStyles.card_content_middle}`}>
            <View className={`${indexStyles.card_content_middle_top}`}>
              <Text className={`${indexStyles.card_title}`}>{content_name}</Text>
              <Text  className={`${indexStyles.organize}`}>#组织a>项目b</Text>
            </View>
            <View className={`${indexStyles.card_content_middle_bott}`}>
              {schedule == '0'? '未排期':  '04月23 08:26 - 04月22 08:00'}
            </View>
          </View>
          <View className={`${indexStyles.card_content_right}`}>
            <Avatar avartarTotal={'multiple'} userList={users}/>
          </View>
        </View>
      </View>
    )
  }
}
CardItem.defaultProps = {
  schedule: '2', //1排期 0 没有排期
}
