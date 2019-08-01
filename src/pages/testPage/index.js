import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import './index.scss'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"

const getEffectOrReducerByName = name => `testPage/${name}`
@connect(({ testPage, board }) => ({
  testPage, board
}))
export default class TestPage extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () {

  }

  componentDidShow (opt) {
    // console.log({opt})
  }

  componentWillMount () {
    console.log(this.$router.params) // 输出 { id: 2, type: 'test' }
  }
  componentDidHide () { }

  setNumber(type) {
    const { dispatch, testPage: { number } } = this.props
    let number_new = number
    dispatch({
      type: getEffectOrReducerByName('updateDatas'),
      payload: {
        number: 'add' == type ? ++number_new: --number_new
      }
    })
  }
  effetCope() {
    const { dispatch } = this.props
    dispatch({
      type: getEffectOrReducerByName('effectsDemo'),
      payload: {
      }
    })
    dispatch({
      type: 'board/updateDatas',
      payload: {
        board_id: '11111'
      }
    })
  }

  render () {
    const { testPage: { number }, board: { board_id }} = this.props
    return (
      <View className='index'>
        <Button className='增加' onClick={this.setNumber.bind(this, 'add')}>+</Button>
        <Button className='减少' onClick={this.setNumber.bind(this, 'dec')}>-</Button>
        <Button className='异步' onClick={this.effetCope}>异步</Button>

        <View><Text>{number}</Text></View>
        <View><Text>{board_id}</Text></View>

        <View>
          <AtModal isOpened>
            <AtModalHeader>标题</AtModalHeader>
            <AtModalContent>
              这里是正文内容，欢迎加入京东凹凸实验室
              这里是正文内容，欢迎加入京东凹凸实验室
              这里是正文内容，欢迎加入京东凹凸实验室
            </AtModalContent>
            <AtModalAction> <Button>取消</Button> <Button>确定</Button> </AtModalAction>
          </AtModal>
        </View>
      </View>
    )
  }
}

