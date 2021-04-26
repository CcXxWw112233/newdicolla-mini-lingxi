import Taro, { Component } from "@tarojs/taro";
import { View, Text,RichText } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyle from '../../../../gloalSet/styles/globalStyles.scss'
import { connect } from "@tarojs/redux";
import { isApiResponseOk, } from "../../../../utils/request";

@connect(({ tasks: { tasksDetailDatas = {}, } }) => ({
  tasksDetailDatas,
}))
export default class MoreFields extends Component {

  state = {
   
  }

  goMoreCustomField = e => {
      Taro.navigateTo({
          url: `/pages/fieldSelection/index`,
      });
  }
  render() {
   
    return (
      <View className={indexStyles.index}>
          <View className={indexStyles.index_title}>添加字段</View>
          <View className={indexStyles.list_View}>
            <View className={indexStyles.list_more_icon_bgView} onClick={this.goMoreCustomField}>
              <RichText className={`${globalStyle.global_iconfont} ${indexStyles.list_more_icon}`} nodes='&#xe7f4;'></RichText>
            </View>
          </View>
      </View>
    )
  }
}
