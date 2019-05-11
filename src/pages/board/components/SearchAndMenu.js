import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import styles from './SearchAndMenu.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'

export default class SearchAndMenu extends Component {

  state = {
    search_mask_show: '0',
  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillUnmount () { }

  componentDidShow () {

  }

  componentDidHide () { }

  onSelectType = () => {
    this.props.onSelectType && this.props.onSelectType()
    this.setSearchMaskShow()
  }

  setSearchMaskShow() {
    const { search_mask_show } = this.state
    let show_flag = '0'
    if('0' == search_mask_show) {
      show_flag = '2'
    }else if('1' == search_mask_show) {
      show_flag = '2'
    }else if('2' == search_mask_show) {
      show_flag = '1'
    }else {

    }
    this.setState({
      search_mask_show: show_flag
    })
  }


  render () {
    const { search_mask_show } = this.state
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
          <View className={`${styles.menu}`} onClick={this.onSelectType}>
            <Text className={`${globalStyles.global_iconfont} ${styles.icon_menu}`}>&#xe63f;</Text>
          </View>
        </View>
        {/*遮罩层*/}
        {/*{search_mask_show && (*/}
          {/*<View className={`${styles.mask} ${styles.mask_show}`}></View>*/}
        {/*)}*/}
        <View className={`${styles.mask} ${styles.mask_hide}`}></View>
      </View>
    )
  }
}

