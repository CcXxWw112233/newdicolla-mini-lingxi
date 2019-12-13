import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, } from "taro-ui"
import { connect } from '@tarojs/redux'
import indexStyles from './index.scss'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import linxi_logo from '../../asset/authorize/board.png'

@connect(({ authorize }) => ({
  authorize
}))
export default class Authorize extends Component {
  componentWillMount() { }
  componentDidMount() { }
  componentWillUnmount() { }
  componentDidShow() { }
  componentDidHide() { }
  getUserInfo = (userInfo) => {
    if (userInfo.detail.userInfo) {   //同意
    } else { //拒绝,保持当前页面，直到同意
    }
  }
  onCancel = (e) => {
    // console.log('取消')
    this.setShowAuthorize(false)
  }
  onConfirm = (e) => {
    // console.log('确认')
    this.setShowAuthorize(false)
  }
  setShowAuthorize = (show_authorize) => {
    const { dispatch } = this.props
    dispatch({
      type: 'authorize/updateDatas',
      payload: {
        show_authorize
      }
    })
  }
  render() {
    const { authorize: { show_authorize } } = this.props
    return (
      <View>
        <AtModal
          isOpened={show_authorize}
          closeOnClickOverlay={false}>
          <AtModalHeader>
            <Text className={`${indexStyles.strong}`}>微信手机号授权</Text>
          </AtModalHeader>
          <AtModalContent>
            <View className={`${indexStyles.contain1}`}>
              <View className={`${indexStyles.contain1_inner}`}>
                <Image src={linxi_logo} className={`${indexStyles.lingxi_logo}`} />
              </View>
              <View className={`${indexStyles.contain1_inner} ${indexStyles.app_name}`} >
                聆悉
              </View>
              <View className={`${indexStyles.question}`}>
                <Text className={`${globalStyles.global_iconfont} ${indexStyles.question_icon}`}>
                  &#xe643;
                </Text>
              </View>
            </View>
            <View className={`${indexStyles.contain2}`}>
              <View className={`${indexStyles.contain2_1}`}>
                申请获取你微信绑定的手机号
              </View>
              <View className={`${indexStyles.contain2_2}`}>
                13833333332
              </View>
            </View>

          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.onCancel} className={`${indexStyles.strong}`}>取消</Button>
            <Button onClick={this.onConfirm} style={{ color: '#4FB437' }} className={`${indexStyles.strong}`}>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>

    )
  }
}


