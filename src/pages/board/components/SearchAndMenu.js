import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import styles from './SearchAndMenu.scss'
import globalStyles from '../../../gloalSet/styles/globalStyles.scss'

export default class SearchAndMenu extends Component {

  state = {
    search_mask_show: '0', /// 0默认 1 淡入 2淡出
    inputVal:''
  }

  constructor(props) {
    super(props)
    this.timer = null
  }

  componentWillReceiveProps (nextProps) {
    const { search_mask_show } = nextProps
    this.setState({
      search_mask_show
    })
  }

  componentWillUnmount () { }

  componentDidShow () {

  }

  componentDidHide () {
    this.clearInput()
   }

  onSelectType = () => {
    this.setSearchMaskShow()
  }

  setSearchMaskShow() {
    const { search_mask_show } = this.props
    let show_flag = '0'
    if('0' == search_mask_show) {
      show_flag = '1'
    }else if('1' == search_mask_show) {
      show_flag = '2'
    }else if('2' == search_mask_show) {
      show_flag = '1'
    }else {

    }
    this.props.onSelectType && this.props.onSelectType({show_type: show_flag})
  }
  quitCoperate = () => {
    this.props.onSelectType && this.props.onSelectType({show_type: '2'})
  }
  // onSearchFocus = () => {
  //   Taro.showToast({
  //     title: '未完成功能',
  //     icon: 'none'
  //   })
  // }

  // 清除搜索框值
  clearInput(){
    this.setState({
      inputVal: ""
    });
  }
  setSearchShowList=(e)=>{
    const { timer } = this.state
    if(this.timer) {
      clearTimeout(this.timer) 
    }
    this.setState({
      inputVal:e.target.value
    })
    this.timer = setTimeout(() => {
      this.props.onSearchShowList(e)
    }, 500)
   
  }
  
  render () {
    const { search_mask_show,inputVal } = this.state
    return (
      <View>
        <View className={styles.search_memu_out_back}></View>
        <View className={`${globalStyles.global_horrizontal_padding} ${styles.search_memu_out}`}>
          <View className={`${styles.search_area}`} >
            <View className={`${styles.search_icon_area}`}>
              <Text className={`${globalStyles.global_iconfont} ${styles.icon_menu}`}>&#xe643;</Text>
            </View>

            <View className={`${styles.search_input_area}`}>
              <Input className={`${styles.search_input}`} onInput={this.setSearchShowList} value={inputVal} />
            </View>
          </View>
          <View className={`${styles.menu}`} onClick={this.onSelectType}>
            <Text className={`${globalStyles.global_iconfont} ${styles.icon_menu}`}>&#xe63f;</Text>
          </View>
        </View>
        <View onClick={this.quitCoperate} className={`${styles.mask} ${'0' == search_mask_show && styles.mask_normal} ${'1' == search_mask_show && styles.mask_show} ${'2' == search_mask_show && styles.mask_hide}`}></View>
      </View>
    )
  }
}

