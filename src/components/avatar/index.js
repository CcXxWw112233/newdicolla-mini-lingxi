import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import './index.scss'
import userIcon from '../../asset/test.jpg'

export default class Avatar extends Component {

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const { size = 20, src = '', text = 'U' } = this.props || {}
    const AvatarStyle = `width:${size}px;height:${size}px;border-radius:${size}px`

    return (
      <View className="avatar">
        {!!src?(
          <Image src={src} style={AvatarStyle}/>
        ):(
          <View className='user_name'>{text.substr(0, 1)}</View>
        )}
      </View>
    )
  }
}
