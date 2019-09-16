import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
// import indexStyles from './index.scss'
import indexStyles from '../../../selectOrg/index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtIndexes } from 'taro-ui'
import { connect } from '@tarojs/redux';

@connect(({ tasks: { tasks_list = [], milestone_list = [], executors_list = [],}, board: { board_list = [], }, }) => ({
  board_list, tasks_list, milestone_list, executors_list,
}))
export default class Indexes extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      value: '',
    }
  }
  componentWillReceiveProps() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onClick = (item) => {
    this.props.callback(item)
  }

  isNewArray = () => {
    const { titleName, board_list, tasks_list, milestone_list, executors_list, } = this.props
    let newArray = []
    if (titleName === '项目') {
      newArray = board_list.map(item => {
        item.id = item.board_id;
        item.name = item.board_name;
        return item
      }) || []
    }
    else if (titleName === '任务分组') {
      newArray = tasks_list.map(item => {
        item.id = item.list_id;
        item.name = item.list_name;
        return item
      }) || []
    }else if (titleName === '执行人') {
      newArray = executors_list.map(item => {
        item.id = item.id
        item.name = item.name
        return item
      }) || []
    } else if (titleName === '里程碑') {
      newArray = milestone_list.map(item => {
        item.id = item.id
        item.name = item.name
        return item
      }) || []
    }
    return newArray
  }

  render() {
    return (
      <View>
        <View className={indexStyles.content_list_item_detail}>
          {this.isNewArray().map((value, key) => {
            const { id, name } = value
            return (
              <View className={indexStyles.list_item_out} key={id} onClick={this.onClick.bind(this, value)}>
                <View className={indexStyles.list_item}>
                  <View className={indexStyles.list_item_name}>{name}</View>
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
