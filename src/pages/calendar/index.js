import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import CardList from './components/CardList'
import indexStyles from './index.scss'
import CardTypeSelect from './components/CardTypeSelect/index'
import SearchAndMenu from '../board/components/SearchAndMenu'

class Calendar extends Component {

    config = {
    navigationBarTitleText: '日历'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {
    console.log('1231132')

  }

  componentDidHide () { }

  render () {

    return (
      <View>
        <SearchAndMenu />
        <CardTypeSelect />
        <CardList />
      </View>
    )
  }
}

export default Calendar
