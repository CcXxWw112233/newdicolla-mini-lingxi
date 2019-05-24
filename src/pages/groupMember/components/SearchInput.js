import Taro, { Component } from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import styles from './SearchInput.scss';

class SearchInput extends Component {
  state = {
    isShowPlaceHolder: true
  };
  handleInputFocus = () => {
    this.setState({
      isShowPlaceHolder: false
    });
  };
  handleInputBlur = () => {
    this.setState({
      isShowPlaceHolder: true,
    })
  }
  render() {
    const { value, disabled, onInput, onConfirm, inputStyle } = this.props;
    const { isShowPlaceHolder } = this.state;
    return (
      <View className={styles.wrapper}>
        <View className={styles.contentWrapper}>
          <Input
            className={styles.input}
            style={inputStyle}
            value={value}
            disabled={disabled}
            onInput={onInput}
            onConfirm={onConfirm}
            adjustPosition={false}
            confirmType="search"
            onFocus={this.handleInputFocus}
            onBlur={this.handleInputBlur}
          />
          {!value && isShowPlaceHolder && (
            <View className={styles.placeHolder}>
              <AtIcon
                className={styles.placeHolderIcon}
                value="search"
                size="18"
                color="#B2B2B2"
              />
              <Text className={styles.placeHolderText}>搜索</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

SearchInput.defaultProps = {
  value: '', // search input value
  disabled: false, //is should disable search input
  onInput: function() { //search input callback
  },
  onConfirm: function() { //search input confirm

  },
  inputStyle: {},
};

export default SearchInput;
