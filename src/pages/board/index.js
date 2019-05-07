import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import RunningBoard from './components/RuningBoard'
import indexStyles from './index.scss'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { request} from "../../utils/request";
import { getBar } from '../../services/index/index'
import SearchAndMenu from './components/SearchAndMenu'
import BoardTypeSelect from './components/BoardTypeSelect/index'

export default class Board extends Component {
  config = {
    navigationBarTitleText: '项目'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {

  }

  componentDidHide () { }

  login =  () => {
    Taro.login().then(res => {
      const code = res.code
      Taro.getUserInfo().then(res2 => {
        const obj = {
          url: 'http://192.168.1.68/mini/auth/login',//自己的服务接口地址,这里是去拿到code去后台进行业务处理，调用微信接口拿到用户openid和凭证，在解密拿到用户数据
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: { encryptedData: res2.encryptedData, iv: res2.iv, code: code },
        }
        Taro.request(obj).then(res3 => {

        })
      }).catch(err => {
        console.log(err)
      })
    })
  }
  getUserInfo = (res) => {
    const { detail = {} }  = res
    const { encryptedData, iv } = detail
    if(!!encryptedData) {
      Taro.login().then(res => {
        const code = res.code
        Taro.getUserInfo().then(res2 => {
          const data = {
            encryptedData: res2.encryptedData, iv: res2.iv, code: code
          }
          getBar(data).then(res3 => {
            console.log(res)
          })
        })

      })
    }
  }
  render () {
    return (
      <View >
        <SearchAndMenu />
        <BoardTypeSelect />
        <RunningBoard />
        {/*<Button open-type={'getUserInfo'} onGetUserInfo={this.getUserInfo}>用户</Button>*/}
      </View>
    )
  }
}

