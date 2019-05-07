import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import styles from './SearchAndMenu.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'

export default class SearchAndMenu extends Component {

  componentWillReceiveProps (nextProps) {
  }

  componentWillUnmount () { }

  componentDidShow () {

  }

  componentDidHide () { }

  render () {
    return (
      <View>
        <View className={styles.search_memu_out_back}></View>
        <View className={`${globalStyles.global_horrizontal_padding} ${styles.search_memu_out}`}>
          <View className={`${styles.search_area}`}>
            <View className={`${styles.search_icon_area}`}>
              <Text className={`${globalStyles.global_iconfont} ${styles.icon_menu}`}>&#xe643;</Text>
            </View>

            <View className={`${styles.search_input_area}`}>
              <Input className={`${styles.search_input}`}/>
            </View>
          </View>
          <View className={`${styles.menu}`}>
            <Text className={`${globalStyles.global_iconfont} ${styles.icon_menu}`}>&#xe63f;</Text>
          </View>
        </View>
        {/*遮罩层*/}
        <View className={styles.mask}></View>
      </View>
    )
  }
}

