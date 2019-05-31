import Taro, { Component } from '@tarojs/taro';
import {
  View,
  Input,
  Text,
  Image,
  ScrollView,
  Swiper
} from '@tarojs/components';
import { connect } from '@tarojs/redux';
import styles from './UserInput.scss';
import globalStyles from './../../../gloalSet/styles/globalStyles.scss';
import emojiObj from './../../../models/im/config/emoji.js';
import genEmojiList from './../../../models/im/utils/genEmojiList.js';

@connect(
  ({
    im: {
      currentGroup: { im_id }
    }
  }) => ({ im_id }),
  dispatch => ({
    sendTeamTextMsg: (text, to) =>
      dispatch({
        type: 'im/sendMsg',
        payload: {
          type: 'text',
          text,
          scene: 'team',
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
  state = {
    inputValue: '', // 文本类型输入框 value
    autoFocus: false, // 是否自动聚焦文本输入框(如果自动聚焦，则会弹出虚拟键盘)
    inputMode: 'text', //输入模式，默认 'text'. 'text' | voice | expression | addition
    recordStart: false, // 录音开始
    recorderManager: null, //录音内容
    emojiType: 'emoji', // emoji | pinup
    emojiAlbum: 'emoji' // emoji | ajmd | lt | xxy
  };
  handleInputFocus = e => {
    const {handleUserInputFocus } = this.props;
    handleUserInputFocus(true)
    this.setState({
      inputMode: 'text'
    });
  };
  handleInputBlur = () => {
    const { handleUserInputFocus } = this.props;
    handleUserInputFocus(false)
  };
  handleInput = e => {
    this.setState({
      inputValue: e.currentTarget.value
    });
  };
  sendTextMsg = () => {
    const { inputValue } = this.state;
    const { im_id, sendTeamTextMsg } = this.props;
    if (!im_id) {
      Taro.showToast({
        title: '未获取到群消息',
        icon: 'none'
      });
      return;
    }
    if (!inputValue || !inputValue.trim()) {
      Taro.showToast({
        title: '请不要发空消息',
        icon: 'none'
      });
      this.setState({
        inputValue: ''
      });
      return;
    }
    if (inputValue.length > 800) {
      Taro.showToast({
        title: '请不要超过800个字',
        icon: 'none'
      });
      return;
    }
    Promise.resolve(sendTeamTextMsg(inputValue, im_id))
      .then(() =>
        this.setState({
          inputValue: ''
        })
      )
      .catch(e =>
        Taro.showToast({
          title: String(e),
          icon: 'none'
        })
      );
  };
  onInputConfirm = () => {
    this.setState({
      autoFocus: true
    });
    this.sendTextMsg();
  };
  handleVoiceInput = () => {
    this.setState({
      inputMode: 'voice'
    });
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
  };
  toggleInputMode = (aMode, bMode) => {
    const { inputMode } = this.state;
    if (inputMode === aMode) {
      this.setInputMode(bMode);
    } else {
      this.setInputMode(aMode);
    }
  };
  handleClickedItem = (e, type) => {
    if (e) e.stopPropagation();
    const { handleUserInputHeightChange } = this.props;
    const typeCond = {
      voice: () => this.setInputMode('voice'),
      text: () => this.setInputMode('text'),
      expression: () => this.setInputMode('expression'),
      addition: () => this.toggleInputMode('addition', 'text')
    };
    if (!typeCond[type]) {
      Taro.showToast({
        title: '未完成功能',
        icon: 'none'
      });
      return;
    }
    if (type === 'expression' || type === 'addition') {
      handleUserInputHeightChange(280);
    } else {
      handleUserInputHeightChange(0);
    }
    typeCond[type]();
  };
  sendImageToNOS = res => {
    Taro.showLoading({
      title: '发送中...'
    });
    let self = this;
    let tempFilePaths = res.tempFilePaths;
    for (let i = 0; i < tempFilePaths.length; i++) {
      // 上传文件到nos
      app.globalData.nim.sendFile({
        // app.globalData.nim.previewFile({
        type: 'image',
        scene: self.data.chatType === 'p2p' ? 'p2p' : 'team',
        to: self.data.chatTo,
        wxFilePath: tempFilePaths[i],
        done: function(err, msg) {
          wx.hideLoading();
          // 判断错误类型，并做相应处理
          if (self.handleErrorAfterSend(err)) {
            return;
          }
          // 存储数据到store
          self.saveChatMessageListToStore(msg);

          // 滚动到底部
          self.scrollToBottom();
        }
      });
    }
  };
  handleChooseImage = (...types) => {
    const { im_id, sendImageMsg } = this.props;
    Taro.chooseImage({
      sourceType: types,
      success: function(res) {
        Taro.showLoading({
          title: '发送中...'
        });
        Promise.resolve(sendImageMsg(res.tempFilePaths, im_id))
          .then(() => {
            Taro.hideLoading();
          })
          .catch(e => {
            Taro.hideLoading();
            Taro.showToast({
              title: String(e),
              icon: 'none'
            });
          });
      },
      fail: function() {
        Taro.showToast({
          title: '未选择任何图片',
          icon: 'none'
        });
      },
      complete: function() {}
    });
  };
  handleChooseFile = () => {
    Taro.showToast({
      title: '未完成功能',
      icon: 'none',
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

  };
  handleVoiceTouchEnd = () => {
    this.setState(
      {
        recordStart: false
      },
      () => {
        Taro.hideToast();
        const { recorderManager } = this.state;
        if (!recorderManager) {
          return;
        }
        recorderManager.stop();
      }
    );
  };
  sendAudioMsg = res => {
    Taro.showLoading({
      title: '发送中...'
    });
    const { tempFilePath } = res;
    const { im_id, sendTeamAudioMsg } = this.props;
    Promise.resolve(sendTeamAudioMsg(tempFilePath, im_id))
      .then(() => {
        Taro.hideLoading();
        this.setState({
          recorderManager: null
        });
      })
      .catch(e =>
        Taro.showToast({
          title: String(e),
          icon: 'none'
        })
      );
  };
  startRecord = () => {
    Taro.showToast({
      title: '录音中...',
      icon: 'none',
      duration: 20000000
    });
    const recorderManager =
      this.state.recorderManager || Taro.getRecorderManager();
    const options = {
      duration: 120 * 1000,
      format: 'mp3'
    };
    let that = this;
    recorderManager.start(options);
    this.setState({
      recorderManager
    });
    recorderManager.onStop(res => {
      if (res.duration < 2000) {
        Taro.showToast({
          title: '录音时间太短',
          icon: 'error'
        });
      } else {
        that.sendAudioMsg(res);
      }
    });
  };
  handleAuthenticate = (auth, authTitle = '请授权') => {
    return Promise.resolve(
      Taro.getSetting()
        .then(res => {
          let recordAuth = res.authSetting[`scope.${auth}`];
          if (recordAuth == false) {
            //已申请过授权，但是被用户拒绝
            return Taro.openSetting()
              .then(res => {
                let recordAuth = res.authSetting[`scope.${auth}`];
                if (recordAuth == true) {
                  Taro.showToast({
                    title: '授权成功',
                    icon: 'success'
                  });
                  return 'validated';
                } else {
                  Taro.showToast({
                    title: authTitle,
                    icon: 'success'
                  });
                  return 'rejected';
                }
              })
              .catch(err => {
                Taro.showToast({
                  title: '鉴权失败',
                  icon: 'error'
                });
                return 'rejected';
              });
          } else if (recordAuth == true) {
            //用户同意授权
            return 'validated';
          } else {
            //第一次进来，未发起授权
            return Taro.authorize({
              scope: `scope.${auth}`
            })
              .then(() => 'validated')
              .catch(() => {
                Taro.showToast({
                  title: '鉴权失败，请重试',
                  icon: 'error'
                });
                return 'failed';
              });
          }
        })
        .catch(() => {
          Taro.showToast({
            title: '鉴权失败，请重试',
            icon: 'error'
          });
          return 'failed';
        })
    );
  };
  handleVoiceTouchStar = () => {
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
                success: function(res) {
                  let recordAuth = res.authSetting['scope.record'];
                  if (recordAuth == true) {
                    Taro.showToast({
                      title: '授权成功',
                      icon: 'success'
                    });
                  } else {
                    Taro.showToast({
                      title: '请授权录音',
                      icon: 'success'
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
                    icon: 'success'
                  });
                }
              });
            }
          },
          fail: function() {
            Taro.showToast({
              title: '鉴权失败，请重试',
              icon: 'error'
            });
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
    const { im_id, sendPinupEmoji } = this.props;

    if (type === 'emoji') {
      this.setState(state => {
        const { inputValue } = state;
        return {
          inputValue: inputValue + key
        };
      });
    }
    if (type === 'pinup') {
      sendPinupEmoji(im_id, name, key);
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
  render() {
    const {
      inputValue,
      autoFocus,
      inputMode,
      recordStart,
      emojiType,
      emojiAlbum
    } = this.state;
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
          bottom: this.inputModeBelongs('expression', 'addition') ? '20px' : 0
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
                ref="inputRef"
                value={inputValue}
                confirmType="send"
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
                onFocus={this.handleInputFocus}
                onBlur={this.handleInputBlur}
                onConfirm={this.onInputConfirm}
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
            <View
              className={`${globalStyles.global_iconfont} ${styles.addition}`}
              onClick={e => this.handleClickedItem(e, 'addition')}
            >
              &#xe632;
            </View>
          )}
        </View>
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
                        mode="aspectFill"
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
                      mode="aspectFill"
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
              indicatorColor="#F1F1F1"
              indicatorActiveColor="#C1C1C1"
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
      </View>
    );
  }
}

export default UserInput;
