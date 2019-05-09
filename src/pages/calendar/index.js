import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import CardList from './components/CardList'
import indexStyles from './index.scss'
import CardTypeSelect from './components/CardTypeSelect/index'
import SearchAndMenu from '../board/components/SearchAndMenu'
import CalendarSwiper from './components/CalendarSwiper'

export default class Calendar extends Component {

  config = {
    navigationBarTitleText: '日历'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {
  }

  componentDidHide () { }

  render () {
    const { show_card_type_select } = this.props
    return (
      <View>
        <SearchAndMenu />
        <CalendarSwiper />
        {show_card_type_select && (
          <CardTypeSelect />
        )}
        <CardList />
      </View>
    )
  }
}

