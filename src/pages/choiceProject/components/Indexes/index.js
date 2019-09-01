import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { AtIndexes } from 'taro-ui'
import { connect } from '@tarojs/redux';

@connect( ({ indexes}) => ({
    indexes
}))
export default class Indexes extends Component {

  componentWillReceiveProps () { }

  componentDidMount() {
      //获取项目列表
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'board/getProjectList',
    //   payload: { }
    // })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onClick (item) {
    console.log(item)
  }
  render () {
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
    return (
      <View style='height:100vh'>
        <AtIndexes
          list={list}
          onClick={this.onClick.bind(this)}
          isVibrate={false}
          animation={true}
        >
        </AtIndexes>
      </View>
    )
  }
}
