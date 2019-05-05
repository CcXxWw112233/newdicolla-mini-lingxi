import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction,} from "taro-ui"
import { connect } from '@tarojs/redux'
import './index.scss'
import '../../gloalSet/styles/globalStyles.scss'
import linxi_logo from '../../asset/authorize/lingxi_logo.jpg'

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
    if(userInfo.detail.userInfo){   //同意
    } else{ //拒绝,保持当前页面，直到同意
    }
  }
  onCancel = (e) => {
    console.log('取消')
    this.setShowAuthorize(false)
  }
  onConfirm =(e) => {
    console.log('确认')
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
    return(
      <View>
        <AtModal
          isOpened={show_authorize}
          closeOnClickOverlay={false}>
          <AtModalHeader>
            <Text className='strong'>微信手机号授权</Text>
          </AtModalHeader>
          <AtModalContent>
            <View className='contain1'>
              <View className='contain1_inner'>
               <Image src={linxi_logo} className='lingxi_logo'/>
              </View>
              <View className='contain1_inner app_name'>
                灵犀协作
              </View>
              <View className='question'>
                <Text className='global_iconfont question_icon'>
                  &#xe643;
                </Text>
              </View>
            </View>
            <View className='contain2'>
              <View className='contain2_1'>
                申请获取你微信绑定的手机号
              </View>
              <View className='contain2_2'>
                13833333332
              </View>
            </View>

          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.onCancel} className='strong'>取消</Button>
            <Button onClick={this.onConfirm} style={{color: '#4FB437'}} className='strong'>确定</Button>
          </AtModalAction>
        </AtModal>
      </View>

    )
  }
}


