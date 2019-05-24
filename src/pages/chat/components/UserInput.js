import Taro, { Component } from '@tarojs/taro';
import { View, Input, Text } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import styles from './UserInput.scss';
import globalStyles from './../../../gloalSet/styles/globalStyles.scss';
import { onMsg } from './../../../models/im/actions/index';

@connect(
  ({
    im: {
      currentGroup: { im_id },
      nim
    }
  }) => ({ im_id, nim }),
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
      })
  })
)
class UserInput extends Component {
  state = {
    inputValue: '',
    autoFocus: false,
    inputMode: 'text', //输入模式，默认 'text'. 'text' | voice | expression | addition
    recordStart: false, // 录音开始
    recorderManager: null //录音内容
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
  handleClickedItem = (e, type) => {
    if (e) e.stopPropagation();
    const typeCond = {
      voice: () => this.handleVoiceInput(),
      text: () => this.handleTextInput()
    };
    if (!typeCond[type]) {
      Taro.showToast({
        title: '未完成功能',
        icon: 'none'
      });
      return;
    }
    typeCond[type]();
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
  componentWillUnmount() {
    this.setState({
      recorderManager: null
    });
  }
  render() {
    const { inputValue, autoFocus, inputMode, recordStart } = this.state;
    return (
      <View className={styles.wrapper}>
        <View className={styles.contentWrapper}>
          {inputMode === 'text' && (
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
          {inputMode === 'text' && (
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
          <View
            className={`${globalStyles.global_iconfont} ${styles.expression}`}
            onClick={e => this.handleClickedItem(e, 'expression')}
          >
            &#xe631;
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
      </View>
    );
  }
}

export default UserInput;
