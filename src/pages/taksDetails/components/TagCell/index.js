import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtTag } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { LabelSelection } from "../../../labelSelection"
@connect(({ tasks: { tasksDetailDatas = {}, } }) => ({
  tasksDetailDatas,
}))
export default class index extends Component {

  state = {

    isTagCellClick: true,
    labelSelectionShow: false
  }

  clickTagCell = () => {

    const { dispatch, label_data, editAuth } = this.props
    const { isTagCellClick, } = this.state

    if (!editAuth) {
      Taro.showToast({
        title: '您没有该项目的编辑权限',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (isTagCellClick) {
      this.setState({
        isTagCellClick: false,
      })

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
        this.setState({
          labelSelectionShow: true
        })
        // Taro.navigateTo({
        // url: `../../pages/labelSelection/index?contentId=${contentId}&data=${JSON.stringify(label_data)}`
        // })
      })

      const that = this
      setTimeout(function () {
        that.setState({
          isTagCellClick: true
        })
      }, 1500);
    }
  }

  onClickAction = () => {
    this.setState({
      labelSelectionShow: false
    })
    typeof this.props.onClickAction == "function" &&
      this.props.onClickAction();
  }
  deleteCardProperty = () => {

    const { dispatch, propertyId, cardId, editAuth } = this.props
    if (!editAuth) {
      Taro.showToast({
        title: '您没有该项目的编辑权限',
        icon: 'none',
        duration: 2000
      })
      return;
    }
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
    let contentId = Taro.getStorageSync('tasks_detail_contentId')

    const { label_data = [], editAuth } = this.props
    const { labelSelectionShow } = this.state;
    return (
      <View className={indexStyles.list_item} >
        <View className={indexStyles.list_left} onClick={this.clickTagCell}>
          <View className={`${indexStyles.list_item_left_iconnext}`}>
            <Text className={`${globalStyle.global_iconfont}`}>&#xe86d;</Text>
          </View>
          {/* <View className={indexStyles.list_item_name}>标签</View> */}
          <View className={indexStyles.tagCell_list_item_detail}>
            {
              label_data && label_data.length > 0 ? (
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
              ):(
                  <View className={indexStyles.place_style}>选择标签</View>
              )
            }
          </View>
        </View>
        <View className={`${indexStyles.list_item_iconnext}`} onClick={this.deleteCardProperty}>
          <Text className={`${globalStyle.global_iconfont}`}>&#xe7fc;</Text>
        </View>
        {

          labelSelectionShow ? (<LabelSelection onClickAction={this.onClickAction} title="标签" labelSelectionShow={labelSelectionShow} data={label_data} contentId={contentId}></LabelSelection>) : (null)
        }

      </View>
    )
  }
}
