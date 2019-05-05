import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input } from '@tarojs/components'
import './index.scss'
import '../../gloalSet/styles/globalStyles.scss'
import { validateTel, validateEmail } from '../../utils/verify';
import { request } from '../../utils/request';
import { REQUEST_DOMAIN } from '../../gloalSet/js/constant';
import sha256 from 'js-sha256'

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

    componentWillMount () { }

    componentDidMount () {
        Taro.login().then((res) => {
            console.log(res)
        })
       // this.getUserInfo()
    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    //切换登陆方式
    ChangeLoginType() {
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
        request(`${REQUEST_DOMAIN}/sms/code/send`, 'POST', data).then(res => {
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

        let messageTime = 5;
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
        Taro.showLoading({
            title: '加载中'
        })
        request(`${REQUEST_DOMAIN}/user/signin`, 'POST', data).then(res => {
            Taro.hideLoading();
            if(res.code === '0'){
                Taro.removeStorageSync('refreshTokenTime');      //登录成功移除调用refreshToken接口时设置的缓存
                const tokenArr = res.data.split('__');
                Taro.setStorageSync('token',tokenArr[0]);        //设置token
                Taro.setStorageSync('refreshToken',tokenArr[1]); //设置refreshToken
                let pages = Taro.getCurrentPages();              //获取跳转页面的历史记录
                let url =  '/pages/dynamic/dynamic';
                if(pages.length > 1){
                    const page = pages.shift();
                    url = `/${page.route}`
                }
                Taro.reLaunch({
                    url: url,
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
        }).catch(() => {
            Taro.hideLoading();
        })

    }

    getUserInfo = (userInfo) => {
        console.log('userinfo',userInfo)
        if(userInfo.detail.userInfo){   //同意
            console.log(userInfo)
            Taro.setStorage({key:'userInfo',data:'12345'}).then()
        } else{ //拒绝,保持当前页面，直到同意

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

        let paswdClass = `login_user_input login_input ${showCode ? 'login_code_input' : 'login_pswd_input'}`;
        return (
            <View className='login'>
                <View className='login_header'>已有账号登录</View>
                <View className='login_content'>
                    <View className='login_item_wrap login_user'>
                        <View className='login_user_input_wrap login_item'>
                            <Text className='login_user_icon global_iconfont icon_user login_icon'>&#xe6f8;</Text>
                            <Input type='text' onBlur={this.checkUser} onInput={this.inputUser} className='login_user_input login_input' placeholder='手机号/邮箱' value={user} />
                        </View>
                        <View className='login_user_error login_error'>{userErrorMessage}</View>
                    </View>
                    <View className={`login_item_wrap ${showCode ? 'login_code' : 'login_code'}`}>
                        <View className='login_code_code_wrap login_item'>
                            <Text className='login_pswd_icon global_iconfont icon_lock login_icon'>&#xe6f8;</Text>
                            <Input type={showCode ? 'text' : 'password'} onBlur={this.checkPswd} value={pswd} className={paswdClass} placeholder={showCode ? '验证码' : '密码'} onInput={this.inputPswd} />
                            {showCode ? <Text className={`login_code_text ${user && (userMessageType === 2) && Object.prototype.toString.call(codeMessage) !== '[object Number]' ? 'login_code_blue' : ''}`} onClick={this.setCodeMessage}>{codeMessage}</Text> : ''}
                        </View>
                        <View className='login_code_error login_error'>{pswdErrorMessage}</View>
                    </View>
                </View>
               <View className='change_login_type_out'>
                 <View onClick={this.ChangeLoginType} className='change_login_type'>切换{showCode?'密码': '验证码'}登录</View>
               </View>
                <View className='login_footer'>
                  <Button className='login_btn_normal login_btn' type='primary' onClick={this.normalLogin}>登录</Button>
                  <Button className='login_btn_wx login_btn' open_type='getPhoneNumber' onGetPhoneNumber={this.getUserInfo}>微信快捷登录</Button>
                </View>
            </View >
        )
    }
}



