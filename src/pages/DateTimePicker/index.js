import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import indexStyles from './index.scss'

export default class PagePicker extends Component {
  state = {
    dateSel: '2018-04-22',
    arr: [
          ['2018年','2019年','2020年'], 
          ['1月','2月','3月'], 
          ['1日','2日','3日','4日'], 
          ['1时','2时','3时'], 
          ['1分','2分','3分']
        ],
  }
  onChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value]
    })
  }
  onTimeChange = e => {
    this.setState({
      timeSel: e.detail.value
    })
  }
  onDateChange = e => {
    console.log('e:', e);
    this.setState({
      dateSel: e.detail.value
    })
  }
  render() {
    return (
      <View className='container'>
        <Text>日期选择器</Text>
        <View>
          <Picker mode='multiSelector' onChange={this.onDateChange} range={arr}>
            <View className='picker'>
              当前选择：{this.state.dateSel}
            </View>
          </Picker>
        </View>
      </View>
    )
  }
}
