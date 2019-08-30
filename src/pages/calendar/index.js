import Taro, { Component } from '@tarojs/taro'
import { View , Button} from '@tarojs/components'
import CardList from './components/CardList'
import indexStyles from './index.scss'
import globalStyles from '../../gloalSet/styles/globalStyles.scss'
import CardTypeSelect from './components/CardTypeSelect/index'
import SearchAndMenu from '../board/components/SearchAndMenu'
import CalendarSwiper from './components/CalendarSwiper'
import MilestoneList from './components/MilestoneList'
import { connect } from '@tarojs/redux'

@connect(({ calendar: { no_sche_card_list, selected_board_name, page_number, isReachBottom } }) => ({
  no_sche_card_list, selected_board_name, page_number, isReachBottom,
}))
export default class Calendar extends Component {

  config = {
    navigationBarTitleText: '',
    "enablePullDownRefresh": true,
    "backgroundColor": '#696969',
    "onReachBottomDistance": 50  //默认值50
  }

  onPullDownRefresh(res) {  //下拉刷新...
    this.getNoScheCardList()
    this.getScheCardList({})
    this.getOrgBoardList()
    this.getSignList()

    Taro.showNavigationBarLoading()
    setTimeout(function () {
      Taro.stopPullDownRefresh()
      Taro.hideNavigationBarLoading()
    }, 300)
  }

  onReachBottom () {    //上拉加载...
    const isReachBottom = this.props.isReachBottom
    if (isReachBottom === true) {
      this.pagingGet()
    }
  }

  state= {
    show_card_type_select: '0',
    search_mask_show: '0'
  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillUnmount () { }

  componentWillMount () { }

  componentDidMount() {
    const switchTabCurrentPage = 'currentPage_BoardDetail_or_Login'
    const routeSource = Taro.getStorageSync('switchTabCurrentPage')
    if (routeSource === switchTabCurrentPage) {
      Taro.removeStorageSync('switchTabCurrentPage')
    }
    else { 
      this.registerIm()
    }
  }

  componentDidShow () {
    const { selected_board_name } = this.props
    Taro.setNavigationBarTitle({
      title: selected_board_name
    })
    this.getOrgList()
    this.getOrgBoardList()
    this.getNoScheCardList()
    this.getScheCardList({})
    this.getSignList()
  }

  //获取项目列表
  getOrgBoardList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'calendar/getOrgBoardList',
      payload: {}
    })
  }

  //获取尚未排期列表
  getNoScheCardList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'calendar/getNoScheCardList',
      payload: {}
    })
  }
  // 获取排期列表
  getScheCardList = (payload = {}) => {
    const { dispatch } = this.props
    dispatch({
      type: 'calendar/getScheCardList',
      payload: {
        ...payload
      }
    })
  }

  pagingGet = () => {
    const { page_number, dispatch } = this.props
    let new_page_number = page_number
    new_page_number = new_page_number + 1
    dispatch({
      type: 'calendar/updateDatas',
      payload: {
        page_number: new_page_number
      }
    })
    
    this.getScheCardList({type: 1})
  }

  // 获取组织列表
  getOrgList = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'my/getOrgList',
      payload: {}
    })
  }

  //获取打点列表
  getSignList = (month) => {
    const { dispatch } = this.props
    dispatch({
      type: 'calendar/getSignList',
      payload: {
        month
      }
    })
  }

  componentDidHide () { }

  onSelectType = ({show_type}) => {
    this.setState({
      show_card_type_select: show_type,
      search_mask_show: show_type
    })
  }

  gotoNoSchedule = () => {
    const { selected_board_name } = this.props
    Taro.navigateTo({
      url: `../../pages/noSchedulesCard/index?title=${selected_board_name}`
    })
  }

  newlyBuildThingProject = () => {
    Taro.navigateTo({
      url: '../../pages/addingTasks/index'
    })
  }

  registerIm = () => {
    const initImData = async () => {
      const { dispatch } = this.props;
      const { account, token } = await dispatch({
        type: 'im/fetchIMAccount'
      });
      await dispatch({
        type: 'im/initNimSDK',
        payload: {
          account,
          token
        }
      });
      return await dispatch({
        type: 'im/fetchAllIMTeamList'
      });
    };
    initImData().catch(e => Taro.showToast({ title: String(e), icon: 'none' }));
  }

  render () {
    const { show_card_type_select, search_mask_show } = this.state
    const { no_sche_card_list = [] } = this.props
    return (
      <View>
        <SearchAndMenu onSelectType={this.onSelectType} search_mask_show={search_mask_show} />
        <CalendarSwiper  />
        <CardTypeSelect show_card_type_select={show_card_type_select} onSelectType={this.onSelectType} schedule={'1'}/>
        <MilestoneList schedule={'1'}/>
        {no_sche_card_list.length && (
          <View className={`${globalStyles.global_card_out} ${indexStyles.no_scheduling}`} onClick={this.gotoNoSchedule}>暂未排期的工作（{no_sche_card_list.length}）</View>
        )}
        <CardList schedule={'1'}/>
        <View style='height: 50px'></View>
      </View>
    )
  }
}

