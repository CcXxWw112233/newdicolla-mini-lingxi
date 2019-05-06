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
          <View className='card_content_top'>
            <Text className='card_title'>这是项目名</Text>
            <Text className='organize'>#合创迪安</Text>
            <Text className='star_list'>
              {starlist.map((value, key) => {
                return (
                  <Text key={key} className='global_iconfont star'>&#xe64b;</Text>
                )
              })}
            </Text>
          </View>
          <View className='card_content_middle'>
            <View className='card_content_middle_left'>
              <View className='avata_area'>
                <Avatar />
              </View>
            </View>
            <View className='card_content_middle_right'>
              <View className='task_1'>剩余任务 <Text>231</Text></View>
              <View className='task_2'>已完成  <Text>231</Text></View>
            </View>
          </View>
          <View className='card_content_bott'>
            <View className='taglist'>
              {tagList.map((value, key) => {
                const rgb = '123,104,238'
                return (
                  <Text className='tag'
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
