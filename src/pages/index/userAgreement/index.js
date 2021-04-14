import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { validateTel, validateEmail } from '../../utils/verify';
import { sendVerifyCode, normalLogin, getVerifycodeImg, getAccountInfo } from "../../services/login";
import Authorize from '../../components/authorize/index'
import sha256 from 'js-sha256'
import { connect } from '@tarojs/redux'
import { isApiResponseOk } from '../../utils/request';


export default class Login extends Component {
  state = {
   
  }
  componentWillMount() {
 
  }
  render() {
    return (
      <View className={`${indexStyles.login}`}>
           <WebView src='https://lingxi.di-an.com/#/agreement/privacy' onMessage={this.handleMessage} />
      </View >
    )
  }
}
