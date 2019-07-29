import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import indexStyles from './index.scss'
import auccess_Join_image from '../../asset/Invitation/auccess_Join.png'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'

export default class auccessJoin extends Component {
    config = {
      navigationBarTitleText: '灵犀协作'
    }
    constructor () {
      super(...arguments)
      this.state = {
        djsTime: 5,					//倒计时时间 5’s
        Loadingtime: '',			// 计时器
      }
    }
    componentWillMount () {
      let that = this
      this.setState({
        Loadingtime:setInterval(function(){ // 执行计时器
          if(that.state.djsTime > 0){
            that.state.djsTime--;
            that.setState({djsTime:that.state.djsTime})
          }else { //倒计时结束
            clearInterval(that.state.Loadingtime);

            Taro.switchTab({
              url: `../../pages/calendar/index`
            })
          }
        }, 1000)
      })
    }
    componentWillReceiveProps () {
    }
    componentWillUnmount () {
      clearInterval(this.state.Loadingtime);// 清除计时器
    }
    componentDidShow () {
    }
    componentDidHide () {
    }

    render () {
      return (
        <View className={`${globalStyles.global_horrizontal_padding}`}>
          <View className={indexStyles.contain1}>
            <Image src={auccess_Join_image} className={indexStyles.auccess_Join} />
          </View>
          <View className={indexStyles.text1}>已成功加入项目</View>
          <View className={indexStyles.text2}>正在为你跳转小程序，你也可以前往网页 \n 或者App展开协作</View>
        </View>
      )
    }
  }
  
  