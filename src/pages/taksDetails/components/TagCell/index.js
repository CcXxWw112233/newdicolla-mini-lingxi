import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtTag } from 'taro-ui'
import { connect } from '@tarojs/redux'

@connect(({ tasks: { tasksDetailDatas = {}, } }) => ({
  tasksDetailDatas,
}))
export default class index extends Component {

  clickTagCell = () => {

    const { dispatch, label_data, } = this.props

    let boardId = Taro.getStorageSync('tasks_detail_boardId')
    let contentId = Taro.getStorageSync('tasks_detail_contentId')

    Promise.resolve(
      dispatch({
        type: 'tasks/getLabelList',
        payload: {
          board_id: boardId,
        },
      })
    ).then(res => {

      Taro.navigateTo({
        url: `../../pages/labelSelection/index?contentId=${contentId}&data=${JSON.stringify(label_data)}`
      })
    })
  }

  deleteCardProperty = () => {

    const { dispatch, propertyId, cardId } = this.props

    dispatch({
      type: 'tasks/deleteCardProperty',
      payload: {
        property_id: propertyId,
        card_id: cardId,
        callBack: this.deleteTasksFieldRelation(propertyId),
      },
    })
  }

  deleteTasksFieldRelation = (propertyId) => {

    const { dispatch, tasksDetailDatas, } = this.props
    const { properties = [], } = tasksDetailDatas

    let new_array = []
    properties.forEach(element => {

      if (element.id !== propertyId) {
        new_array.push(element)
      }
    });

    dispatch({
      type: 'tasks/updateDatas',
      payload: {
        tasksDetailDatas: {
          ...tasksDetailDatas,
          ...{ properties: new_array },
        }
      }
    })
  }

  render() {
    const { label_data = [] } = this.props
    return (
      <View className={indexStyles.list_item} >
        <View className={indexStyles.list_left} onClick={this.clickTagCell}>
          <View className={`${indexStyles.list_item_left_iconnext}`}>
            <Text className={`${globalStyle.global_iconfont}`}>&#xe6ac;</Text>
          </View>
          <View className={indexStyles.list_item_name}>标签</View>
          <View className={indexStyles.tagCell_list_item_detail}>
            {
              label_data.map((tag, key) => {
                const rgb = tag.label_color;
                return (
                  <View className={indexStyles.tagCell_list_item}>
                    <AtTag type='primary' customStyle={{
                      color: `rgba(${rgb},1)`,
                      backgroundColor: `rgba(${rgb},.2)`,
                      border: `1px solid rgba(${rgb},1)`,
                    }}>
                      {tag.label_name}
                    </AtTag>
                  </View>
                )
              })
            }
          </View>
        </View>
        <View className={`${indexStyles.list_item_iconnext}`} onClick={this.deleteCardProperty}>
          <Text className={`${globalStyle.global_iconfont}`}>&#xe7fc;</Text>
        </View>
      </View>
    )
  }
}
