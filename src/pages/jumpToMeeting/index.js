import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import styles from './index.scss'
import { MEETING_APPID } from '../../gloalSet/js/constant'
import CustomTabBar from '../../components/custormTabBar'

export default class JumpToMeeting extends Component {
  config = {
    navigationBarTitleText: '会协宝',
  }
  state = {}
  componentDidMount() {
    this.toMeeting()
  }
  componentWillMount() {
    this.props.dispatch({
      type: "accountInfo/updateDatas",
      payload: {
        tabbar_index: 3
      }
    });
  }
  toMeeting = () => {
    Taro.navigateToMiniProgram({
      appId: MEETING_APPID,
      path: 'pages/home/index',
      complete: (val) => {
        console.log(val)
      }
    })
  }
  render() {
    return (
      <View className={styles.container}>
        <View className={styles.content}>
          <View>
            <Image src={require('../../asset/meeting/meeting_alt.png')}
              className={styles.meeting_alt}
            />
            <View>
              <Text>开会就用会协宝</Text>
            </View>
          </View>
          <View>
            <Button onClick={this.toMeeting}>前往会协宝</Button>
          </View>
        </View>
        <CustomTabBar />
      </View>
    )
  }
}
