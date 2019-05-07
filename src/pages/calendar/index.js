import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import CardList from './components/CardList'
import './index.scss'

class Calendar extends Component {

    config = {
    navigationBarTitleText: '日历'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='global_horrizontal_padding'>
        <CardList />
      </View>
    )
  }
}

export default Calendar
