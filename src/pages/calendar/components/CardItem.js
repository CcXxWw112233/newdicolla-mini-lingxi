import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import indexStyles from  './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
import Avatar from '../../../components/avatar'

export default class CardItem extends Component {

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }


  render () {
    const card_type = 'lc_flow'
    const card_logo_1 = (<Text className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}>&#xe63d;</Text>)
    const card_logo_2 = (<Text className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}>&#xe63e;</Text>)
    const card_logo_3 = (<Text className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}>&#xe636;</Text>)
    const card_logo_4 = (<Text className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}>&#xe633;;</Text>)

    return (
      <View >
        <View className={`${globalStyles.global_card_out} ${indexStyles.card_content} `}>
          <View className={`${indexStyles.card_content_left}`}>
            {card_logo_1}
          </View>
          <View className={`${indexStyles.card_content_middle}`}>
            <View className={`${indexStyles.card_content_middle_top}`}>
              <Text className={`${indexStyles.card_title}`}>这是一条任务这是一条任务这是一条任务这是一条任务这是一条任务sdasdasd</Text>
              <Text  className={`${indexStyles.organize}`}>#组织a>项目b</Text>
            </View>
            <View className={`${indexStyles.card_content_middle_bott}`}>
              04月23 08:26 - 04月22 08:00
            </View>
          </View>
          <View className={`${indexStyles.card_content_right}`}>
            <Avatar />
          </View>
        </View>
      </View>
    )
  }
}
