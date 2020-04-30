import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Input,
  Text,
  Image,
  ScrollView,
  Swiper,
  SwiperItem,
  Canvas
} from '@tarojs/components';
import { connect } from '@tarojs/redux';
import styles from './UserInput.scss';
import globalStyles from './../../../gloalSet/styles/globalStyles.scss';
import emojiObj from './../../../models/im/config/emoji.js';
import genEmojiList from './../../../models/im/utils/genEmojiList.js';
import { init } from '../../../utils/canvasImage'
import DrawCanvas from '../../drawCanvas/index.js'

@connect(
  ({
    im: {
      isOnlyShowInform,
    },
    chat: {
      handleInputMode,
    },
  }) => ({ isOnlyShowInform, handleInputMode }),
  dispatch => ({
    sendTeamTextMsg: (text, to, apns) =>
      dispatch({
        type: 'im/sendMsg',
        payload: {
          type: 'text',
          text,
          scene: 'team',
          apns: apns,
          to
        },
        desc: 'im send msg'
      }),
    sendTeamAudioMsg: (wxFilePath, to) =>
      dispatch({
        type: 'im/sendAudio',
        payload: {
          scene: 'team',
          to,
          type: 'audio',
          wxFilePath
        },
        desc: 'im send audio'
      }),
    sendImageMsg: (tempFilePaths, to) =>
      dispatch({
        type: 'im/sendImage',
        payload: {
          type: 'image',
          scene: 'team',
          to,
          tempFilePaths
        },
        desc: 'im send image'
      }),
    sendPinupEmoji: (to, catalog, chartlet) =>
      dispatch({
        type: 'im/sendPinupEmoji',
        payload: {
          type: 'custom',
          scene: 'team',
          to,
          pushContent: '[贴图表情]',
          content: {
            type: 3,
            data: {
              catalog,
              chartlet
            }
          }
        },
        desc: 'im send emoji'
      }),
    handleUserInputHeightChange: height =>
      dispatch({
        type: 'chat/updateStateFieldByCover',
        payload: {
          isUserInputHeightChange: height
        },
        desc: 'chat userInput height change'
      }),
    // 聚焦 input 的时候会呼出虚拟键盘，这里记录 是否呼出虚拟键盘
    handleUserInputFocus: flag =>
      dispatch({
        type: 'chat/updateStateFieldByCover',
        payload: {
          isUserInputFocus: flag
        },
        desc: 'change userInput focus'
      })

  })
)
class UserInput extends Component {
  constructor(props) {
    super(props)
    this.TextInput = "";
    this.isRecording = false;
    this.canvasImg = null ;
  }
  state = {
    inputValue: '', // 文本类型输入框 value
    autoFocus: false, // 是否自动聚焦文本输入框(如果自动聚焦，则会弹出虚拟键盘)
    inputMode: 'text', //输入模式，默认 'text'. 'text' | voice | expression | addition
    recordStart: false, // 录音开始
    recorderManager: null, //录音内容
    emojiType: 'emoji', // emoji | pinup
    emojiAlbum: 'emoji', // emoji | ajmd | lt | xxy
    inputBottomValue: 0,
    isRecording: false,
    atIds: [],
    showCanvas:false,
    canvasPic:null,
    sourceType:null
  };
  handleInputFocus = e => {
    const { handleUserInputFocus, handleUserInputHeightChange } = this.props;
    handleUserInputFocus && handleUserInputFocus(true)
    // console.log('sssss', this.refs.inputRef)
    // let chatContentHeight = 0;
    // const query = Taro.createSelectorQuery();
    // query.select('#the-YOUR_ELEMEMT_ID').boundingClientRect();
    // query.selectViewport().scrollOffset()
    // query.exec((res)=>{
    //   console.log("YING lkkk",res);
    //   chatContentHeight = res[0].height;
    // });
    if (e.detail.height > 0) {
      handleUserInputHeightChange && handleUserInputHeightChange(e.detail.height);
    }else{
      // handleUserInputHeightChange(303)
    }
    //handleUserInputHeightChange(298);
    this.setState({
      inputMode: 'text',
      //inputBottomValue:'298px'
      inputBottomValue: e.detail.height > 0 ? (e.detail.height - 15) + 'px' : this.state.inputBottomValue
    });
  };
  handleInputBlur = () => {
    const { handleUserInputFocus, handleUserInputHeightChange } = this.props;
    handleUserInputFocus && handleUserInputFocus(false)
    // handleUserInputHeightChange && handleUserInputHeightChange(0);
    this.setState({
      inputBottomValue: 0
    });
  };
  handleInput = e => {
    let text = e.currentTarget.value;
    let { detail } = e;
    let last = text.substring(text.length - 1, text.length);
    // 如果输入的符合@符号，并且不是删除时触发的
    if (last === '@' && detail.keyCode != 8) {
      this.props.onPrefix && this.props.onPrefix(text);
    }
    this.setState({
      inputValue: e.currentTarget.value
    });
    // 如果有删除的艾特人员，就更新atIds
    this.preFixUserDelete(e.currentTarget.value);
  };
  preFixUserDelete = (text) => {
    let { atIds: willSendUser } = this.state;
    let arr = [];
    // 检测是否存在已经删除的艾特人员，手动输入的艾特消息将不计入艾特效果中
    willSendUser && willSendUser.forEach(item => {
      let reg = new RegExp("@" + item.name, "g");
      if (reg.test(text)) {
        arr.push(item);
      }
    })
    // 更新列表
    this.setState({
      atIds: arr
    })
  }
  // 获取那些艾特中了的人员ID
  getApns = () => {
    let { atIds } = this.state;
    let arr = [];
    atIds.forEach(item => {
      arr.push(item.user_id)
    })
    return arr;
  }
  // 发送消息
  sendTextMsg = () => {

    const { inputValue } = this.state;
    const { im_id, sendTeamTextMsg, onSend } = this.props;

    if (!inputValue || !inputValue.trim()) {
      Taro.showToast({
        title: '请不要发空消息',
        icon: 'none',
        duration: 2000
      });
      this.setState({
        inputValue: ''
      });
      return;
    }

    if (!im_id) {
      onSend && onSend(inputValue.trim());
      this.setState({
        inputValue: ''
      });
      return ;
      // Taro.showToast({
      //   title: '未获取到群消息',
      //   icon: 'none',
      //   duration: 2000
      // });
      // return;
    }

    if (inputValue.length > 800) {
      Taro.showToast({
        title: '请不要超过800个字',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    Taro.showLoading({
      title: '发送中...',
    });
    let users = this.getApns();
    let apns = {};
    if (users.length) {
      apns.accounts = users;
    } else {
      apns = undefined;
    }
    Promise.resolve(sendTeamTextMsg(inputValue, im_id, apns))
      .then(() => {
        this.setState({
          inputValue: '',
          atIds: []
        })
        onSend && onSend(inputValue)
      })
      .catch(e =>
        Taro.showToast({
          title: String(e),
          icon: 'none',
          duration: 2000
        })
      );


    // 发送聊天消息的时候如果消息收起状态: 自动展开聊天消息列表
    const { dispatch, isOnlyShowInform } = this.props
    if (isOnlyShowInform == true) {
      dispatch({
        type: 'im/updateStateFieldByCover',
        payload: {
          isOnlyShowInform: false
        },
        desc: 'toggle im isOnlyShowInform'
      })
    }
  };
  onInputConfirm = () => {
    this.setState({
      autoFocus: true
    });
    this.sendTextMsg();
  };
  handleTextInput = () => {
    this.setState(
      {
        inputMode: 'text'
      },
      () => {
        this.setState({
          autoFocus: true
        });
      }
    );
  };
  setInputMode = mode => {
    this.setState(
      {
        inputMode: mode
      },
      () => {
        if (mode === 'text')
          this.setState({
            autoFocus: true
          });
      }
    );
    const { dispatch } = this.props;
    dispatch({
      type: 'chat/updateStateFieldByCover',
      payload: {
        handleInputMode: mode
      },
      desc: 'setInputMode'
    });
  };
  toggleInputMode = (aMode, bMode) => {
    const { handleUserInputHeightChange } = this.props;
    const { inputMode } = this.state;
    if (inputMode === aMode) {
      this.setInputMode(bMode);
      handleUserInputHeightChange(0)
    } else {
      this.setInputMode(aMode);
      handleUserInputHeightChange(280)
    }
  };
  handleClickedItem = (e, type) => {
    if (e) e.stopPropagation();
    const { handleUserInputFocus, handleUserInputHeightChange,hideVoice } = this.props;
    if(hideVoice && type == 'voice'){
      Taro.showToast({
        title:"暂不支持发送语音",
        icon:"none"
      })
      return ;
    }
    handleUserInputFocus(false)

    const typeCond = {
      voice: () => this.setInputMode('voice'),
      text: () => this.setInputMode('text'),
      expression: () => this.setInputMode('expression'),
      addition: () => this.toggleInputMode('addition', 'text')
    };
    if (!typeCond[type]) {
      Taro.showToast({
        title: '未完成功能',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (type === 'expression' || type === 'addition') {
      // 根据这个调整 chatcontent 的下内边距, 防止其内容被遮挡
      handleUserInputHeightChange(280);
    } else {
      handleUserInputHeightChange(0);
    }

    typeCond[type]();
  };

  sendChooseImage = (res)=>{
    const { im_id, sendImageMsg ,handleUserInputHeightChange} = this.props;
    const { setInputMode } = this;
    Taro.showLoading({
      title: '发送中...',
    });
    Promise.resolve(sendImageMsg(res.tempFilePaths, im_id))
      .then(() => {
        setInputMode('text');
        handleUserInputHeightChange && handleUserInputHeightChange(0);
      })
      .catch(e => {
        Taro.showToast({
          title: String(e),
          icon: 'none',
          duration: 2000
        });
      });
  }
  handleChooseImage = (...types) => {
    let _this = this;
    // this.setState({
    //   sourceType: types,
    //   showCanvas: true
    // })
    Taro.chooseImage({
      sourceType: types,
      success: function (res) {
        // 发送图片
        _this.sendChooseImage(res);
        // 获取屏幕大小-打开canvas
        // _this.setState({
        //   showCanvas:true
        // },()=>{
        //   setTimeout(()=>{
        //     wx.getSystemInfo({
        //       success:function (msg){
        //         let { screenHeight ,screenWidth ,windowHeight, windowWidth} = msg ;
        //         // 构建图片编辑器
        //         init({
        //           width: windowWidth, height: windowHeight,scope: _this,
        //           urls: res.tempFilePaths ,activeUrl: res.tempFilePaths[0]
        //         });
        //       }
        //     })
        //   })
        // })

      },
      fail: function () {
        Taro.showToast({
          title: '未选择任何图片',
          icon: 'none',
          duration: 2000
        });
      },
      complete: function () { }
    });
  };
  handleChooseFile = () => {
    Taro.showToast({
      title: '未完成功能',
      icon: 'none',
      duration: 2000
    })
  }
  handleClickAdditionItem = type => {
    const cond = {
      image: () => this.handleChooseImage('album'),
      photo: () => this.handleChooseImage('camera'),
      file: () => this.handleChooseFile()
    };
    if (cond[type]) {
      cond[type]();
    }

    Taro.setStorageSync('is_chat_extended_function', 'true')
  };
  handleVoiceTouchEnd = () => {
    Taro.hideToast();
    this.setState(
      {
        recordStart: false
      },
      () => {
        const { recorderManager } = this.state;
        if (!recorderManager) {
          return;
        }
        recorderManager.stop();
        this.isRecording = false;
      }
    );
  };
  sendAudioMsg = res => {
    Taro.showLoading({
      title: '发送中...',
    });
    const { tempFilePath } = res;
    const { im_id, sendTeamAudioMsg } = this.props;
    Promise.resolve(sendTeamAudioMsg(tempFilePath, im_id))
      .then(() => {
        this.setState({
          recorderManager: null
        });
      })
      .catch(e =>
        Taro.showToast({
          title: String(e),
          icon: 'none',
          duration: 2000
        })
      );
  };
  /***
   * 开始录音
   */
  startRecord = () => {
    //短震动反馈
    //仅在 iPhone 7 / 7 Plus 以上及 Android 机型生效
    Taro.vibrateShort()
    const { recordStart } = this.state
    if (recordStart) {
      const options = {
        duration: 120 * 1000,
        format: 'mp3'
      };
      Taro.showToast({
        title: '录音中...',
        icon: 'none',
        duration: options.duration,
      });

      const recorderManager =
        this.state.recorderManager || Taro.getRecorderManager();

      let that = this;
      recorderManager.start(options);
      this.isRecording = true;
      this.setState({
        recorderManager
      });
      recorderManager.onStart( res => {
        if(!this.isRecording){
          recorderManager.stop();
        }
      })
      recorderManager.onStop(res => {
        Taro.hideToast();

        // console.log(res);
        if (res.duration < 1000) {
          Taro.showToast({
            title: '录音时间太短',
            icon: 'error',
            duration: 2000
          });
        } else if(res.duration >= 1000 && res.duration < (options.duration - 50) ){
          // console.log('发送中小于120',res.duration,options.duration)
          that.sendAudioMsg(res);
        }


        // 超出最大时长
        if(res.duration >= (options.duration - 50)){
          let title = `时间超过${(options.duration / 1000)}s`
          Taro.showToast({
            title: title,
            icon: 'error',
            duration: 2000
          });
          setTimeout(()=>{
            // console.log('发送中，大于最大的')
            that.sendAudioMsg(res);
          },2000)
        }
      });
    }
  };
  handleVoiceTouchStar = () => {
    const recorderManager =
        this.state.recorderManager || Taro.getRecorderManager();
    this.setState(
      {
        recordStart: true
      },
      () => {
        let that = this;
        Taro.getSetting({
          success: res => {
            let recordAuth = res.authSetting['scope.record'];
            if (recordAuth == false) {
              //已申请过授权，但是用户拒绝
              Taro.openSetting({
                success: function (res) {
                  let recordAuth = res.authSetting['scope.record'];
                  if (recordAuth == true) {
                    Taro.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 2000
                    });
                  } else {
                    Taro.showToast({
                      title: '请授权录音',
                      icon: 'success',
                      duration: 2000
                    });
                  }
                  that.setState({
                    recordStart: false
                  });
                }
              });
            } else if (recordAuth == true) {
              // 用户已经同意授权
              that.startRecord();
            } else {
              // 第一次进来，未发起授权
              Taro.authorize({
                scope: 'scope.record',
                success: () => {
                  //授权成功
                  Taro.showToast({
                    title: '授权成功',
                    icon: 'success',
                    duration: 2000
                  });
                }
              });
            }
          },
          fail: function () {
            recorderManager.stop();
            Taro.showToast({
              title:"未开启麦克风",
              icon:'error',
              duration:2000
            })
          },
          complete:function (res){
            let recordAuth = res.authSetting['scope.record'];
            if(recordAuth === false){
              recorderManager.stop();
              Taro.showModal({
                title: '提示',
                content: '尚未进行授权，部分功能将无法使用',
                showCancel: false,
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        Taro.openSetting({
                            success: (res) => {
                                if (!res.authSetting['scope.record']) {
                                    Taro.authorize({
                                        scope: 'scope.record',
                                        success() {
                                            console.log('授权成功')
                                        }, fail() {
                                            console.log('用户点击取消')
                                        }
                                    })
                                }
                            },
                            fail: function () {
                                console.log("授权失败");
                            }
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
            }
          }
        });
      }
    );
  };

  genEmojiInfo = () => {
    const { emojiList, pinupList } = emojiObj;
    const emojiListMap = [
      ...Object.entries(genEmojiList('emoji', emojiList)),
      ...Object.entries(genEmojiList('pinup', pinupList))
    ];
    return {
      emojiAlbumList: emojiListMap.map(([name, { type, album }]) => ({
        type,
        url: album,
        name
      })),
      emojiList: emojiListMap.map(([name, { type, list }]) => ({
        type,
        list,
        name
      }))
    };
  };
  handleSelectedEmojiItem = i => {
    const { type, name, key } = i;
    const { im_id, sendPinupEmoji ,fromPage = 'chat' } = this.props;

    // emoji 类型的表情会混合进 type = 'text' 的文本信息流
    // pinup 类型的表情会作为一种自定义的消息类型直接发送

    if (type === 'emoji') {
      this.setState(state => {
        const { inputValue } = state;
        return {
          inputValue: inputValue + key
        };
      });
    }
    if (type === 'pinup') {
      if(fromPage == 'chat'){
        sendPinupEmoji(im_id, name, key);
      }else{
        Taro.showToast({
          title:'暂不支持此表情',
          icon:"none"
        })
      }
    }
  };
  handleSelectEmojiList = i => {
    const { type, name } = i;
    const { emojiAlbum } = this.state;
    if (name === emojiAlbum) return;
    this.setState({
      emojiType: type,
      emojiAlbum: name
    });
  };
  inputModeBelongs = (...modeArr) => {
    const { inputMode } = this.state;
    return modeArr.some(m => m === inputMode);
  };
  componentWillUnmount() {
    this.setState({
      recorderManager: null
    });
  }
  // 设定艾特别人的文字
  addPrefixNames = (val) => {
    let list = [...this.state.atIds];
    list.push(val);
    this.setState({
      atIds: list,
      inputValue: this.state.inputValue + val.name + ' '
    })
    // this.TextInput && this.TextInput.current.focus();
  }

  componentWillReceiveProps(nextProps) {
    const { handleInputMode, prefixUser } = nextProps;
    // console.log(handleInputMode);
    this.setState({
      inputMode: handleInputMode
    });
    if (prefixUser && (prefixUser != this.props.prefixUser)) {
      this.addPrefixNames(prefixUser)
    }

  }

  setInput = (node) => { this.TextInput = node; }

  render() {
    const {
      inputValue,
      autoFocus,
      inputMode,
      recordStart,
      emojiType,
      emojiAlbum,
      inputBottomValue,
      showCanvas,
      sourceType
    } = this.state;
    let { hideAddition, hideVoice, fromPage = 'chat' } = this.props;

    const { emojiAlbumList, emojiList } = this.genEmojiInfo();
    const findedCurrentEmojiAlbum = emojiList.filter(
      i => i.name === emojiAlbum
    );
    const shouldDisplayEmojiList =
      findedCurrentEmojiAlbum && findedCurrentEmojiAlbum.length
        ? findedCurrentEmojiAlbum[0].list
        : [];
    return (
      <View
        className={styles.wrapper}
        style={{
          position: this.inputModeBelongs('expression', 'addition')
            ? 'fixed'
            : 'relative',
          bottom: this.inputModeBelongs('expression', 'addition') ? '10px' : inputBottomValue
        }}
      >
        <View className={styles.panelWrapper}>
          {this.inputModeBelongs('text', 'expression', 'addition') && (
            <View
              className={`${globalStyles.global_iconfont} ${styles.voice}`}
              onClick={e => this.handleClickedItem(e, 'voice')}
            >
              &#xe648;
            </View>
          )}
          {inputMode === 'voice' && (
            <View
              className={`${globalStyles.global_iconfont} ${styles.voice}`}
              onClick={e => this.handleClickedItem(e, 'text')}
            >
              &#xe655;
            </View>
          )}
          {this.inputModeBelongs('text', 'expression', 'addition') && (
            <View className={styles.input}>
              <Input
                ref={this.setInput}
                value={inputValue}
                confirmType='done'
                adjustPosition={true}
                cursorSpacing={20}
                style={{
                  lineHeight: '84px',
                  width: '450px',
                  marginLeft: '10px',
                  marginRight: '10px'
                }}
                focus={autoFocus}
                confirmHold={true}
                onInput={this.handleInput}
                // onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
              // onConfirm={this.onInputConfirm}
              />
            </View>
          )}
          {inputMode === 'voice' && (
            <View
              className={`${styles.voiceInput} ${
                recordStart ? styles.voiceInputing : ''
                }`}
              onTouchStart={this.handleVoiceTouchStar}
              onTouchEnd={this.handleVoiceTouchEnd}
            >
              <Text>{`${recordStart ? '松开 结束' : '按住 说话'}`}</Text>
            </View>
          )}
          <View>
            {inputMode === 'expression' ? (
              <View
                className={`${globalStyles.global_iconfont} ${
                  styles.expression
                  }`}
                onClick={e => this.handleClickedItem(e, 'text')}
              >
                &#xe655;
              </View>
            ) : (
                <View
                  className={`${globalStyles.global_iconfont} ${
                    styles.expression
                    }`}
                  onClick={e => this.handleClickedItem(e, 'expression')}
                >
                  &#xe631;
              </View>
              )}
          </View>
          {inputValue && inputValue.trim() ? (
            <View className={styles.sendTextBtn} onClick={this.onInputConfirm}>
              发送
            </View>
          ) : (
            !hideAddition ?
              <View
                className={`${globalStyles.global_iconfont} ${styles.addition}`}
                onClick={e => this.handleClickedItem(e, 'addition')}
              >
                &#xe632;
            </View>
            :(
              <View className={styles.sendTextBtn} onClick={this.onInputConfirm}>
                发送
              </View>
            )
            )}
        </View>

        <View className={styles.bottomView}></View>

        {inputMode === 'expression' && (
          <View className={styles.contentWrapper}>
            <View className={styles.emojiListWrapper}>
              <ScrollView
                className={styles.emojiScrollViewContentWrapper}
                scrollY
                scrollWithAnimation
              >
                <View className={styles.emojiListContentWrapper}>
                  {shouldDisplayEmojiList.map(i => (
                    <View
                      className={styles.emojiScrollViewContentItemWrapper}
                      key={i.key}
                      style={{
                        width: emojiType === 'emoji' ? '50px' : '80px',
                        height: emojiType === 'emoji' ? '50px' : '80px'
                      }}
                      onClick={() => this.handleSelectedEmojiItem(i)}
                    >
                      <Image
                        src={i.img}
                        mode='aspectFill'
                        style={{
                          width: emojiType === 'emoji' ? '30px' : '60px',
                          height: emojiType === 'emoji' ? '30px' : '60px'
                        }}
                      />
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
            <View className={styles.emojiPanelWrapper}>
              <View className={styles.emojiPanelContentWrapper}>
                {emojiAlbumList.map(i => (
                  <View
                    className={`${styles.emojiPanelItemWrapper} ${
                      emojiAlbum === i.name ? styles.emojiPanelItemActive : ''
                      }`}
                    key={i.url}
                    onClick={() => this.handleSelectEmojiList(i)}
                  >
                    <Image
                      src={i.url}
                      mode='aspectFill'
                      style={{
                        width: '30px',
                        height: '30px',
                        justifyItems: 'center',
                        margin: '0 auto'
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
        {inputMode === 'addition' && (
          <View className={styles.contentWrapper}>
            <Swiper
              className={styles.additionWrapper}
              indicatorColor='#F1F1F1'
              indicatorActiveColor='#C1C1C1'
              indicatorDots={false}
            >
              <SwiperItem>
                <View className={styles.additionContentWrapper}>
                  <View className={styles.additionItemWrapper}>
                    <View
                      className={`${globalStyles.global_iconfont} ${
                        styles.additionItemBtnIcon
                        }`}
                      onClick={() => this.handleClickAdditionItem('file')}
                    >
                      &#xe662;
                    </View>
                    <Text className={styles.additionItemText}>文件</Text>
                  </View>
                  <View className={styles.additionItemWrapper}>
                    <View
                      className={`${globalStyles.global_iconfont} ${
                        styles.additionItemBtnIcon
                        }`}
                      onClick={() => this.handleClickAdditionItem('image')}
                    >
                      &#xe664;
                    </View>
                    <Text className={styles.additionItemText}>图片</Text>
                  </View>
                  <View className={styles.additionItemWrapper}>
                    <View
                      className={`${globalStyles.global_iconfont} ${
                        styles.additionItemBtnIcon
                        }`}
                      onClick={() => this.handleClickAdditionItem('photo')}
                    >
                      &#xe663;
                    </View>
                    <Text className={styles.additionItemText}>拍照</Text>
                  </View>
                </View>
              </SwiperItem>
            </Swiper>
          </View>
        )}
        {
          showCanvas && <DrawCanvas sourceType={sourceType}/>
          // <View className={styles.canvasView}>
          //   <Canvas type='2d' id="canvasImg" disable-scroll='true' canvas-id='canvasImg'/>
          // </View>

        }

      </View>
    );
  }
}

export default UserInput;

