import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
// import indexStyles from './index.scss'
import indexStyles from '../../../selectOrg/index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtIndexes } from 'taro-ui'
import { connect } from '@tarojs/redux';

@connect(({ tasks, board }) => ({
  tasks, board
}))

export default class Indexes extends Component {

  componentWillReceiveProps() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onClick(item) {
    console.log(item, 'item')
  }
  render() {
    const list = [{
      title: 'A',
      key: 'A',
      items: [
        {
          'name': '阿坝'
          // 此处可加其他业务字段
        },
        {
          'name': '阿拉善'
        }]
    },
    {
      title: 'B',
      key: 'B',
      items: [
        {
          'name': '北京'
        },
        {
          'name': '保定'
        }]
    }
    ]

    const { board: { board_list = [] } } = this.props

    console.log('board_list = ', board_list);


    return (
      <View>
         <View className={indexStyles.content_list_item_detail}>
         {board_list.map((value, key) => {
            const { board_name, board_id } = value
            return (
              <View className={indexStyles.list_item_out} key={board_id} onClick={this.onClick.bind(this, value)}>
                <View className={indexStyles.list_item}>
                  <View className={indexStyles.list_item_name}>{board_name}</View>
                  <View className={`${indexStyles.list_item_iconnext}`}>
                    {/* {current_org == id && (
                      <Text className={`${globalStyle.global_iconfont}`}>&#xe641;</Text>
                    )} */}
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </View>


      // <View style='height:100vh'>
      //   <AtIndexes
      //     list={list}
      //     onClick={this.onClick.bind(this)}
      //     isVibrate={false}
      //     animation={true}
      //   >
      //   </AtIndexes>
      // </View>
    )
  }
}
