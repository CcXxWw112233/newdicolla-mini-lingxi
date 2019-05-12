import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtRate } from 'taro-ui';
import styles from './BoardStar.scss';
import { connect } from '@tarojs/redux';

//star: 0, //显示的星星数
@connect(({ im: { allBoardList, currentBoardId } }) => ({
  allBoardList,
  currentBoardId,
}))
class BoardStar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      star: 2, //这个实现上是要真实数据的，现在为了演示定义在这里
    }
    this.starMap = ['未评级', '1星级', '2星级', '3星级', '4星级', '5星级'] //星星文字映射
  }
  onStarChange = value => {
    //这里发起改变星星的请求
    const {star} = this.state

    //如果点击相同的星级，那么重置为未评级
    if(value === star) {
      this.setState({
        star: 0
      })
    } else {
      this.setState({
        star: value
      })
    }
  }
  getCurrentBoardStar = (list = [], id) => {
    const result = list.find(i => i.board_id === id);
    return result&&result.star ? result.star : 2
  };
  render() {
    // const {allBoardList, currentBoardId} = this.props;
    // const star = this.getCurrentBoardStar(allBoardList, currentBoardId)
    const {star} = this.state

    return (
      <View className={styles.wrapper}>
        <View className={styles.titleWrapper}>
          <Text className={styles.title}>项目星级</Text>
        </View>
        <View className={styles.contentWrapper}>
          <View className={styles.contentStar}>
            <AtRate
              size="38"
              value={star}
              onChange={this.onStarChange}
              margin={19}
            />
          </View>
          <Text className={styles.contentStarText}>{this.starMap[star]}</Text>
        </View>
      </View>
    );
  }
}

BoardStar.defaultProps = {
  allBoardList: [], //所有的项目
  currentBoardId: '' //当前的 项目 id
};

export default BoardStar;
