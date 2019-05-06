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
    const { avartarTotal= '', size = 20, src = '', text = '', userList = [] } = this.props || {}
    const AvatarStyle = `width:${size}px;height:${size}px;border-radius:${size}px;` //头像样式
    const AvartarBgStyle = `font-size:12px;color:#8c8c8c;text-align:center;line-height:${size}px;` //头像背景
    const ListAvaTarItemStyle = `margin-left:-${size/2 - 2}px;` //头像列表时，单个头像要往左移动遮住堆叠
    const ListMore = ``
    const singleUser = (
      <View className="avatar" style={AvatarStyle}>
        {!!src?(
          <Image src={src} style={AvatarStyle}/>
        ):(
          <View className='user_name'
                style={`${AvatarStyle}${AvartarBgStyle}`}>{text.substr(0, 1)}</View>
        )}
      </View>
    )
    const listUser = (
      <View className='list_user_out'>
        <View className='list_user'>
          {userList.map((value, key) => {
            const { avatar='', name = 'U' } = value ||{}
            return key < 3 && (
              <View className="avatar" style={`${key!= 0?ListAvaTarItemStyle:''}${AvatarStyle}line-height:${size}px;`} key={key}>
                {!!avatar?(
                  <Image src={avatar} style={AvatarStyle}/>
                ):(
                  <View className='user_name'
                        style={`${AvatarStyle}${AvartarBgStyle}`}>{name.substr(0, 1)}</View>
                )}
              </View>
            )
          })}
        </View>
        {userList.length > 3 && (
          <View className="avatar list_more" style={`${ListAvaTarItemStyle}${AvatarStyle}width: auto;`}>+{userList.length}</View>
        )}
      </View>
    )
    return (
      <View>
        {avartarTotal == 'single'? (
          singleUser
        ): (
          listUser
        )}
      </View>

    )
  }
}

Avatar.defaultProps = {
  avartarTotal: 'multiple', //单个头像还是头像列表single / multiple ,multiple的情况下必传userList
  size: 20,
  src: '',
  text: 'U',
  userList: [{},{},{}, {}]
}
