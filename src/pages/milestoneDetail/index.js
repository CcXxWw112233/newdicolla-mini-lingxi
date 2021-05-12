import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import styles from './index.scss'
import jumpPlaceImage from '../../asset/meeting/jumpPlaceImage.jpg'

export default class JumpToMeeting extends Component {
  config = {
    navigationBarTitleText: '里程碑详情',
  }
  state = {}
  componentDidMount() {
    this.toMeeting()
  }
  
  render() {
    return (
    <View className={styles.container}>
      <View className={styles.topbg_View}></View>
      <View className={styles.bg_View}>
        <View className={styles.content}>
            
        </View>
      </View>
    </View>
    )
  }
}
