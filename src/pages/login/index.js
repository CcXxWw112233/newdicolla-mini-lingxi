import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input,Form } from '@tarojs/components'
import indexStyles from './index.scss'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { validateTel, validateEmail } from '../../utils/verify';
import { sendVerifyCode, normalLogin, getVerifycodeImg, getAccountInfo } from "../../services/login";
import Authorize from '../../components/authorize/index'
import sha256 from 'js-sha256'
import { connect } from '@tarojs/redux'
import { isApiResponseOk } from '../../utils/request';

@connect(({ login }) => ({
  login
}))
export default class Login extends Component {
  config = {
    navigationBarTitleText: '手机验证码登录',
    navigationBarBackgroundColor: "#FFFFFF",
    navigationBarTextStyle: "black",
  }
  state = {
    isMobile: true,     //是否为手机类型
    isCoded : true,     //是否点击过发送验证码或者重新发送
    showCode: true,       //是否验证码登陆
    user: '',
    pswd: '',
    verifycode: '',
    captcha_key: '',
    codeMessage: '获取验证码',
    messageTime:60,
    pswdErrorType: 0,
    userMessageType: 0,
    verifycodeErrorType: 0,
    verifyShow: false,
    verifycodeBase64Img: '',
    captchaKey: '',
    token_invalid: false,
    show_copywriting: false,
    isPassword:false, //密码输入框是否是密码类型
    is_code_remit:false
  }
  componentWillMount() {
    const sourcePage = this.$router.params;
    // this.checkTokenValid(sourcePage)
    this.setState({
      sourcePage,
    })
    // ios 12 系统以上支持验证码免输入 
    Taro.getSystemInfo({
      success: function (res) {
        console.log('sssssssssss',res.system)
        console.log(parseInt(res.system.split(' ')[1]))
        if(parseInt(res.system.split(' ')[1]) > 12 && parseInt(res.system.split(' ')[0]) == 'iOS') {
            this.setState({
              is_code_remit:true
            })
        }
      }
    })
  }
  // 登录页面初始化时调用接口验证是否存在token有效,如果有效就直接进入 '主页', 否则
  checkTokenValid = (params = {}) => {
    const { redirect } = params
    if (!redirect) {
      let flag = true
      setTimeout(() => { //为了做网络延时白页面显示文案
        if (flag) {
          this.setState({
            show_copywriting: true
          })
        }
      }, 2000)
      getAccountInfo().then(res => {
        flag = false
        this.setState({
          show_copywriting: false
        })
        if (isApiResponseOk(res)) {
          Taro.switchTab({
            url: '../../pages/calendar/index'
          })
        } else {
          this.setState({
            token_invalid: true
          })
        }
      }).catch(err => {
        this.setState({
          token_invalid: true
        })
      })

    } else {
      this.setState({
        token_invalid: true
      })
    }
  }
  //切换登陆方式
  ChangeLoginType = (e) => {
    this.setState({
      showCode: !this.state.showCode,
      pswd: ''
    })
    Taro.setNavigationBarTitle({
      title: !this.state.showCode ? '手机验证码登录':'密码登录'
    })
  }
  //用户输入框
  inputUser = (e) => {
    let value = e.target.value;
    //isMobile条件：为空 或者 是一个以1开头的整数
    let isMobile = value === '' || (!(Number.isNaN(Number(value))) && value.startsWith("1"));
    let { codeMessage, isCoded } = this.state;
    if (!isMobile) {
      codeMessage = '获取验证码';
      if (this.messageTimeOut) {
        clearInterval(this.messageTimeOut);
      }
      isCoded = false;
    }
    let { userMessageType, pswdErrorType } = this.state;
    if (String(value).length > 0) {
      userMessageType = 0;
      pswdErrorType = 0;
    }
    if (validateTel(value)) {
      userMessageType = 2
    }
    if(value.length == 11 && !validateTel(value) && !validateEmail(value)) {
      userMessageType = 1
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
    if (value === '' || (!validateTel(value) && !validateEmail(value))) {
      error = 1
    }
    this.setState({
      userMessageType: error
    })
  }
  // 输入验证码或者密码
  inputPswd = (e) => {
    let value = e.target.value;
    let { pswdErrorType,showCode } = this.state;
    if (String(value).length > 0) {
      pswdErrorType = 0;
    }
    this.setState({
      pswd: value,
      pswdErrorType: pswdErrorType
    },()=> {
      if(showCode && value.length == 6) {
        this.normalLogin()
      }
    })
  }

  inputVerifycode = (e) => {
    let value = e.target.value;
    let { verifycodeErrorType } = this.state;
    if (String(value).length > 0) {
      verifycodeErrorType = 0;
    }
    this.setState({
      verifycode: value,
      verifycodeErrorType: verifycodeErrorType
    })
    
  }
  //验证密码框
  checkPswd = (e) => {
    let value = e.target.value;
    let { showCode } = this.state;
    let error = 0;
    if (value === '') {
      if (showCode) {
        error = 2
      } else {
        error = 1
      }
    }
    this.setState({
      pswdErrorType: error
    })
  }

  //发送短信设置60s倒计时
  setCodeMessage = () => {
    let { codeMessage, user, userMessageType } = this.state;
    if (user === '') {
      this.setState({
        userMessageType: 1
      })
      return false;
    }
    if (userMessageType !== 2) {        //没有通过手机正则表达式
      return false;
    }
    if (codeMessage !== '重新获取' && codeMessage !== '获取验证码') return false;
    let data = {
      mobile: user,
      type: '2'
    }

    let _this = this;
    sendVerifyCode(data).then(res => {
      if (res.code !== '0') {
        let { isCoded, isMobile } = this.state;
        if (!isMobile) {
          codeMessage = '获取验证码';
          if (this.messageTimeOut) {
            clearInterval(this.messageTimeOut);
          }
          isCoded = false;
        }
        _this.setState({
          pswdErrorType: 3,
          isCoded: isCoded,
          codeMessage: codeMessage
        })
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000,
        })
      } else {
        let messageTime = 60;
      
        const fun = () => {
          messageTime = messageTime - 1;
          this.setState({
            // codeMessage: messageTime,
            messageTime:messageTime,
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
    });
  }
  //普通登录
  normalLogin = () => {
    const { dispatch } = this.props
    let { user, pswd, verifycode, showCode, userMessageType, verifycodeErrorType, verifyShow, verifycodeBase64Img, captchaKey } = this.state;
    let pswdErrorType = 0;
    if (user === '' || pswd === '') {
      if (user === '') {
        userMessageType = 1;
      }
      if (pswd === '') {
        if (showCode) {
          pswdErrorType = 2
        } else {
          pswdErrorType = 1
        }
      }
      if (verifycode === '') {
        if (showCode) {
          verifycodeErrorType = 1
        }
      }
      this.setState({
        pswdErrorType: pswdErrorType,
        userMessageType: userMessageType,
        verifycodeErrorType: verifycodeErrorType
      })
      return false;
    }
    let _this = this;
    let data = {
      account: user
    }
    if (showCode) {
      data.verifycode = pswd;
    } else {
      if (verifyShow) {
        data.captcha_key = captchaKey;
        data.verifycode = verifycode;
      }
      data.password = sha256(pswd);
    }
    Taro.showLoading({
      title: "登录中"
    });
    normalLogin(data).then(res => {
      Taro.showLoading();
      const { sourcePage } = this.state
      if (res.code === '0') {
        dispatch({
          type: 'login/handleToken',
          payload: {
            token_string: res.data,
            sourcePage: sourcePage.redirect,
          }
        })
      } else if (res.code === '4005' || res.code === '4006' || res.code === '4007') {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        });
        this.setState({
          verifyShow: true,
          verifycodeBase64Img: res.data.base64_img,
          captchaKey: res.data.captcha_key,
        })
      } else {
        Taro.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        });
      }
    }).catch(() => { Taro.hideLoading(); })
  }

  getVerifyCodeImg = () => {
    getVerifycodeImg().then(res => {
      const code = res.code
      if (code === '0') {
        this.setState({
          verifyShow: true,
          verifycodeBase64Img: res.data.base64_img,
          captchaKey: res.data.captcha_key,
        });
      }
    });
  }
  // 微信登录
  getUserInfo = (res) => {
    const { detail = {} } = res
    const { encryptedData, iv } = detail
    if (!!encryptedData) {
      const { dispatch } = this.props
      Taro.showLoading({
        title: "登录中"
      });
      Taro.login().then(res => {
        const code = res.code
        Taro.getUserInfo().then(async res2 => {
          const parmas = {
            encryptedData: res2.encryptedData, iv: res2.iv, code: code
          }
          await dispatch({
            type: 'login/weChatAuthLogin',
            payload: {
              parmas,
            }
          })
          Taro.hideLoading();
        }).catch(() => {
          Taro.hideLoading();
        })
      }).catch(() => {
        Taro.hideLoading();
      })
    }
  }
  // 账号删除
  formReset = e => {
    this.setState({
      user:'',
    })
  }
  /**
   * 
   * @returns 密码删除
   */
   formPswdReset = e => {
    this.setState({
      pswd:'',
    })
   }
   /**
    * 密码输入框设置密码类型
    * @returns 
    */
    setInputPassword = e => {
      this.setState({
        isPassword: !this.state.isPassword,
      })
    }
  render() {
    let { showCode, codeMessage = '',isPassword,isFocus, userMessageType, pswdErrorType, verifycodeErrorType, user, pswd, verifycode, captcha_key, verifyShow, verifycodeBase64Img, token_invalid, show_copywriting } = this.state;
    let userErrorMessage;
    var codeLength = ['','','','','',''];
    switch (userMessageType) {      //userMessageType === 2 通过正则表达式校验
      case 1: userErrorMessage = '请输入正确的手机号或邮箱'; break;
      // case 3: userErrorMessage = '登录的手机号不存在'; break;
      case 3: userErrorMessage = '输入的手机号不存在'; break;
      default: userErrorMessage = '';
    }

    let pswdErrorMessage;
    switch (pswdErrorType) {
      case 1: pswdErrorMessage = '请输入密码'; break;
      case 2: pswdErrorMessage = '请输入验证码'; break;
      case 3: pswdErrorMessage = '验证码发送失败，请重试'; break;
      case 4: pswdErrorMessage = '账号密码错误，请重试'; break;
      default: pswdErrorMessage = '';
    }
    let verifycodeErrorMessage;
    switch (verifycodeErrorType) {
      case 1: verifycodeErrorMessage = '请输入验证码'; break;
      case 2: verifycodeErrorMessage = '账号密码错误，请重试'; break;
      case 3: verifycodeErrorMessage = '获取验证码错误'; break;
      default: pswdErrorMessage = '';
    }

    let paswdClass = `${indexStyles.login_input} ${showCode ? indexStyles.login_code_input : indexStyles.login_pswd_input}`;
    let verifycodeView = null;
    if (!showCode && verifyShow) {
      verifycodeView = (
        <View className={`${indexStyles.login_code}`}>
          <View className={`${indexStyles.login_verifycode_item}`}>
            <Text className={`${globalStyles.global_iconfont} ${indexStyles.login_icon}`}>&#xe644;</Text>
            <Input type='text' value={verifycode} className={`${indexStyles.login_verifycode_input}`} placeholder='验证码' onInput={this.inputVerifycode} />
            <Image className={`${indexStyles.login_verifycode_img}`} src={`data:image/png;base64,${verifycodeBase64Img}`}>
            </Image>
            <Text className={`${indexStyles.login_verifycode_text} ${indexStyles.login_code_blue}`} onClick={this.getVerifyCodeImg}>换一张</Text>
          </View>
          <View className={`${indexStyles.login_error}`}>{verifycodeErrorMessage}</View>
        </View>)
    }
    let pswdlist =  pswd ? pswd.split("") : [];
    /**
     * 账号登录按钮是否可用
     */
    let canLogin = userMessageType == 2 && pswdlist.length > 0;
    let pswdlistLength = pswdlist.length;
    return (
      <View className={`${indexStyles.login}`}>
        {/* {
          !token_invalid && (
            <View className={`${indexStyles.login_mask}`}>
              {
                show_copywriting && (
                  <View className={`${indexStyles.login_mask_copywrite}`}>加载中,请稍候...</View>
                )
              }
            </View>
          )
        } */}
        {/* <View className={`${indexStyles.login_header}`}>{!showCode ? '账号密码' : '手机验证码'}登录</View> */}
        <View className={`${indexStyles.login_header}`}>
          {
            isCoded && showCode ? '输入验证码':'欢迎登录聆悉协作'
          } 
        </View>
        {/* 
          <View className={`${indexStyles.login_content}`}>
         <View>
            <View className={`${indexStyles.login_item}`}>
              <Text className={`${indexStyles.login_icon} ${globalStyles.global_iconfont}`}>&#xe640;</Text>
              <Input type='text' onBlur={this.checkUser} onInput={this.inputUser} className={`${indexStyles.login_input}`} placeholderClass={`${indexStyles.login_input_placeholder}`} placeholder='请输入手机号' value={user} />
            </View>
            <View className={`${indexStyles.login_error}`}>{userErrorMessage}</View>
          </View>
          <View className={`${indexStyles.login_code}`} >
            <View className={`${indexStyles.login_item}`}>
              <Text
                className={`${globalStyles.global_iconfont} ${indexStyles.login_icon}`}>&#xe644;</Text>
              <Input type={showCode ? 'text' : 'password'} onBlur={this.checkPswd} value={pswd} className={paswdClass} placeholder={showCode ? '验证码' : '密码'} onInput={this.inputPswd} />
              {showCode ? <Text className={`${indexStyles.login_code_text} ${user && (userMessageType === 2) && Object.prototype.toString.call(codeMessage) !== '[object Number]' ? indexStyles.login_code_blue : ''}`} onClick={this.setCodeMessage}>{codeMessage}</Text> : ''}
            </View>
            <View className={`${indexStyles.login_error}`}>{pswdErrorMessage}</View>
          </View>
          //账号密码登录验证码
          {verifycodeView}
        </View>
        <View className={`${indexStyles.login_footer}`}>
          <Button className={`${indexStyles.login_btn_normal} ${indexStyles.login_btn}`} type='primary' onClick={this.normalLogin}>登录</Button>
        </View>
        <View className={`${indexStyles.change_login_type_out}`}>
          <View onClick={this.ChangeLoginType} className={`${indexStyles.change_login_type}`}>{showCode ? '账号密码' : '验证码'}登录</View>
        </View>
      */}
      <View className={`${indexStyles.login_content}`}>
      {
        showCode ? (
          <View>
             {
              isCoded ? 
              (
                <View>
                  <View className={indexStyles.ipt_text_tips}>验证码已发送至 {user} </View>
                    <View className={indexStyles.iptbox_code}>
                    {
                      codeLength.map((item, index) => {
                        return <Input className={`${indexStyles.ipt_code} ${pswdlistLength == index ? indexStyles.ipt_code_active : ''}`} value={pswdlist.length >= index+1 ? pswdlist[index]:''} disabled></Input>
                      })
                    }
                    {
                      is_code_remit ? (
                        <Input  className={indexStyles.ipt_place} maxLength={6}  onInput={this.inputPswd}></Input>  
                      ) : (
                        <Input type='number' className={indexStyles.ipt_place} maxLength={6}  onInput={this.inputPswd}></Input>  
                      )
                    }
                    </View>
                  {
                    messageTime == 0 ? (<View onClick={this.setCodeMessage} className={`${indexStyles.ipt_text_tips} ${indexStyles.ipt_text_tips_getcode}`} >重新获取</View>) : (<View className={indexStyles.ipt_text_tips}>{messageTime}  秒后重新获取验证码</View>)
                  } 
                </View>
              )
              :
              (
              <View>
                <Form  className={indexStyles.inputForm} onReset={this.formReset}>
                  <View className={`${indexStyles.login_item} `}>
                    <Input type = 'number' value={user} onBlur={this.checkUser}  maxLength={11} onInput={this.inputUser} className={`${indexStyles.login_input}`} placeholderClass={`${indexStyles.login_input_placeholder}`} placeholder='请输入手机号' /> 
                   {
                     user && <Button className={`${globalStyles.global_iconfont} ${indexStyles.deleteIcon}`} formType='reset'  >&#xe7fc;</Button>
                   } 
                  </View>
                </Form>
                <View className={`${indexStyles.login_error}`}>{userErrorMessage}</View>
                <Button className={`${indexStyles.login_code_button} ${userMessageType == 2 ? '' : indexStyles.unused_login_code_button}`} onClick={this.setCodeMessage}>获取短信验证码</Button>
                
              </View> 
              )
            }   
          </View>
        ) : (
          <View>
            <Form  className={indexStyles.inputForm} onReset={this.formReset}>
              <View className={`${indexStyles.login_item}`}>
                <Input type = 'number' value={user} onBlur={this.checkUser}  maxLength={11} onInput={this.inputUser} className={`${indexStyles.login_input}`} placeholderClass={`${indexStyles.login_input_placeholder}`} placeholder='请输入手机号' />
                {
                  user && <Button className={`${globalStyles.global_iconfont} ${indexStyles.deleteIcon}`} formType='reset'  >&#xe7fc;</Button>
                } 
              </View>
            </Form>
            <View className={`${indexStyles.login_error}`}>{userErrorMessage}</View>
            <Form  className={indexStyles.inputForm} onReset={this.formPswdReset}>
              <View className={`${indexStyles.login_item} ${indexStyles.login_item_psw}`}>
                <Input password={isPassword}  onInput={this.inputPswd} className={`${indexStyles.login_input}`} placeholderClass={`${indexStyles.login_input_placeholder}`} placeholder='请输入密码' />
                {
                  pswd ? (
                    <View>
                      <Button className={`${globalStyles.global_iconfont} ${indexStyles.deleteIcon} ${indexStyles.deletePswdIcon}`} formType='reset'>&#xe7fc;</Button>
                    </View>
                  ) : ('')
                } 
                {
                  isPassword ? (
                    <Button className={`${globalStyles.global_iconfont} ${indexStyles.deleteIcon}`} onClick={this.setInputPassword}>&#xe859;</Button>
                  ) : (
                    <Button className={`${globalStyles.global_iconfont} ${indexStyles.deleteIcon}`} onClick={this.setInputPassword}>&#xe85a;</Button>
                  )
                }
              </View>
            </Form>
           
            <Button className={`${indexStyles.login_code_button}  ${canLogin ? '' : indexStyles.unused_login_code_button}`} onClick={this.normalLogin}>登录</Button>
          </View>
        )
      }
        </View>
        <View className={indexStyles.other_login_way}>
           <View className={indexStyles.other_login_way_item}></View>
            <View className={indexStyles.other_login_way_item}>
              <Button className={indexStyles.other_login_way_icon_bg}  open-type={'getUserInfo'}
                      onGetUserInfo={this.getUserInfo}>
                <Text
                    className={`${globalStyles.global_iconfont} ${indexStyles.wx_login_icon}`}>&#xe846;</Text>
              </Button>
              <View className={indexStyles.other_login_way_item_text}>微信登录</View>
            </View>
            {
              showCode ? 
              (
                <View className={indexStyles.other_login_way_item} onClick={this.ChangeLoginType}>
                <View className={indexStyles.other_login_way_icon_bg}>
                  <Text
                    className={`${globalStyles.global_iconfont} ${indexStyles.psw_login_icon}`}>&#xe858;</Text>
                </View>
                <View className={indexStyles.other_login_way_item_text} >密码登录</View>
              </View>
              ) :
              (
                <View className={indexStyles.other_login_way_item} onClick={this.ChangeLoginType}>
                <View className={indexStyles.other_login_way_icon_bg}>
                  <Text
                    className={`${globalStyles.global_iconfont} ${indexStyles.psw_login_icon}`}>&#xe857;</Text>
                </View>
                <View className={indexStyles.other_login_way_item_text} >验证登录</View>
              </View>
              )
            }
            <View className={indexStyles.other_login_way_item}></View>
        </View>
      </View>
    )
  }
}



