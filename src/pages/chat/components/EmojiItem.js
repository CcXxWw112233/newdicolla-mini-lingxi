import Taro, { Component } from '@tarojs/taro';
import { Text, Image } from '@tarojs/components';

class EmojiItem extends Component {
  render() {
    const { categ, cont } = this.props;
    if (categ === 'emoji') {
      return (
        <Image
          src={cont}
          style={{
            width: '24px',
            height: '24px',
            verticalAlign: 'middle',
            lineHeight: '24px'
          }}
        />
      );
    }
    return (
      <Text
        style={{ lineHeight: '24px', height: '24px', verticalAlign: 'middle' }}
      >
        {cont}
      </Text>
    );
  }
}

EmojiItem.defaultProps = {
  categ: 'text',
  cont: ''
};

export default EmojiItem;
