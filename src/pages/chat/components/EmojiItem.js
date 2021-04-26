import Taro, { Component } from '@tarojs/taro';
import { Text, Image } from '@tarojs/components';

class EmojiItem extends Component {
  render() {
    const { categ, cont ,flow} = this.props;
    
    if(flow == 'out') {
      
    }
    //过滤掉<dev>等标签
    const newCont = cont.replace(/<\/?[^>]*>/g, '\n')
    
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
      <Text decode='true' 
        style={{ lineHeight: '24px', height: '24px', verticalAlign: 'middle' }}
        
      >
        {newCont}
      </Text>
    );
  }
}

EmojiItem.defaultProps = {
  categ: 'text',
  cont: ''
};

export default EmojiItem;
