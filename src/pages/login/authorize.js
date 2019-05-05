import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
//import './index.less'

export default class Authorize extends Component {

    componentWillMount () { }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    getUserInfo = (userInfo) => {
        console.log('userinfo',userInfo)
        if(userInfo.detail.userInfo){   //同意
            Taro.setStorage({key:'userInfo',data:'12345'}).then()
        } else{ //拒绝,保持当前页面，直到同意 
        
        }
    }


    render () {
        return (
            <View className='index'>
                <View>
                    <Text>申请获取你的公开信息（昵称、头像等）</Text> 
                    <Button open-type='getUserInfo' onGetUserInfo={this.getUserInfo} > 微信授权 </Button>
                </View>
            </View >
        )
    }
}



