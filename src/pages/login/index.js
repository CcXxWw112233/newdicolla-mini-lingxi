import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { validateTel, validateEmail } from '../../utils/verify';
import { sendVerifyCode, normalLogin} from "../../services/login";
import Authorize from '../../components/authorize/index'
import sha256 from 'js-sha256'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction, AtSwitch, AtRadio, AtList, AtListItem, AtButton } from "taro-ui"
import { connect } from '@tarojs/redux'

@connect(({ login }) => ({
  login
}))
export default class Login extends Component {
  state = {
    isMobile: true,     //是否为手机类型
    isCoded: false,     //是否点击过发送验证码或者重新发送
    showCode:true,       //是否验证码登陆
    user: '',
    pswd: '',
    codeMessage: '获取验证码',
    pswdErrorType: 0,
    userMessageType: 0
  }
  componentWillMount () {

  }
  componentDidMount () {
  }
  componentWillUnmount () { }
  componentDidShow () { }
  componentDidHide () { }
    //切换登陆方式
  ChangeLoginType = (e) => {
    this.setState({
      showCode: !this.state.showCode,
      pswd: ''
    })
  }
    //用户输入框
  inputUser = (e) => {
    let value = e.target.value;
    //isMobile条件：为空 或者 是一个以1开头的整数
    let isMobile = value === '' || (!(Number.isNaN(Number(value))) && value.startsWith("1"));
    let { codeMessage, isCoded } = this.state;
    if(!isMobile){
      codeMessage = '获取验证码';
      if(this.messageTimeOut){
        clearInterval(this.messageTimeOut);
      }
        isCoded = false;
    }
    let {userMessageType, pswdErrorType} = this.state;
    if(String(value).length > 0){
      userMessageType = 0;
      pswdErrorType = 0;
    }
    if(validateTel(value)){
      userMessageType = 2
    }
    this.setState({
      isMobile: isMobile,
      user: value,
      codeMessage: codeMessage,
      isCoded: isCoded,
      userMessageType: userMessageType,
      pswdErrorType: pswdErrorType
    })
  }
    //验证用户输入框
  checkUser = (e) => {
    let value = e.target.value;
    let error = this.state.userMessageType;
    if(value === '' || (!validateTel(value) && !validateEmail(value))){
      error = 1
    }
    this.setState({
      userMessageType: error
    })
  }
    // 输入验证码或者密码
  inputPswd = (e) => {
    let value = e.target.value;
    let {pswdErrorType} = this.state;
    if(String(value).length > 0){
      pswdErrorType = 0;
      }
      this.setState({
        pswd: value,
        pswdErrorType: pswdErrorType
      })
  }
    //验证密码框
  checkPswd = (e) => {
    let value = e.target.value;
    let {showCode} = this.state;
    let error = 0;
    if(value === ''){
      if(showCode){
        error = 2
      }else{
        error = 1
      }
    }
    this.setState({
      pswdErrorType: error
    })
  }
    //发送短信设置60s倒计时
  setCodeMessage = () => {
    let {codeMessage, user, userMessageType} = this.state;
    if(user === ''){
      this.setState({
        userMessageType: 1
      })
      return false;
    }
    if(userMessageType !== 2){        //没有通过手机正则表达式
      return false;
    }
    if(codeMessage !== '重新获取' && codeMessage !== '获取验证码') return false;
    let data = {
      mobile: user,
      type: '2'
    }
    let _this = this;
    sendVerifyCode(data).then(res => {
      if(res.code !== '0'){
        let {isCoded ,isMobile} = this.state;
        if(!isMobile){
          codeMessage = '获取验证码';
          if(this.messageTimeOut){
            clearInterval(this.messageTimeOut);
          }
          isCoded = false;
        }
        _this.setState({
          pswdErrorType: 3,
          isCoded: isCoded,
          codeMessage: codeMessage
        })
      }
    });
    let messageTime = 60;
    const fun = () => {
      messageTime = messageTime - 1;
      this.setState({
        codeMessage: messageTime,
        isCoded: true
      })
      if (messageTime === 0) {
        clearInterval(messageTimeOut);
        this.setState({
          codeMessage: "重新获取",
          isCoded: true
        })
      }
    }
    fun();
    let messageTimeOut = setInterval(fun, 1000);
    this.messageTimeOut = messageTimeOut;
  }
    //普通登录
  normalLogin = () => {
    const { dispatch } = this.props
    let {user, pswd, showCode, userMessageType} = this.state;
    let pswdErrorType = 0;
    if(user === '' || pswd === ''){
      if(user === ''){
        userMessageType = 1;
      }
      if(pswd === ''){
        if(showCode){
          pswdErrorType = 2
        }else{
          pswdErrorType = 1
        }
      }
      this.setState({
        pswdErrorType: pswdErrorType,
        userMessageType: userMessageType
      })
      return false;
    }
    let _this = this;
    let data = {
      account: user
    }
    if(showCode){
      data.verifycode = pswd;
    }else{
      data.password = sha256(pswd);
    }
    normalLogin(data).then(res => {
      if(res.code === '0'){
        dispatch({
          type: 'login/handleToken',
          payload: {
            token_string: res.data
          }
        })
      }else{
        if(res.message === '登录的手机号不存在'){
          userMessageType = 3;
        }else if(res.message === '账号密码错误'){
          pswdErrorType = 4;
        }else if(res.code === '1002'){
          userMessageType = 1;
        }
        _this.setState({
          userMessageType: userMessageType,
          pswdErrorType: pswdErrorType
        })
      }
    }).catch(() => {})
  }

