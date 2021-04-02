import Taro, { Component } from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import styles from './index.scss'
import { MEETING_APPID } from '../../gloalSet/js/constant'

export default class JumpToMeeting extends Component {
  config = {
    navigationBarTitleText: '会协宝',
  }
  state = {
    appList: [{
      'icon': '',
      'title': '隐翼地图',
      'intro': '面向城市规划等多个领域及行业，提供城市用地公共数据、远程采集、踏勘数据整理与回放、远程互动、踏勘计划灯多种功能。',
      'openType': 'launchApp',
    },
    {
      'icon': '',
      'title': '会协宝',
      'intro': '接入多种主流的远程会议软件，接管会前会中会后资料、提供会议预定、通知以及会后计划、任务跟踪与沉淀。',
      'openType': '',
    }
    ],
  }
  componentDidMount() {
    var that = this;
    Taro.getSystemInfo({
      success: function (res) {
        that.setState({
          system: res.system.split(" ")[0]
        })
      }
    })
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
  jumpToOhterProject(e) {
    console.log(e.currentTarget.id)
    if (e.currentTarget.id == '0') {
      Taro.showToast({
        title: '此功能暂未开放',
        icon: 'none',
        duration: 2000
      })
    } else if (e.currentTarget.id == '1') {
      this.toMeeting();
    }
  }

  launchAppError(e) {
    console.log(e.detail.errMsg)
  }
  render() {
    const { appList, system } = this.state;
    return (
      <View className={styles.container}>
        <View className={styles.content}>
          {
            appList.map((value, key) => {
              return (
                key == 0 && system == 'iOS' ? (
                  <Button className={styles.appItem} key={key} open-type='launchApp' binderror={this.launchAppError}>
                    <Image className={styles.appItem_image}></Image>
                    <View className={styles.appItem_Text}>
                      <View className={styles.appItem_Title}>{value.title}</View>
                      <View className={styles.appItem_intro}>{value.intro}</View>
                    </View>
                  </Button>
                ) : (
                  <Button className={styles.appItem} key={key} id={key} onClick={this.jumpToOhterProject}>
                    <Image className={styles.appItem_image}></Image>
                    <View className={styles.appItem_Text}>
                      <View className={styles.appItem_Title}>{value.title}</View>
                      <View className={styles.appItem_intro}>{value.intro}</View>
                    </View>
                  </Button>
                )
              )
            })
          }
          {/* <View>
            <Image src={require('../../asset/meeting/meeting_alt.png')}
              className={styles.meeting_alt}
            />
            <View>
              <Text>开会就用会协宝</Text>
            </View>
          </View>
          <View>
            <Button onClick={this.toMeeting}>前往会协宝</Button>
          </View> */}


        </View>
      </View>
    )
  }
}
