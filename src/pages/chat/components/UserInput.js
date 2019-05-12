import Taro, { Component } from '@tarojs/taro';
import { View, Input } from '@tarojs/components';
import { connect } from '@tarojs/redux';
import styles from './UserInput.scss';
import globalStyles from './../../../gloalSet/styles/globalStyles.scss';

@connect(
  ({
    im: {
      currentGroup: { im_id }
    }
  }) => ({ im_id }),
  dispatch => ({
    sendTeamTextMsg: (text, scene, to) =>
      dispatch({
        type: 'im/sendMsg',
        payload: {
          type: 'text',
          text,
          scene,
          to
        },
        desc: 'im send msg'
      })
  })
)
class UserInput extends Component {
  state = {
    inputValue: ''
  };
  handleInput = e => {
    console.log(e,'eeeeeeeeeeeeeeeeeeeeeeeeee')
    // if (e) e.stopPropagation();
    this.setState({
      inputValue: e.currentTarget.value
    });
  };
  sendTextMsg = () => {
    const { inputValue } = this.state;
    const { im_id, sendTeamTextMsg } = this.props;
    if(!im_id) {
      Taro.showToast({
        title: '未获取到群消息',
        icon: 'none'
      });
      return
    }
    if (!inputValue) {
      // Taro.showToast({
      //   title: '请不要发空消息',
      //   icon: 'none'
      // });
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
    Promise.resolve(sendTeamTextMsg(inputValue, 'team', im_id))
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
    this.sendTextMsg();
  };
  handleClickedItem = e => {
    if(e) e.stopPropagation()
    Taro.showToast({
      title: '未完成功能',
      icon: 'none',
    })
  }
  render() {
    const { inputValue } = this.state;
    return (
      <View className={styles.wrapper}>
        <View className={styles.contentWrapper}>
          <View className={`${globalStyles.global_iconfont} ${styles.voice}`} onClick={e => this.handleClickedItem(e, 'voice')}>
            &#xe648;
          </View>
          <View className={styles.input}>
            <Input
              value={inputValue}
              confirmType="send"
              style={{
                lineHeight: '84px',
                width: '450px',
                marginLeft: '10px',
                marginRight: '10px'
              }}
              onInput={this.handleInput}
              onConfirm={this.onInputConfirm}
            />
          </View>
          <View
            className={`${globalStyles.global_iconfont} ${styles.expression}`}
            onClick={e => this.handleClickedItem(e, 'expression')}
          >
            &#xe631;
          </View>
          <View
            className={`${globalStyles.global_iconfont} ${styles.addition}`}
            onClick={e => this.handleClickedItem(e, 'addition')}
          >
            &#xe632;
          </View>
        </View>
      </View>
    );
  }
}

export default UserInput;
