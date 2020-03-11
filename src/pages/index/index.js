import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text ,Image} from '@tarojs/components'

import styles from './index.scss'

class Index extends Component {
  config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {}

  componentDidHide () { }

  toLogin = ()=>{
    Taro.redirectTo({
      url:"/pages/login/index"
    })
  }
  render () {
    return (
      <View className={styles.index}>
        <View className={styles.container}>
          <View className={styles.indexHeader}>
            <View>
              管项目 用聆悉
            </View>
            <View className={styles.subTitle}># 城市规划、地产投资行业的远程办公新方式 #</View>
          </View>
          <View className={styles.banner}>
            <Image className={styles.bannerImage} mode="scaleToFill" src="https://dian-lingxi-public.oss-cn-beijing.aliyuncs.com/common/applet1.png"/>
          </View>
          <View>
            <Button className={styles.startBtn} onClick={this.toLogin}>
              立即使用
            </Button>
          </View>
        </View>
      </View>
    )
  }
}

export default Index
