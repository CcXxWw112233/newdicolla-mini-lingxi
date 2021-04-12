import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'
import SearchBar from '../../../components/searchBar'


export default class nowOpen extends Component {
  config = {
    navigationStyle: 'custom',
  }
  state = {
  }
  

  render() {
    const {list,txtStyle,currentTargetId} = this.state;
    return (
      <View className={`${indexStyles.index}`} >
           <Swiper
        className='test-h'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        vertical
        circular
        indicatorDots
        autoplay = {true}
        interval = {1000}
        displayMultipleItems = {4}
        >
        <SwiperItem>
          <View className='demo-text-1'>111111111111111111</View>
        </SwiperItem>
        <SwiperItem>
          <View className='demo-text-2'>222222222222222222222</View>
        </SwiperItem>
        <SwiperItem>
          <View className='demo-text-3'>33333333333333333333</View>
        </SwiperItem>
        <SwiperItem>
          <View className='demo-text-3'>444444444444444444444</View>
        </SwiperItem>        
        <SwiperItem>
          <View className='demo-text-3'>555555555555555555555</View>
        </SwiperItem>        
        <SwiperItem>
          <View className='demo-text-3'>666666666666666666666</View>
        </SwiperItem>        
        <SwiperItem>
          <View className='demo-text-3'>7777777777777777777777</View>
        </SwiperItem>
      </Swiper>
      </View>
    )
  }
}

