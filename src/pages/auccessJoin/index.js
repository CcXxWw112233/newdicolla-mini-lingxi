import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import indexStyles from './index.scss'
import auccess_Join_image from '../../asset/Invitation/auccess_Join.png'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ auccessJoin }) => ({
  auccessJoin
}))
export default class auccessJoin extends Component {
  config = {
    navigationBarTitleText: '灵犀协作'
  }
  constructor() {
    super(...arguments)
    this.state = {
      djsTime: 3,					//倒计时时间 5’s
      Loadingtime: '',			// 计时器
    }
  }

  componentDidMount() {
    const params = this.$router.params
    const route = params.pageRoute
    if (route === "acceptInvitation") {
      const { dispatch } = this.props
      dispatch({
        type: 'login/registerIm',
      });
    } 
    else {
      this.getOrgList()
      this.fetchAllIMTeamList()
    }

    const boardId = Taro.getStorageSync('board_Id');
    let that = this
    this.setState({
      Loadingtime: setInterval(function () { // 执行计时器
        if (that.state.djsTime > 0) {
          that.state.djsTime--;
          that.setState({ djsTime: that.state.djsTime })
        } else { //倒计时结束
          clearInterval(that.state.Loadingtime);
          Taro.navigateTo({
            url: `../../pages/boardDetail/index?push=auccessJoin&&boardId=${boardId}`
          })
        }
      }, 1000)
    })
  }
  componentWillReceiveProps() {
  }
  componentWillUnmount() {
    clearInterval(this.state.Loadingtime); // 清除计时器
  }
  componentDidShow() {
  }
  componentDidHide() {
  }

  // 获取组织列表
  getOrgList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'my/getOrgList',
      payload: {}
    })
  }

  fetchAllIMTeamList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'im/fetchAllIMTeamList',
      payload: {

      }
    })
  }

  render() {
    return (
      <View className={`${globalStyles.global_horrizontal_padding}`}>
        <View className={indexStyles.contain1}>
          <Image src={auccess_Join_image} className={indexStyles.auccess_Join} />
        </View>
        <View className={indexStyles.text1}>已成功加入项目</View>
        <View className={indexStyles.text2}>
          <Text>正在为你跳转小程序，你也可以前往网页\n或者App展开协作</Text>
        </View>
      </View>
    )
  }
}

