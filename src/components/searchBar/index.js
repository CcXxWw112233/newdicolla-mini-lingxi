import Taro, { Component } from '@tarojs/taro'
import { View, Text,Input,Button } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../gloalSet/styles/globalStyles.scss'



export default class Authorize extends Component {
  state = {
    isShowDeleteIcon : false,
    inputValue:''
  }
//   点击完成进行搜索
  searchClick = e => {
    this.props.searchMenuClick(e.detail.value)
}
  // 监控是否输入
  startPrint = e => {
    if(e.detail.value.length > 0) {
      this.setState({
        isShowDeleteIcon:true,
      })
    } else {
      this.setState({
        isShowDeleteIcon:false,
      })
      this.props.cancelSearchMenuClick('')
    }
  }
  formReset = e => {
    this.setState({
      isShowDeleteIcon:false,
      inputValue:''
    })
    this.props.cancelSearchMenuClick('')
  }
  render() {
    const {isShowDeleteIcon,inputValue} = this.state;
    return (
          <Form  className={indexStyles.searchForm} onReset={this.formReset}>
            <View className={indexStyles.index} >

          <View className={indexStyles.content_View}>
            <Text className={`${globalStyle.global_iconfont} ${indexStyles.searchIcon}`} >&#xe643;</Text>
            <Input placeholder='搜索' value={inputValue} placeholderClass={indexStyles.searchBarInput_placeholderStyle} onInput={this.startPrint} className={indexStyles.searchBarInput} onConfirm={this.searchClick}></Input>
            {
               isShowDeleteIcon && <Button className={`${globalStyle.global_iconfont} ${indexStyles.deleteIcon}`} formType='reset'  >&#xe639;</Button>
            }
          </View>
          </View>

          </Form>

    )
  }
}


