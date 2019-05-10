import Taro, {Component} from '@tarojs/taro'
import { View } from '@tarojs/components';
import styles from './index.scss'
import GroupList from './components/GroupList'

class BoardDetail extends Component {
  state = {
    currentBoardId: ''
  }
  componentWillMount() {
    const {boardId} = this.$router.params
    this.setState({
      currentBoardId: boardId
    })
  }
  render() {
    const {currentBoardId} = this.state

    return (<View className={styles.wrapper}>
      <View className={styles.imGroupWrapper}>
        <GroupList currentBoardId={currentBoardId} />
      </View>
    </View>)
  }
}

export default BoardDetail
