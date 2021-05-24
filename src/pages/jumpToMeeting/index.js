import Taro, { Component } from "@tarojs/taro";
import { View, Image, Button, Text } from "@tarojs/components";
import styles from "./index.scss";
import { MEETING_APPID } from "../../gloalSet/js/constant";
import jumpPlaceImage from "../../asset/meeting/jumpPlaceImage.jpg";

export default class JumpToMeeting extends Component {
  config = {
    navigationBarTitleText: "会协宝"
  };
  state = {};
  componentDidMount() {
    this.toMeeting();
  }
  toMeeting = () => {
    Taro.navigateToMiniProgram({
      appId: MEETING_APPID,
      path: "pages/home/index",
      complete: val => {
        console.log(val);
      }
    });
  };
  render() {
    return (
      <View className={styles.container}>
        {/* <Image src={require('../../asset/meeting/meeting_alt.png')}
            className={styles.meeting_alt}
          /> */}
        <View className={styles.topbg_View}></View>
        <View className={styles.bg_View}>
          <View className={styles.content}>
            <View>
              <Image
                src={jumpPlaceImage}
                className={styles.meeting_alt}
                mode='aspectFit'
              />
              <View>
                <Text>快速预订会议，会议资源管理</Text>
              </View>
            </View>
            <View>
              <Button onClick={this.toMeeting}>前往聆悉预约</Button>
            </View>
          </View>
          {/* <View>
          <Button onClick={this.toMeeting}>前往会协宝</Button>
        </View> */}
        </View>
      </View>
    );
  }
}
