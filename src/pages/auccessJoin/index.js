import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text, Input, } from '@tarojs/components'
import indexStyles from './index.scss'
import auccess_Join_image from '../../asset/Invitation/auccess_Join.png'
import pc_Website_image from '../../asset/Invitation/pcWebsite.png'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import { connect } from '@tarojs/redux'

@connect(({ im: { allBoardList, }, }) => ({
  allBoardList,
}))
export default class auccessJoin extends Component {
  config = {
    navigationBarTitleText: '聆悉'
  }
  constructor() {
    super(...arguments)
    this.state = {
      copyText: '复制',
      pcWebsite: 'lingxi.di-an.com',
      board_id: '',
    }
  }

  componentDidMount() {
    const param = this.$router.params
    const route = param.pageRoute
    const { boardId } = param

    this.setState({
      board_id: boardId,
    })
    // const isLoginStatus = Taro.getStorageSync('isLoginStatus')
    // if (route === "acceptInvitation" && isLoginStatus === 'yes') {
    //   const { dispatch } = this.props
    //   dispatch({
    //     type: 'login/registerIm',
    //   });
    // }
    // else {
    this.getOrgList()
    this.fetchAllIMTeamList()
    // }
  }
  componentWillReceiveProps() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

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

  copyPCWebsite = () => {
    const { pcWebsite } = this.state
    Taro.setClipboardData({
      data: pcWebsite,
      success: function () {
      }
    }).then()

    this.setState({
      copyText: '复制成功',
    })
  }

  enterUse = () => {

    //查找当前文件对应的board, 对应的im_id
    const { board_id } = this.state

    Taro.navigateTo({
      url: `../../pages/chat/index?boardId=${board_id}&pageSource=auccessJoin`
    })
  }

  render() {
    const { copyText } = this.state
    return (
      <View className={`${globalStyles.global_horrizontal_padding}`} >
        <View className={indexStyles.contain1}>
          <Image src={auccess_Join_image} className={indexStyles.auccess_Join} />
        </View>
        <View className={indexStyles.text1}>已成功加入项目</View>
        <View className={indexStyles.text2}>
          <Text>在PC上输入以下网址可访问聆悉网页版</Text>
        </View>
        <View className={indexStyles.cardTip}>
          <Image src={pc_Website_image} className={indexStyles.pc_Website_image} />
          <View className={indexStyles.pcWebsiteStyle}>
            <View className={indexStyles.cardContentStyle}>
              <View className={indexStyles.inputStyle}>
                <Text className={`${globalStyles.global_iconfont} ${indexStyles.iconfont_size}`}>&#xe6bd;</Text>
                <Text selectable={true}>{pcWebsite}</Text>
              </View>
              {copyText === '复制成功' ?
                <View className={indexStyles.copySuccessStyle}>{copyText}</View>
                :
                <View className={indexStyles.copyButtonStyle} onClick={this.copyPCWebsite} >{copyText}</View>
              }
            </View>
          </View>
        </View>
        <Button className={`${indexStyles.effective_login_btn_wx} ${indexStyles.effective_acceptBtn}`} onClick={this.enterUse}>进入小程序使用</Button>
      </View>
    )
  }
}