  //获取授权信息，然后进行微信授权登录
  getUserInfo = (res) => {
    const { detail = {} }  = res
    const { encryptedData, iv } = detail
    if(!!encryptedData) {
      const { dispatch } = this.props
      Taro.login().then(res => {
        const code = res.code
        Taro.getUserInfo().then(res2 => {
          const parmas = {
            encryptedData: res2.encryptedData, iv: res2.iv, code: code
          }
          dispatch({
            type: 'login/weChatAuthLogin',
            payload: {
              parmas
            }
          })
        })
      })
    }
  }

  render () {
    let {showCode, codeMessage='', userMessageType, pswdErrorType, user, pswd} = this.state;
    let userErrorMessage;
    switch(userMessageType){      //userMessageType === 2 通过正则表达式校验
      case 1: userErrorMessage = '请输入正确的手机号或邮箱';break;
      case 3: userErrorMessage = '登录的手机号不存在';break;
      default: userErrorMessage = '';
    }

    let pswdErrorMessage;
    switch(pswdErrorType){
      case 1: pswdErrorMessage = '请输入密码';break;
      case 2: pswdErrorMessage = '请输入验证码'; break;
      case 3: pswdErrorMessage = '验证码发送失败，请重试';break;
      case 4: pswdErrorMessage = '账号密码错误，请重试';break;
      default: pswdErrorMessage = '';
    }

    let paswdClass = `${indexStyles.login_user_input} ${indexStyles.login_input} ${showCode ? indexStyles.login_code_input: indexStyles.login_pswd_input}`;
    return (
      <View className={`${indexStyles.login}`}>
        <View className={`${indexStyles.login_header}`}>{!showCode?'账号密码': '手机验证码'}登录</View>
        <View  className={`${indexStyles.login_content}`}>
          <View className={`${indexStyles.login_item_wrap} ${indexStyles.login_user}`}>
            <View className={`${indexStyles.login_user_input_wrap} ${indexStyles.login_item}`}>
              <Text className={`${indexStyles.login_user_icon} ${indexStyles.login_icon} ${indexStyles.icon_user} ${globalStyles.global_iconfont}`}>&#xe640;</Text>
              <Input type='text' onBlur={this.checkUser} onInput={this.inputUser}  className={`${indexStyles.login_user_input} ${indexStyles.login_input}`} placeholder='手机号/邮箱' value={user} />
            </View>
            <View className={`${indexStyles.login_user_error} ${indexStyles.login_error}`}>{userErrorMessage}</View>
          </View>
          <View className={`${indexStyles.login_item_wrap} ${showCode ? indexStyles.login_code: indexStyles.login_code}`} >
            <View className={`${indexStyles.login_code_code_wrap} ${indexStyles.login_item}`}>
              <Text
                    className={`${indexStyles.login_pswd_icon} ${globalStyles.global_iconfont} ${indexStyles.icon_lock} ${indexStyles.login_icon}`}>&#xe644;</Text>
              <Input type={showCode ? 'text' : 'password'} onBlur={this.checkPswd} value={pswd} className={paswdClass} placeholder={showCode ? '验证码' : '密码'} onInput={this.inputPswd} />
              {showCode ? <Text className={`${indexStyles.login_code_text} ${user && (userMessageType === 2) && Object.prototype.toString.call(codeMessage) !== '[object Number]' ? indexStyles.login_code_blue : ''}`} onClick={this.setCodeMessage}>{codeMessage}</Text> : ''}
              </View>
            <View className={`${indexStyles.login_code_error} ${indexStyles.login_error}`}>{pswdErrorMessage}</View>
          </View>
        </View>
        <View className={`${indexStyles.login_footer}`}>
          <Button className={`${indexStyles.login_btn_normal} ${indexStyles.login_btn}`} type='primary' onClick={this.normalLogin}>登录</Button>
          {/*<Button className='login_btn_wx login_btn' onClick={this.weixinLogin}>微信快捷登录</Button>*/}
          {/*<Button className={`${indexStyles.login_btn_wx} ${indexStyles.login_btn}`} open_type='getPhoneNumber' onGetPhoneNumber={this.wexinAuthPhoneNoLogin}>微信快捷登录</Button>*/}
          <Button className={`${indexStyles.login_btn_wx} ${indexStyles.login_btn}`} open-type={'getUserInfo'} onGetUserInfo={this.getUserInfo}>微信快捷登录</Button>
          
        </View>

        <View className={`${indexStyles.change_login_type_out}`}>
          <View onClick={this.ChangeLoginType} className={`${indexStyles.change_login_type}`}>{showCode?'账号密码': '验证码'}登录</View>
        </View>
      </View >
    )
  }
}



