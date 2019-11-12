import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import styles from './SearchAndMenu.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'

export default class SearchAndMenu extends Component {

  state = {

  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleChange = (inputValue) => {
    console.log(inputValue.detail.value, 'ssss');
    this.props.onSearch(inputValue.detail.value)
  }

  onSearchFocus = () => {
    Taro.showToast({
      title: '未完成功能',
      icon: 'none'
    })
  }
  render() {
    const { search_mask_show } = this.state
    return (
      <View>
        <View className={styles.search_memu_out_back}></View>
        <View className={`${globalStyles.global_horrizontal_padding} ${styles.search_memu_out}`}>
          <View className={`${styles.search_area}`} onClick={this.onSearchFocus}>
            <View className={`${styles.search_input_area}`}>
              <Input
                className={`${styles.search_input}`}
                placeholder='搜索'
                onChange={this.handleChange}
              />
            </View>
            <View className={`${styles.search_icon_area}`}>
              <Text className={`${globalStyles.global_iconfont} ${styles.icon_menu}`}>&#xe643;</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

