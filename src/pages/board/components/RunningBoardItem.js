import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'
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
      <View >
        <View className={`${globalStyles.global_card_out} ${indexStyles.card_content}`}>
          <View className={`${indexStyles.card_content_top}`}>
            <Text className={`${indexStyles.card_title}`}>这是项目名</Text>
            <Text className={`${indexStyles.organize}`}>#合创迪安</Text>
            <Text className={`${indexStyles.star_list}`}>
              {starlist.map((value, key) => {
                return (
                  <Text key={key} className={`${globalStyles.global_iconfont} ${indexStyles.star}`}>&#xe64b;</Text>
                )
              })}
            </Text>
          </View>
          <View  className={`${indexStyles.card_content_middle}`}>
            <View  className={`${indexStyles.card_content_middle_left}`}>
              <View  className={`${indexStyles.avata_area}`}>
                <Avatar />
              </View>
            </View>
            <View  className={`${indexStyles.card_content_middle_right}`}>
              <View  className={`${indexStyles.task_1}`}>剩余任务 <Text>231</Text></View>
              <View  className={`${indexStyles.task_2}`}>已完成  <Text>231</Text></View>
            </View>
          </View>
          <View  className={`${indexStyles.card_content_bott}`}>
            <View  className={`${indexStyles.taglist}`}>
              {tagList.map((value, key) => {
                const rgb = '123,104,238'
                return (
                  <Text className='tag'
                        className={`${indexStyles.tag}`}
                        key={key}
                        style={{color: `rgba(${rgb},1)`, backgroundColor: `rgba(${rgb},.4)`, border: `1px solid rgba(${rgb},1)`}}
                  >卡机阿斯顿</Text>
                )
              })}
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default RuningBoardItem
